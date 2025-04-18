# FocusFlow: Pomodoro Timer & Exam Scheduler

FocusFlow is a web application designed to help students and professionals manage their study/work sessions using the Pomodoro Technique and keep track of their upcoming exam schedules. It features a customizable timer, session history logging, and an interactive exam timetable with completion tracking. The application is built with a clean interface and supports dark mode.

![Screenshot Placeholder](public/assets/images/screenshot-placeholder.png)
*(Add a screenshot of your application here once developed)*

## ✨ Features

*   **Customizable Pomodoro Timer:**
    *   Set custom durations for Work sessions, Short Breaks, and Long Breaks.
    *   Visual timer display.
    *   Audio notifications (optional) for session completion.
    *   Start, Pause, and Reset functionality.
*   **Session Logging & History:**
    *   Log what you accomplished during each Pomodoro (work) session.
    *   View a history of completed Pomodoro cycles.
    *   Tracks total sessions completed over time.
*   **Exam Schedule Management:**
    *   Add upcoming exams with details: Subject Name, Subject Code, Exam Time, Day, and Date.
    *   Display exams in a clear, organized list.
    *   Mark exams as completed (visually crossed out).
    *   Edit or Delete existing exam entries.
*   **Data Persistence:**
    *   Pomodoro history and exam schedules are saved, so your data isn't lost on refresh.
*   **Dark Mode:**
    *   Sleek and eye-friendly dark theme, perfect for late-night study sessions.
    *   (Optional: Add toggle or respect system preference).
*   **Interactive UI:**
    *   Smooth user experience with clear feedback on actions.

## 💻 Tech Stack

*   **Frontend:** HTML5, CSS3 (with CSS Variables for theming), JavaScript (ES6+)
*   **Backend:** Node.js with Express.js *(Alternative: Python/Flask, Firebase, Supabase)*
*   **Database:** PostgreSQL *(Alternative: MongoDB, SQLite, Firestore)*
*   **Deployment:** *(Specify where you plan to host, e.g., Heroku, Vercel, Netlify, AWS)*

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js and npm (or yarn) installed: [https://nodejs.org/](https://nodejs.org/)
*   Git installed: [https://git-scm.com/](https://git-scm.com/)
*   A running instance of your chosen database (e.g., PostgreSQL).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/focusflow.git # Replace with your repo URL
    cd focusflow
    ```

2.  **Install backend dependencies:**
    ```bash
    cd server
    npm install
    cd ..
    ```
    *(If your `package.json` is in the root for both, just run `npm install` in the root)*

3.  **Set up environment variables:**
    *   Create a `.env` file inside the `server/config/` directory (or `server/` if `config` isn't separate).
    *   Add your database connection string and other necessary variables:
      ```dotenv
      PORT=3000 # Or your preferred port
      DATABASE_URL="postgresql://user:password@host:port/database_name"
      # Add any other secrets (e.g., JWT_SECRET if using auth)
      ```
    *   **Important:** Add `.env` to your `.gitignore` file to avoid committing secrets.

4.  **Database Setup:**
    *   Ensure your database server is running.
    *   Create the database specified in your `DATABASE_URL`.
    *   Run any database migrations or seeding scripts if you have them (you might need a tool like `knex` or Sequelize CLI).
      ```bash
      # Example using Sequelize CLI (if set up)
      # npx sequelize-cli db:migrate
      # npx sequelize-cli db:seed:all
      ```

5.  **Run the development server:**
    *   **Start the backend:**
        ```bash
        cd server
        npm start # Or 'npm run dev' if you have nodemon configured
        ```
    *   **Serve the frontend:** You can often open `public/index.html` directly in your browser for simple projects. For development involving API calls, it's better to use a simple HTTP server or a tool like `live-server`.
        ```bash
        # Option 1: Use live-server (install globally: npm install -g live-server)
        cd public
        live-server --port=8080 # Serve frontend on a different port than backend

        # Option 2: Use Python's simple server
        cd public
        python -m http.server 8080
        ```

6.  **Access the application:** Open your web browser and navigate to `http://localhost:8080` (or the port you chose for the frontend). The frontend will make API calls to the backend running on `http://localhost:3000` (or your configured backend port). *(Ensure CORS is configured correctly on the backend if ports differ)*.

## ⚙️ Usage

1.  **Set Timer Durations:** Use the settings (e.g., gear icon) to adjust the time for Work, Short Break, and Long Break intervals.
2.  **Start Timer:** Click the "Start" button to begin a Pomodoro session.
3.  **Log Activity:** When a Work session ends, you'll be prompted (or have a field available) to enter what you accomplished. This log will be saved with the session history.
4.  **View History:** Navigate to the "History" section to see past Pomodoro sessions and their logs.
5.  **Add Exam:** Go to the "Exam Schedule" section and use the "Add Exam" form, filling in the required details (Subject, Code, Date, Time, Day).
6.  **Manage Exams:** View the list of upcoming exams. Click a checkbox or button next to an exam to mark it as completed (it should visually change, e.g., get crossed out). Options to edit or delete exams should also be available.
7.  **Toggle Dark Mode:** Look for a switch or button (often moon/sun icon) to toggle between light and dark themes.

## 🎨 Dark Mode Implementation

Dark mode is implemented primarily using CSS variables. A class (e.g., `dark-mode`) is toggled on the `<body>` element via JavaScript.

```css
/* Example CSS in style.css */
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --primary-color: #d95550; /* Pomodoro Red */
  --card-bg: #f8f8f8;
  /* ... other light mode variables */
}

body.dark-mode {
  --bg-color: #1a1a1a;
  --text-color: #e0e0e0;
  --primary-color: #e57373; /* Lighter red for dark */
  --card-bg: #2c2c2c;
  /* ... other dark mode variables */
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.timer-container, .schedule-card {
  background-color: var(--card-bg);
  /* ... other styles using variables */
}
```
