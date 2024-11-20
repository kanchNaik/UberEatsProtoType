# Restaurant Management System

A full-stack application for managing restaurants, orders, and customer interactions.

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Python 3.x
- Node.js and npm
- PostgreSQL (recommended)

## 🐍 Backend Setup (Django)

1. **Install required Python packages:**

   ```bash
   pip install django djangorestframework django-cors-headers Pillow drf-yasg
   ```

2. **Make and apply migrations:**
  ```bash
  python manage.py makemigrations
  python manage.py migrate
```

3. **Run the Django development server:**
```bash
python manage.py runserver
```

The API will be available at http://localhost:8000/.

## 🌟 Frontend Setup (React)

1. **Install Node.js dependencies:**
```bash
npm install
```

2. **Install additional required packages:**
```bash
npm install bootstrap-icons react-icons react-router-dom @reduxjs/toolkit react-redux
```

3. **Rename component files (if needed):**
```bash
cd src/Components/Home
mv home.js Home.js
mv home.css Home.css
cd ../../..
```

4. **Start the React development server:**
```bash
npm start
```
The application will be available at http://localhost:3000/.
## 🛠 Built With
Django - The backend framework
Django REST Framework - For building Web APIs
React - The frontend library
Redux - State management
Bootstrap - For responsive design
## 📚 Features
User authentication (Customer and Restaurant)
Restaurant profile management
Menu creation and management
Order placement and tracking
Favorites management for customers

Notion link for API responses and additional screenshots
https://amenable-caraway-df3.notion.site/Uber-Eats-12493a8d4c5380479aa5c4384c0e79fb
