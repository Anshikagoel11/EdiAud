# 🎧 Audio Editing Web App with Listener Insights

An open-source **audio editing and listener analytics web application** built with **Next.js** and **Tailwind CSS**.  
Designed for content creators who want to **edit audio** and **understand listener behavior** through meaningful insights.

---

## 🌐 Open Source

This project is **fully open source** and open to community contributions.  
Feel free to fork, improve, and experiment with new ideas.

---

## 🚀 Features

### 🎵 Audio Editing
- Upload audio files (MP3, WAV, etc.)
- Change playback speed
- Apply **echo** and **reverb** effects
- Trim audio freely
- Non-destructive & reversible editing
- Download the final processed audio

### 📊 Listener Insights
- Audio is divided into time-based segments
- Tracks how often each segment is replayed
- Visualizes listener engagement clearly
- Helps creators identify the most replayed sections

### 🎨 User Experience
- Clean and intuitive UI
- Responsive design (desktop & mobile)
- Smooth playback and interactions

---

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Audio Processing:** Web Audio API
- **State Management:** React Hooks
- **Middleware:** Next.js Middleware for reversible processing
- **Visualization:** Custom analytics UI

---

## 📂 Project Structure

├── app/ # Next.js app router
├── components/ # Reusable UI components
├── middleware/ # Audio processing & reversible actions
├── utils/ # Audio helpers & analytics logic
├── styles/ # Global styles
├── public/ # Static assets
└── README.md



---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Anshikagoel11/EdiAud.git

cd audio-editor

Install Dependencies - npm install
Run the Development Server - npm run dev
visit : Visit http://localhost:3000 in your browser.

