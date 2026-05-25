import React, { useState, useEffect } from 'react';
import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import './App.css';

const availableMascots = [
  { id: 1, name: "Study Snake", src: "/mascot1.png" },
  { id: 2, name: "Sleepy Cat", src: "/mascot2.png" },
  { id: 3, name: "Forest Spirit", src: "/mascot3.png" },
  { id: 4, name: "Coffee Bunny", src: "/mascot4.png" },
  { id: 5, name: "Reading Frog", src: "/mascot5.png" }
];

// --- SASSY NOTIFICATIONS ---
const sassyMessages = [
  "I know you're doom scrolling. Go do your Python quest! 📱👀",
  "Your Python streak is crying right now. Pls fix. 😭",
  "Aishwarya is probably pulling ahead of you right now. Just saying. 💅",
  "Tick tock... the streak fire is dying! 🔥💦",
  "Stop what you're doing. It's coding time. 🐍✨",
  "Are you ghosting your daily quests? How rude. 👻",
  "Don't let your pixel mascot starve. Feed it Python code! 🐸💻"
];

function App() {
  const [user, setUser] = useState(null);
  const [mascot, setMascot] = useState(null); 
  const [streak, setStreak] = useState(0);
  const [lastStreakDate, setLastStreakDate] = useState(null); 
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  // Ask for notification permission when the app loads
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const login = () => signInWithPopup(auth, provider).then(res => setUser(res.user));
  const logout = () => signOut(auth).then(() => { setUser(null); setMascot(null); });

  const addTask = (e) => {
    e.preventDefault();
    if (task.trim() === '') return;
    setTodos([...todos, { text: task, completed: false, id: Date.now() }]);
    setTask('');
  };

  const completeTask = (id) => {
    const taskToUpdate = todos.find(t => t.id === id);
    const today = new Date().toDateString(); 

    if (taskToUpdate && !taskToUpdate.completed) {
      const winAudio = new Audio('/winsound.mp3'); 
      winAudio.play().catch(e => console.log(e));
      
      if (lastStreakDate !== today) {
        setStreak(streak + 1);
        setLastStreakDate(today); 
        setShowCalendar(true);
        setTimeout(() => setShowCalendar(false), 3000);
      }
    } 
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  // Function to trigger a random sassy notification
  const sendSassyReminder = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      const randomMsg = sassyMessages[Math.floor(Math.random() * sassyMessages.length)];
      new Notification("Python Pixel Streaks", {
        body: randomMsg,
        icon: "/logo192.png", // Uses your app icon!
        vibrate: [200, 100, 200] // Gives a little buzz on Android
      });
    } else {
      alert("Please allow notifications in your browser settings for maximum sass!");
    }
  };

  return (
    <>
      {/* Background Floating Pixel Art */}
      <div className="floating-elements">
        <div className="float-item pixel-heart" style={{ left: '15%', animationDelay: '0s' }}></div>
        <div className="float-item pixel-cloud" style={{ left: '35%', animationDelay: '3s' }}></div>
        <div className="float-item pixel-heart" style={{ left: '65%', animationDelay: '1s' }}></div>
        <div className="float-item pixel-cloud" style={{ left: '85%', animationDelay: '5s' }}></div>
        <div className="float-item pixel-heart" style={{ left: '45%', animationDelay: '8s' }}></div>
      </div>

      {!user ? (
        <div className="app-container">
          <h1>Python Pixel Streaks</h1>
          <p style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>Ready to code? Log in to sync with your friend!</p>
          <button className="btn" onClick={login}>Login with Google</button>
        </div>
      ) : !mascot ? (
        <div className="app-container">
          <h2 style={{ fontSize: '1.2rem', color: 'var(--wood-dark)' }}>Choose Your Mascot</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
            {availableMascots.map((m) => (
              <div key={m.id} className="mascot-card" onClick={() => setMascot(m)}>
                <img src={m.src} alt={m.name} className="mascot-img-large" />
                <p style={{ fontSize: '0.6rem', marginTop: '10px' }}>{m.name}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="app-container">
          {/* --- FIXED HEADER SECTION --- */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={mascot.src} alt="Profile" className="mascot-img-small" />
              <p style={{ fontSize: '0.8rem' }}>{user.displayName.split(' ')[0]}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '5px' }}>
              <button className="btn" style={{ padding: '8px', backgroundColor: '#FFB7C5' }} onClick={sendSassyReminder}>
                🔔 Send Sass
              </button>
              <button className="btn" style={{ padding: '8px' }} onClick={logout}>
                Logout
              </button>
            </div>
          </div>

          <div className="streak-board">
            <span className="pixel-fire">🔥</span>
            <p>Your Streak: {streak} Days</p>
            <p style={{ fontSize: '0.6rem', marginTop: '10px' }}>Friend's Streak: ⏳ Syncing...</p>
          </div>

          <h2 style={{ fontSize: '1rem', marginTop: '30px' }}>Today's Quests</h2>
          
          <form onSubmit={addTask} style={{ display: 'flex', justifyContent: 'center' }}>
            <input type="text" className="input-box" placeholder="E.g. Learn For Loops" value={task} onChange={(e) => setTask(e.target.value)} />
            <button type="submit" className="btn">+</button>
          </form>

          <ul className="todo-list">
            {todos.map((t) => (
              <li key={t.id} className="todo-item" style={{ opacity: t.completed ? 0.6 : 1 }}>
                <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>{t.text}</span>
                
                {/* --- DELETE BUTTON WIRED IN --- */}
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button className="btn" style={{ padding: '5px' }} onClick={() => completeTask(t.id)}>
                    {t.completed ? 'Undo' : 'Done'}
                  </button>
                  <button className="btn btn-delete" style={{ padding: '5px' }} onClick={() => deleteTask(t.id)}>
                    ✖
                  </button>
                </div>

              </li>
            ))}
          </ul>

          {showCalendar && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2 style={{ color: 'var(--wood-dark)' }}>Streak Updated!</h2>
                <div className="calendar-grid">
                  {[...Array(28)].map((_, index) => (
                    <div key={index} className={`calendar-day ${index < streak ? 'completed' : ''}`}>
                      {index < streak ? '🔥' : ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;