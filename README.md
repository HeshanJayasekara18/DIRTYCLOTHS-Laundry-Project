🧺 Laundry Booking Web App (MERN)

A full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) that allows users to conveniently book laundry pickup and delivery services online.

👉 Live Demo: Dirty Clothes Laundry

🚀 Features
👤 User Side

📝 Book a laundry pickup by selecting a convenient date & time.

🧩 Choose from multiple packages:

Full Package – Wash + Dry

Wash Package – Wash only

Dry Package – Dry only

Heavy Package – For bulk/large orders

📦 View current and past orders.

ℹ️ Access About Us and Contact Us pages.

🔔 Get real-time notifications for booking updates.

🛠️ Admin Panel

🔑 Predefined admin login.

📊 Dashboard with booking overview.

⚙️ Manage laundry packages (create, update, delete).

🔔 Real-time notifications for new bookings.

🏗️ Tech Stack

Frontend: React, React Router, Axios, TailwindCSS (or Bootstrap)

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Real-Time: Socket.IO

Deployment:

Frontend → Netlify

Backend → Dockerized & hosted on Railway

📂 Project Structure
Laundry-App/
│── client/          # React frontend
│   ├── public/ 
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.js
│
│── server/          # Node.js + Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
│
│── .env             # Environment variables
│── package.json
│── README.md

⚙️ Installation & Setup (Local Development)

Clone the repository

git clone https://github.com/your-username/laundry-booking-app.git
cd laundry-booking-app


Install dependencies

Backend:

cd server
npm install


Frontend:

cd ../client
npm install


Configure environment variables (.env in server/)

MONGO_URI=your_mongodb_connection_string
PORT=5000


Run the app locally

Start backend:

cd server
npm start


Start frontend:

cd client
npm start


Open in browser: http://localhost:3000

🌐 Deployment

Frontend: Deployed on Netlify

Backend: Containerized with Docker and deployed on Railway

🚧 Future Improvements

🔐 User authentication with JWT / OAuth.

💳 Payment gateway integration.

👥 Role-based admin & staff dashboards.

✉️ Email/SMS notifications.

🤝 Contributing

Contributions are welcome! Please open an issue to discuss what you’d like to change before submitting a pull request.

📜 License

This project is licensed under the MIT License.
