# Progressor FullStack Project

## Project Overview
A full-stack application with Django backend and Node.js frontend, containerized with Docker.

## Prerequisites
- Docker and Docker Compose
- Make (optional but recommended)
- Node.js (for client development)
- Python 3.12 (for backend development)

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/kushvcodes/progressorFullStack.git
cd progressorFullStack
```

### 2. Configure environment variables
Create a `.env` file in the root directory(env.example for reference)
### 3. Build and start containers
```bash
make build  # If you have make installed
# OR
refere to ./makefile for commands
(This step might take time, depending upon your system)
```

### 4. Wait for backend to initialize
The API server may take up to 5-7 minutes to start due to Daphne optimizations.

### 5. Create superuser
```bash
make superuser
# OR
docker-compose exec api python manage.py createsuperuser
```

### 6. Access Admin Panel
- URL: http://localhost:8080/supersecret
- Login with your superuser credentials

### 7. Create initial user(IMPORTANT)
Create a user with these details(or with python shell if you want to use python django shell):
- Name: AI
- Email: AI@progressor.com
- Last Name: Progressor
- Permissions: is_active, is_staff

### 8. Access API Documentation
- URL: http://localhost:8080/documentation
- Password: DHBWSTUTTGART

## Contributing
Feel free to contribute to this project. For any issues with setup, please contact rharsh495@gmail.com.

## Support
If you find this project useful, consider supporting its development. I will
restart the project from scratch, and would be publishing it on kickstarter.
Any donations are appreciated.
