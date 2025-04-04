import re
from difflib import get_close_matches
from typing import Tuple, Optional
from django.utils import timezone
from apps.tasks.models import Task
# Add at the top with other imports
from django.core.cache import cache
from google import genai
from datetime import datetime, timedelta
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import logging
import requests

# Initialize logger
logger = logging.getLogger(__name__)

# Initialize models (add after imports)
gemini_client = genai.Client(api_key="AIzaSyDtp_dY_SFfprBzIyFiLVnlWnfQKlXWHnU")

# List of supported commands
# Add to SUPPORTED_COMMANDS set
SUPPORTED_COMMANDS = {
    '@task', '@delete', '@update', '@show', '@pending', '@progress', 
    '@complete', '@high', '@low', '@normal', '@veryhigh', '@verylow',
    '@today', '@tomorrow', '@missed', '@help'  # Added @help
}

def extract_command(message: str) -> Tuple[Optional[str], str]:
    """
    Extract command from message if present.
    
    Args:
        message: User input message
        
    Returns:
        Tuple of (command, remaining_message)
    """
    # Check for @command pattern
    match = re.match(r'^(@\w+)\b', message.strip())
    if match:
        command = match.group(1).lower()
        remaining = message[match.end():].strip()
        return command, remaining
    return None, message.strip()

def get_closest_command(user_command: str) -> Optional[str]:
    """
    Find closest matching command to what user entered.
    
    Args:
        user_command: The command user tried to use
        
    Returns:
        Closest matching command or None if no good match
    """
    return get_close_matches(user_command, SUPPORTED_COMMANDS, n=1, cutoff=0.6)[0] if get_close_matches(user_command, SUPPORTED_COMMANDS, n=1, cutoff=0.6) else None

CONFIRMATION_PREFIX = "confirm:"
TASK_COMMANDS = {'@task'}

def process_message(user, message: str) -> str:
    """
    Process user message and return appropriate response.
    """
    # Check if this is a confirmation response
    if message.lower().strip() in ('yes', "'yes'"):
        pending_action = cache.get(f"pending_action_{user.id}")
        if pending_action:
            cache.delete(f"pending_action_{user.id}")
            command, task_data = pending_action
            return f"Executing {command}: {task_data}"
    
    command, remaining = extract_command(message)
    
    # Handle help command
    if command == '@help':
        return get_help_message(remaining)
    
    # Handle task and show commands immediately
    if command in {'@task', '@show'}:
        return execute_command(user, command, remaining)
    
    # If no command found, analyze the message
    if not command:
        return analyze_freeform_message(user, remaining)
    
    # Check if command is valid
    if command not in SUPPORTED_COMMANDS:
        closest = get_closest_command(command)
        if closest:
            return f"Unknown command '{command}'. Did you mean '{closest}'?"
        return f"Unknown command '{command}'. Type '@help' to see available commands."
    
    # For modifying commands, require confirmation
    if command in {'@update', '@delete'}:
        cache.set(f"pending_action_{user.id}", (command, remaining), timeout=60)
        return f"Please confirm you want to {command[1:]} this task: '{remaining}' (reply 'yes' to confirm)"
    
    # Process show commands immediately
    return process_show_command(user, command, remaining)

def analyze_freeform_message(user, message: str) -> str:
    """
    Analyze freeform message and provide appropriate response.
    
    Args:
        user: The user sending the message
        message: The message content
        
    Returns:
        Response to send back to user
    """
    message_lower = message.lower()
    
    # Check for common question patterns
    if any(q in message_lower for q in ['what do you advice', 'what should i do', 'any suggestions']):
        return analyze_productivity_trends(user)
    
    # Check for task-related phrases
    task_phrases = ['task', 'todo', 'remind', 'remember']
    if any(phrase in message_lower for phrase in task_phrases):
        return "It seems you're asking about tasks. You can say '@task [description]' to create a new task."
    
    return "I'm not sure what you're asking. You can use commands like '@task', '@show', etc. for specific actions."

def analyze_productivity_trends(user) -> str:
    """
    Analyze user's recent task completion trends.
    
    Args:
        user: The user to analyze
        
    Returns:
        Analysis message
    """
    # Get tasks from last 5 days
    five_days_ago = timezone.now() - timezone.timedelta(days=5)
    recent_tasks = Task.objects.filter(
        user=user,
        created_at__gte=five_days_ago
    )
    
    # Basic analysis
    completed = recent_tasks.filter(status='completed').count()
    total = recent_tasks.count()
    completion_rate = (completed / total * 100) if total > 0 else 0
    
    priorities = recent_tasks.values_list('priority', flat=True)
    priority_dist = {
        'high': priorities.count('h') + priorities.count('vh'),
        'normal': priorities.count('n'),
        'low': priorities.count('l') + priorities.count('vl')
    }
    
    return (
        f"Here's your productivity analysis for last 5 days:\n"
        f"- Completed {completed}/{total} tasks ({completion_rate:.1f}%)\n"
        f"- Priority distribution: {priority_dist['high']} high, {priority_dist['normal']} normal, {priority_dist['low']} low\n"
        f"Tip: Try focusing on high priority tasks first!"
    )

def process_show_command(user, command: str, filter_text: str) -> str:
    """
    Process commands that show task information.
    
    Args:
        user: The user making the request
        command: The show command
        filter_text: Additional filter text
        
    Returns:
        Task information response
    """
    filters = {
        '@pending': {'status': 'pending'},
        '@progress': {'status': 'in_progress'},
        '@complete': {'status': 'completed'},
        '@high': {'priority__in': ['h', 'vh']},
        '@low': {'priority__in': ['l', 'vl']},
        '@normal': {'priority': 'n'},
        '@veryhigh': {'priority': 'vh'},
        '@verylow': {'priority': 'vl'},
        '@today': {'due_date__date': timezone.now().date()},
        '@tomorrow': {'due_date__date': timezone.now().date() + timezone.timedelta(days=1)},
        '@missed': {'due_date__lt': timezone.now(), 'status__in': ['pending', 'in_progress']}
    }
    
    # Get base queryset
    tasks = Task.objects.filter(user=user)
    
    # Apply command filter if available
    if command in filters:
        tasks = tasks.filter(**filters[command])
    
    # Apply additional text filter if provided
    if filter_text:
        tasks = tasks.filter(title__icontains=filter_text)
    
    count = tasks.count()
    if count == 0:
        return f"No tasks found matching '{command[1:]} {filter_text}'"
    
    sample_tasks = tasks.order_by('-created_at')[:3]
    task_list = "\n".join(f"- {task.title} ({task.status}, {task.priority})" for task in sample_tasks)
    
    return (
        f"Found {count} tasks matching '{command[1:]} {filter_text}':\n"
        f"{task_list}\n"
        f"Type '@show {command[1:]} [more details]' to see more"
    )


def execute_command(user, command: str, task_data: str) -> str:
    """
    Execute the actual command after confirmation or for task creation.
    """
    if command == '@task':
        try:
            return create_task(user, task_data)
        except Exception as e:
            logger.error(f"Task creation failed: {str(e)}")
            return "Failed to create task. Please try again."
    elif command == '@show':
        return show_tasks(user, task_data)
    return f"Executed {command} with data: {task_data}"

def create_task(user, task_title: str) -> str:
    print(user)
    """
    Create a new task with automatic categorization, priority, time estimation,
    and normalized scoring (out of 30) based on difficulty and urgency.
    Returns a string response that can be rendered in React.
    """
    if not task_title.strip():
        return "Please provide a task description after @task"

    # Parse date references from task title
    due_date, remaining_title = parse_due_date_reference(task_title)
    
    # Get priority from Gemini
    try:
        priority_prompt = f"Given this task: '{remaining_title}', assign a priority level (1-5) where 1 is lowest and 5 is highest. Return ONLY the number."
        priority_response = gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=priority_prompt
        )
        priority_map = {'5': 'vh', '4': 'h', '3': 'n', '2': 'l', '1': 'vl'}
        priority = priority_map.get(priority_response.text.strip(), 'n')
    except Exception as e:
        logger.error(f"Priority assignment failed: {str(e)}")
        priority = 'n'

    # Get difficulty estimate (1-10 scale)
    try:
        difficulty_prompt = f"Rate difficulty of this task (1-10, 10=hardest): '{remaining_title}'. Return ONLY the number."
        difficulty_response = gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=difficulty_prompt
        )
        difficulty = min(10, max(1, int(difficulty_response.text.strip())))
    except Exception as e:
        logger.error(f"Difficulty estimation failed: {str(e)}")
        difficulty = 5

    # Get time estimate in hours
    try:
        time_prompt = f"Estimate time required for this task in hours: '{remaining_title}'. Return ONLY the number."
        time_response = gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=time_prompt
        )
        hours = max(0.1, float(time_response.text.strip()))  # Ensure minimum 0.1 hours
    except Exception as e:
        logger.error(f"Time estimation failed: {str(e)}")
        hours = 1.0

    # Calculate due date if not specified
    if due_date is None:
        due_date = datetime.now() + timedelta(hours=hours)
    
    # Adjust deadline to reasonable hours (6AM-11PM)
    if due_date.hour < 6:  # Before 6AM
        due_date = due_date.replace(hour=9, minute=0)  # Move to 9AM same day
    elif due_date.hour >= 23:  # 11PM or later
        due_date = due_date.replace(hour=21, minute=0) + timedelta(days=1)  # Move to 9PM next day
    
    # Calculate normalized score (out of 30)
    priority_weights = {'vh': 3, 'h': 2.5, 'n': 2, 'l': 1.5, 'vl': 1}
    score = min(30, round(
        (difficulty * 2) *  # Difficulty contributes 2/3 of score (max 20)
        (priority_weights.get(priority, 1))  # Priority contributes 1/3 (max 10)
    ))

    # Get category
    try:
        category = categorize_task(remaining_title)
    except Exception as e:
        logger.error(f"Category assignment failed: {str(e)}")
        category = "General"
    
    # Format API request payload with exact field names
    api_payload = {
        "title": remaining_title,
        "description": f"Automatically created task: {remaining_title}",
        "category": category.lower()[0] if category else "g",
        "priority": priority,
        "est_points": score,
        "status": "pending",
        "due_date": due_date.isoformat() if due_date else None,
        "est_time": int(round(hours)),  # Convert to integer
        "start_date": None
    }

    try:
        # For JWT authentication
        from rest_framework_simplejwt.tokens import RefreshToken
        token = RefreshToken.for_user(user)
        headers = {
            'Authorization': f'Bearer {str(token.access_token)}',
            'Content-Type': 'application/json'
        }
        
        # Debug print the payload before sending
        logger.info(f"Sending API payload: {api_payload}")
        
        response = requests.post(
            'http://localhost:8000/api/tasks/',
            json=api_payload,
            headers=headers
        )
        response.raise_for_status()
        
        # Format success response
        friendly_deadline = due_date.strftime("%A, %B %d at %I:%M %p")
        return (
            f"✅ Task saved successfully!\n\n"
            f"📌 {remaining_title}\n"
            f"⏰ Due: {friendly_deadline}\n"
            f"🏷️ Category: {category}\n\n"
            f"You can view and manage this task in your Tasks tab.\n"
            f"Good luck with your task! 🚀"
        )
        
    except Exception as e:
        logger.error(f"API request failed: {str(e)}")
        return "Failed to save task. Please try again later."

def parse_due_date_reference(text: str) -> Tuple[Optional[datetime], str]:
    """
    Parse date references from task text and return (due_date, remaining_text).
    """
    date_phrases = {
        'today': timedelta(hours=0),
        'tomorrow': timedelta(days=1),
        'next week': timedelta(weeks=1),
        'in 2 days': timedelta(days=2),
        'in 3 days': timedelta(days=3),
        'next month': timedelta(days=30)
    }
    
    remaining_text = text
    due_date = None
    
    for phrase, delta in date_phrases.items():
        if phrase in text.lower():
            due_date = datetime.now() + delta
            remaining_text = text.lower().replace(phrase, '').strip()
            break
            
    return due_date, remaining_text

# Add with other imports at the top
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Initialize models after imports (with other model initializations)
task_tokenizer = AutoTokenizer.from_pretrained("vagrawal787/todos_task_model", local_files_only=False)
task_model = AutoModelForSequenceClassification.from_pretrained(
    "vagrawal787/todos_task_model",
    local_files_only=False,  # Changed from True to False to allow downloading
    device_map="cpu"
)
# Add quantization
task_model = torch.quantization.quantize_dynamic(task_model, {torch.nn.Linear}, dtype=torch.qint8)
print("Model labels:", task_model.config.id2label)
def categorize_task(task_text: str) -> str:
    """
    Categorize task using vagrawal model.
    """
    try:
        inputs = task_tokenizer(task_text, return_tensors="pt", truncation=True, padding=True)
        outputs = task_model(**inputs)
        predicted_label = outputs.logits.argmax().item()
        return task_model.config.id2label[predicted_label]
    except Exception as e:
        logger.error(f"Task categorization failed: {str(e)}")
        return "General"

def show_tasks(user, filter_text: str = "") -> str:
    """
    Show tasks matching filter criteria.
    Returns a formatted string response instead of an object.
    """
    # Get actual tasks from database
    tasks = Task.objects.filter(user=user)
    
    if filter_text:
        tasks = tasks.filter(title__icontains=filter_text)
    
    count = tasks.count()
    if count == 0:
        return "No tasks found" + (f" matching '{filter_text}'" if filter_text else "")
    
    sample_tasks = tasks.order_by('-created_at')[:3]
    task_list = "\n".join(
        f"- {task.title} (Priority: {task.priority}, Status: {task.status})" 
        for task in sample_tasks
    )
    
    return (
        f"Found {count} tasks" + (f" matching '{filter_text}'" if filter_text else "") + ":\n"
        f"{task_list}\n"
        f"Type '@show [more details]' to see more"
    )


def get_help_message(filter_text: str = "") -> str:
    """
    Generate help message showing available commands.
    
    Args:
        filter_text: Optional filter to show specific command help
    
    Returns:
        Help message string
    """
    command_groups = {
        "Task Management": [
            "@task [description] - Create new task",
            "@update [id/name] - Update existing task",
            "@delete [id/name] - Delete task"
        ],
        "Task Views": [
            "@show - Show all tasks",
            "@pending - Show pending tasks",
            "@progress - Show in-progress tasks",
            "@complete - Show completed tasks"
        ],
        "Priority Filters": [
            "@high - Show high priority tasks",
            "@low - Show low priority tasks",
            "@normal - Show normal priority tasks",
            "@veryhigh - Show very high priority tasks",
            "@verylow - Show very low priority tasks"
        ],
        "Time Filters": [
            "@today - Show tasks due today",
            "@tomorrow - Show tasks due tomorrow",
            "@missed - Show overdue tasks"
        ]
    }
    
    if filter_text:
        filter_text = filter_text.lower()
        filtered_help = []
        for group, commands in command_groups.items():
            matched = [cmd for cmd in commands if filter_text in cmd.lower()]
            if matched:
                filtered_help.append(f"{group}:\n" + "\n".join(matched))
        
        if filtered_help:
            return "Available commands matching '" + filter_text + "':\n\n" + "\n\n".join(filtered_help)
        return "No commands found matching '" + filter_text + "'"
    
    help_message = "Available commands:\n\n"
    for group, commands in command_groups.items():
        help_message += f"{group}:\n" + "\n".join(commands) + "\n\n"
    
    return help_message.strip()