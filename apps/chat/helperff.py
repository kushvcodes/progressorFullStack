#     def get_ai_response(self, message):
#         client = genai.Client(api_key="AIzaSyDtp_dY_SFfprBzIyFiLVnlWnfQKlXWHnU")
#         response = client.models.generate_content(
#                 model="gemini-2.0-flash", contents=message
#              )
#         return f"{response.text}"

#  # Get AI response
#         ai_response = await sync_to_async(self.get_ai_response)(message)
        