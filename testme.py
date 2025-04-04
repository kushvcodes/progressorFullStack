# from google import genai

# client = genai.Client(api_key="AIzaSyDtp_dY_SFfprBzIyFiLVnlWnfQKlXWHnU")
# response = client.models.generate_content(
#     model="gemini-2.0-flash", contents="Hey, what is the weather today?"
# )
# print(response.text)

import requests
# import re
# from datetime import datetime
# from pytz import timezone
# import random

# ACCOUNT_ID = "5452f56c46a267c5fd2ab821f98b2540"
# AUTH_TOKEN = "PXfp0Xq6yN9-ZuNI45jEuKpEkF_sMAKjBNXV6-cb"


# url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@hf/mistralai/mistral-7b-instruct-v0.2"
# headers={"Authorization": f"Bearer {AUTH_TOKEN}"}
# def postReq(headers, data):
# 	return requests.post(
# 		url,
# 		headers=headers,
# 		json=data
#     )

# def retData(prompt):
# 	const = "Answer in Hinglish"
# 	return {
# 		"messages":[
# 			{"role": "user", "content":(prompt+const)}
#         ]
#     }

# prpt = "Hi I am harsh Vardhan Kushwaha"
# data = retData(prompt=prpt)
# response = postReq(headers=headers, data=data)
# result = response.json()
# print(result)

# API_URL = "https://api-inference.huggingface.co/models/vagrawal787/todos_task_model"
# headers = {"Authorization": "Bearer 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"}

# def query(payload):
# 	response = requests.post(API_URL, headers=headers, json=payload)
# 	return response.json()

# task = "Send an ema"
# output = query({
# 	"inputs": task,
# })


# def categorise(task):
# 	toReturn = query({"inputs":task,})
# 	return toReturn

# print(categorise(task))
print("starting")
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
print("starting")
# Force local files only
model_name = "vagrawal787/todos_task_model"
tokenizer = AutoTokenizer.from_pretrained(model_name, local_files_only=True)
print("starting")
model = AutoModelForSequenceClassification.from_pretrained(
    model_name,
    local_files_only=True,
    device_map="cpu"  # Explicit CPU allocation
)
print("starting")

# Add quantization
model = torch.quantization.quantize_dynamic(model, {torch.nn.Linear}, dtype=torch.qint8)

# Define categories (match the model's training labels)
# Use model's own label mapping
categories = [model.config.id2label[i] for i in range(len(model.config.id2label))]
print(categories)
print("starting")
# Define the categorization function
def categorize_task(task_text: str) -> str:
    inputs = tokenizer(task_text, return_tensors="pt", truncation=True, padding=True)
    outputs = model(**inputs)
    predicted_label = outputs.logits.argmax().item()
    return categories[predicted_label]

print("loaded")
# Test the function
tasks = ["Go to your doctor appointment for adhd meds", "buy groceries",
        "Text esha hi", "Focus on education"]
for i in tasks:
    print(categorize_task(i))
