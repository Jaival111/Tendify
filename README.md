# Tendify - An Attendance Manager App

A modern web application to help students track and manage their class attendance effectively.

## Features

- 📊 Track attendance for multiple subjects
- 📈 View attendance statistics
- 📱 Responsive design for all devices
- 🔒 Secure authentication system

## Tech Stack

### Frontend
- React.js
- React Bootstrap
- React Router
- FontAwesome Icons
- React Circular Progressbar

### Backend
- FastAPI
- SQLAlchemy
- JWT Authentication

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/attendance-manager.git
cd attendance-manager
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd frontend/main
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```

2. Start the frontend development server:
```bash
cd frontend/main
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## API Documentation

Once the backend server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
attendance-manager/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── routers/
│       ├── auth_router.py
│       └── subject_router.py
└── frontend/
    └── main/
        ├── src/
        │   ├── components/
        │   ├── pages/
        │   ├── context/
        │   └── utils/
        └── public/
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- React Bootstrap for the UI components
- FastAPI for the backend framework

