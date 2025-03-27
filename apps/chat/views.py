from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from .models import Message
from django.db.models import Q

User = get_user_model()
@login_required
def chat(request):  # Accept 'room_name' as a parameter
    search_query = request.GET.get('search', '') 
    # Get messages where sender is the current user and receiver is AI, or vice versa
    chats = Message.objects.filter(
        Q(sender=request.user, receiver__username="AI") |  # User to AI
        Q(sender__username="AI", receiver=request.user)   # AI to User
    )
    if search_query:
        chats = chats.filter(Q(content__icontains=search_query))  

    chats = chats.order_by('timestamp')

    # Get the most recent message from AI to the user
    last_message = chats.last()

    return render(request, 'chat.html', {
        'chats': chats,
        'last_message': last_message,
        'search_query': search_query,
    })