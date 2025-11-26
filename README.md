Neerav Babel - Professional Developer Portfolio

A high-performance, interactive portfolio designed to showcase Backend Architecture and Full Stack capabilities.

🚀 Live Demo

View Live Portfolio

💡 About The Project

This isn't just a static resume website. It is a fully interactive React application engineered to demonstrate complex technical concepts visually.

As a Backend Developer, showcasing invisible logic (like queues and microservices) is difficult. This portfolio solves that by including a Live Architecture Simulator that visualizes how I handle high-concurrency systems using RabbitMQ and Celery.

✨ Key Features

🧬 Live Architecture Lab:

An interactive simulation of my EchoQuery project.

Users can "Simulate Traffic Spikes" and watch how the system handles backpressure.

Visualizes API Gateway $\rightarrow$ RabbitMQ $\rightarrow$ Celery Workers data flow.

AI Analysis: Integrated Gemini API to analyze the current simulation state and explain the architecture's efficiency in real-time.

🤖 Personalized AI Recruiter:

A custom-trained chatbot (powered by Google Gemini 1.5) that answers questions about my resume, skills, and experience 24/7.

Context-aware: It knows my specific project details (Waggy, EchoQuery) and educational background.

📧 Smart Outreach Generator:

A tool for recruiters to generate personalized outreach emails.

Takes "Company Name" and "Role" as input and uses LLMs to connect my specific skills to their job requirements automatically.

📊 Coding Analytics Dashboard:

Visualizes LeetCode problem-solving stats (Easy/Medium/Hard) and GitHub contribution activity.

🛠️ Tech Stack

Frontend: React.js (Vite)

Styling: Tailwind CSS

AI Integration: Google Gemini API (v1beta)

Icons: Lucide React

Deployment: Vercel

💻 Getting Started (Run Locally)

Follow these steps to set up the project locally on your machine.

Prerequisites

Node.js (v18 or higher)

npm or yarn

Installation

Clone the repository

git clone [https://github.com/YOUR_USERNAME/neerav-portfolio.git](https://github.com/YOUR_USERNAME/neerav-portfolio.git)
cd neerav-portfolio


Install dependencies

npm install


Setup Environment Variables

Create a .env file in the root directory.

Add your Google Gemini API key:

VITE_GEMINI_API_KEY=your_actual_api_key_here


Run the development server

npm run dev


Open http://localhost:5173 with your browser to see the result.

🌐 Deployment

This project is optimized for deployment on Vercel.

Push your code to GitHub.

Import the project into Vercel.

Add the VITE_GEMINI_API_KEY in the Vercel Environment Variables settings.

Click Deploy.

👤 Author

Neerav Babel

Role: Full Stack & Backend Developer

Location: Bangalore, India

Email: babelneerav299@gmail.com

LinkedIn: linkedin.com/in/neeravbabel

GitHub: github.com/neeravbabel

© 2025 Neerav Babel. All Rights Reserved.