import React from 'react';
import Pomodoro from './components/Pomodoro';
import Navbar from './components/Navbar';
import './App.css';
import Tasks from './components/Tasks';
function App() {
  return (
    <div>
      <Navbar />
      <Pomodoro />
    </div>
  );
}

export default App;
