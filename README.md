# Real-time Quiz app

## Overview
This project is a simple quizzing application inspired by Mentimeter. It allows an admin to create and manage quizzes, while users can join and participate in answering questions. The app features a real-time leaderboard to track participants' scores.

## Features
- **Admin Capabilities:**
  - Add multiple-choice questions (MCQs) with single answers.
  - Navigate through questions during the quiz session.
  - Display the leaderboard to all participants.

- **User Capabilities:**
  - Join quiz sessions using a room code.
  - Answer questions in real time.

## Technology Stack
- **Backend:** Node.js, TypeScript
- **Frontend:** React, Vite, Tailwind CSS, JavaScript
- **Real-time Communication:** Socket.IO


## Installation
Follow these steps to set up the project locally.

### Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```
### Set Up Backend
- Navigate to the backend directory:
```bash
cd Backend
```
- Install dependencies:
``` bash
npm install
```
- Start the development server:
```bash
npx tsc -b && node dist/index
```
### Set Up Frontend
- Open a new terminal and navigate to the frontend directory:
```bash
cd Frontend
```
- Install dependencies:
``` bash
npm install
```
- Start the development server:
``` bash
npm run dev
```
## Usage
After setting up the project, open your browser and go to the below URL to create the room and other admin controls.
```
http://localhost:5173/admin
```
-  Go to the below URL to get in the room to participate in the quiz.
```
http://localhost:5173
```
## Video
https://github.com/utkarshkr-creator/Quiz-App/assets/66742842/80d61e34-6e32-4ccb-8251-6a3d380f437c
