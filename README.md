[Uploading README.md…]()
# 🎫 Helpy - Enterprise Support Desk SaaS

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-blue.svg)
![React](https://img.shields.io/badge/react-18.2-61dafb.svg)
![Flask](https://img.shields.io/badge/flask-2.0-green.svg)

A modern, full-stack **Service Desk / Ticketing System** designed for IT support teams. Built with a robust **Flask (Python)** backend and a responsive **React (Material UI)** frontend.

This project demonstrates a production-ready architecture with secure authentication, real-time analytics, and a "humanized" user interface.

## 🚀 Key Features

* **📊 Dashboard Analytics:** Real-time visualization of Total, Open, and Closed tickets.
* **🧠 Smart Prioritization:** Tag tickets by **Priority** (High/Medium/Low) and **Category** (Bug/Feature/Support).
* **🔐 Secure Authentication:** Full JWT-based Login & Registration system with bcrypt password hashing.
* **🎨 Humanized UI:** Dynamic greetings ("Good Morning"), smooth Framer Motion animations, and empty states.
* **📱 Fully Responsive:** Optimized for Mobile, Tablet, and Desktop using Material UI Grid & Drawer.
* **⚡ CRUD Operations:** Create, Read, Update (Close), and Delete tickets instantly.

---

## 🛠️ Tech Stack

### **Frontend**
* **React.js:** Component-based UI architecture.
* **Material UI (MUI):** Enterprise-grade design system.
* **Framer Motion:** For smooth, professional animations.
* **Fetch API:** Native asynchronous data handling.

### **Backend**
* **Flask:** Lightweight, high-performance Python web framework.
* **SQLAlchemy:** ORM for seamless database management.
* **Flask-JWT-Extended:** Secure token-based authentication.
* **Flask-Bcrypt:** Industry-standard password encryption.
* **SQLite:** Zero-configuration SQL database (Development).

---

## 📦 Installation & Setup

Follow these steps to run the project locally.

### **1. Clone the Repository**
```bash
git clone [https://github.com/kinimonisha29/ticket-system.git](https://github.com/kinimonisha29/ticket-system.git)
cd ticket-system


2. Backend Setup (Flask)
Open a terminal in the root folder:

Bash

# Install required Python packages
pip install -r requirements.txt

# Run the server (This will auto-create the database)
python app.py
The backend API will start at http://localhost:5000.

Markdown
# 🎫 Helpy - Enterprise Support Desk SaaS

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-blue.svg)
![React](https://img.shields.io/badge/react-18.2-61dafb.svg)
![Flask](https://img.shields.io/badge/flask-2.0-green.svg)

A modern, full-stack **Service Desk / Ticketing System** designed for IT support teams. Built with a robust **Flask (Python)** backend and a responsive **React (Material UI)** frontend.

This project demonstrates a production-ready architecture with secure authentication, real-time analytics, and a "humanized" user interface.

## 🚀 Key Features

* **📊 Dashboard Analytics:** Real-time visualization of Total, Open, and Closed tickets.
* **🧠 Smart Prioritization:** Tag tickets by **Priority** (High/Medium/Low) and **Category** (Bug/Feature/Support).
* **🔐 Secure Authentication:** Full JWT-based Login & Registration system with bcrypt password hashing.
* **🎨 Humanized UI:** Dynamic greetings ("Good Morning"), smooth Framer Motion animations, and empty states.
* **📱 Fully Responsive:** Optimized for Mobile, Tablet, and Desktop using Material UI Grid & Drawer.
* **⚡ CRUD Operations:** Create, Read, Update (Close), and Delete tickets instantly.

---

## 🛠️ Tech Stack

### **Frontend**
* **React.js:** Component-based UI architecture.
* **Material UI (MUI):** Enterprise-grade design system.
* **Framer Motion:** For smooth, professional animations.
* **Fetch API:** Native asynchronous data handling.

### **Backend**
* **Flask:** Lightweight, high-performance Python web framework.
* **SQLAlchemy:** ORM for seamless database management.
* **Flask-JWT-Extended:** Secure token-based authentication.
* **Flask-Bcrypt:** Industry-standard password encryption.
* **SQLite:** Zero-configuration SQL database (Development).

---

## 📦 Installation & Setup

Follow these steps to run the project locally.

### **1. Clone the Repository**
```bash
git clone [https://github.com/kinimonisha29/ticket-system.git](https://github.com/kinimonisha29/ticket-system.git)
cd ticket-system
2. Backend Setup (Flask)
Open a terminal in the root folder:

Bash
# Install required Python packages
pip install -r requirements.txt

# Run the server (This will auto-create the database)
python app.py
The backend API will start at http://localhost:5000.

3. Frontend Setup (React)
Open a new terminal and navigate to the frontend folder:

Bash
cd ticket-frontend

# Install Node.js dependencies
npm install

# Start the development server
npm start

The application will open at http://localhost:3000.

🔌 API Documentation:
Method,Endpoint,Description,Auth Required
POST,/api/register,Register a new user account,❌
POST,/api/login,Login and receive JWT Access Token,❌
GET,/api/tickets,Fetch all tickets for the logged-in user,✅
POST,/api/tickets,Create a new support ticket,✅
PUT,/api/tickets/<id>,Update ticket status (Open/Closed),✅
DELETE,/api/tickets/<id>,Permanently delete a ticket,✅


📂 Project Structure:
ticket-system/
├── app.py                 # Main Flask Application Entry Point
├── tickets.db             # SQLite Database (Auto-generated)
├── requirements.txt       # Python Dependencies
└── ticket-frontend/       # React Frontend
    ├── public/            # Static assets
    ├── src/
    │   ├── App.js         # Main React Component & Logic
    │   └── index.js       # React Entry Point
    └── package.json       # Node.js Dependencies



