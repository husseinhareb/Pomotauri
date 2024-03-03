import React from 'react';
import Pomodoro from './Components/Pomodoro';
import Navbar from './Components/Navbar';
import Settings from './Components/Settings';
import './App.css';
function App() {
  return (
    <div>
      <Navbar />
      <Pomodoro />
    </div>
  );
}

export default App;
