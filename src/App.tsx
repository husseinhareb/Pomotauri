import React from 'react';
import Pomodoro from './components/Pomodoro/Pomodoro';
import Navbar from './components/Navbar/Navbar';
import './App.css';

// Define the Props interface for the App component (if needed)
interface AppProps {
  // Add any props you might need for the App component
}

const App: React.FC<AppProps> = () => {
  return (
    <div>
      <Navbar />
      <Pomodoro />
    </div>
  );
};

export default App;