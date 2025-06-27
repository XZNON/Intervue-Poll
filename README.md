# Live Poll App

This project is a full-stack real-time polling application.

## Tech Stack

- Frontend: React (JavaScript, Vite)
- Backend: Node.js, Express
- Real-time: Socket.IO
- Database: To be added (MongoDB or SQLite)

## Getting Started

### Frontend

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```

### Backend

- Backend setup instructions will be added after backend scaffolding.

## Features

- Create polls
- Vote in real-time
- View live results

---

# Intervue Poll – Live Polling App

![Intervue Poll Screenshot 1](https://github.com/your-username/your-repo-name/blob/main/path/to/screenshot1.png)
_Replace this placeholder image with a screenshot of your app's main polling view._

## 🚀 Overview

**Intervue Poll** is a real-time web application designed to facilitate live polling in educational settings or interactive meetings. It provides a dynamic platform where teachers (or hosts) can effortlessly create and manage polls, monitor participants, and engage with students through an integrated chat system. Students can join ongoing polls, cast their votes, and observe live updates of the results, fostering an interactive and engaging environment.

The application boasts robust participant management features, including the ability for teachers to remove (kick) students from a session. All interactions and status changes are reflected instantly across all connected clients, ensuring a seamless real-time experience.

## ✨ Features

- **Real-Time Polling:** Teachers can create diverse poll questions and witness student responses and updated results instantly as votes are cast.
- **Participant Tracking:** Both teachers and students have access to a continuously updated list of all active participants in the poll session.
- **Kick Functionality:** Teachers have the authority to remove students from a poll session. Kicked students are prevented from rejoining and are redirected to a dedicated "You have been kicked" page, ensuring session integrity.
- **Live Chat:** An integrated real-time chat feature allows for immediate communication between students and teachers, enhancing interaction.
- **Responsive UI:** The application features a clean, modern, and intuitive user interface meticulously designed to be fully responsive and mobile-friendly, ensuring a consistent experience across various devices.
- **Robust Edge Case Handling:** Implements comprehensive logic to prevent kicked students from rejoining sessions, gracefully manages user interactions across multiple browser tabs, and ensures all real-time updates are synchronized across every connected client.

## 🛠️ Tech Stack

### Frontend

- **React:** A declarative, component-based JavaScript library for building user interfaces.
- **Vite:** A fast build tool that provides a lightning-fast development experience for modern web projects.
- **Socket.IO-client:** A JavaScript client library for real-time bi-directional event-based communication.

### Backend

- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express:** A fast, unopinionated, minimalist web framework for Node.js.
- **Socket.IO:** A library that enables real-time, bi-directional and event-based communication between the browser and the server.
- **MongoDB:** A flexible NoSQL document database used for storing poll data and participant information.

## 🚀 Getting Started

Follow these steps to get your Intervue Poll application up and running on your local machine.

### Prerequisites

Make sure you have Node.js and npm (or yarn) installed.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/XZNON/Intervue-Poll.git)
    cd intervue-poll
    ```

2.  **Install Backend Dependencies:**
    Navigate into the `server` directory and install the necessary packages.

    ```bash
    cd server
    npm install # or yarn install
    ```

3.  **Install Frontend Dependencies:**
    Navigate back to the project root and then into the `src` (or your frontend's root, usually `client` or directly in the root if it's a monorepo setup, but based on your description, it's likely `src` for React within Vite).
    ```bash
    cd .. # Go back to the project root if you are in 'server'
    # If your frontend code is in a 'client' or 'frontend' folder, navigate there:
    # cd client
    # If your frontend code is directly in the project root:
    # npm install # or yarn install
    # Otherwise, assuming your description meant 'src' as the frontend root:
    cd src # Assuming 'src' is where your package.json for frontend is. If not, adjust path.
    npm install # or yarn install
    ```
    **Note:** Please verify where your `package.json` for the frontend is located. If it's in the project root alongside the `server` folder, you would just run `npm install` once in the project root. If `src` contains the `package.json` for React, then `cd src` is correct. If your frontend is just in the root of the repo (and the `server` is a subfolder), you'd install frontend dependencies from the root after cloning.

### Running the Application

1.  **Start the Backend Server:**
    From the `server` directory:

    ```bash
    cd server
    npm start # Or `node index.js` if you don't have a start script
    ```

    The backend server will typically run on `http://localhost:3000` (or whatever port you've configured).

2.  **Start the Frontend:**
    From the root of your frontend project (e.g., `src` if that's where your Vite `package.json` is, or the main project root if your frontend is directly there):

    ```bash
    cd .. # Go back to the project root if you are in 'server'
    # If your frontend is in 'client' folder:
    # cd client
    # If your frontend is in the root:
    # npm run dev # This is the typical Vite command
    # Otherwise, assuming `src` contains frontend package.json:
    cd src # Adjust path if needed
    npm run dev # Or `yarn dev`
    ```

    The frontend development server will usually open the app in your browser at `http://localhost:5173` (or a similar Vite default port).

3.  **Enjoy Live Polling!**
    Open your browser to the frontend URL (e.g., `http://localhost:5173`) and start interacting with the live polling application!

## 📞 Contact

For any questions or suggestions, feel free to reach out:

- **Your Name/Handle:** Shivalik Singh
- **Email:** shivaliksinghsolanki@gmail.com
- **LinkedIn:** linkedin.com/in/shivalik-solanki-2ab233207
