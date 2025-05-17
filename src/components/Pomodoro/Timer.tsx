// Timer.tsx
import React, { useState, useEffect } from 'react';
import { core } from '@tauri-apps/api';
import {
  Countdown,
  ModeButtonWrapper,
  ModeButton,
  StartResetButton,
  ButtonContainer,
  ResetButton
} from './Styles/style';

// Define the structure of time objects
interface Time {
  minutes: number;
  seconds: number;
}

interface ModeOptions {
  Pomodoro: { time: Time; color: string; btnColor: string; boxColor: string };
  ShortBreak: { time: Time; color: string; btnColor: string; boxColor: string };
  LongBreak: { time: Time; color: string; btnColor: string; boxColor: string };
}

interface TimerProps {
  onSelectMode: (mode: 'Pomodoro' | 'ShortBreak' | 'LongBreak') => void;
  onStatusChange: (isRunning: boolean) => void;
}

const Timer: React.FC<TimerProps> = ({ onSelectMode, onStatusChange }) => {
  const [default_pomodoro_time, set_default_pomodoro_time] = useState<Time>({ minutes: 25, seconds: 0 });
  const [short_break_time, set_short_break_time] = useState<Time>({ minutes: 5, seconds: 0 });
  const [long_break_time, set_long_break_time] = useState<Time>({ minutes: 15, seconds: 0 });
  const [time, set_time] = useState<Time>(default_pomodoro_time);
  const [is_running, set_is_running] = useState<boolean>(false);
  const [is_paused, set_is_paused] = useState<boolean>(false);
  const [selected_mode, set_selected_mode] = useState<'Pomodoro' | 'ShortBreak' | 'LongBreak'>('Pomodoro');
  const [box_color, set_box_color] = useState<string>('');
  const [btn_color, set_btn_color] = useState<string>('');
  const [counter, set_counter] = useState<number>(1);
  const [background_color, set_background_color] = useState<string>('#BA4949');

  const modeOptions: ModeOptions = {
    Pomodoro: { time: default_pomodoro_time, color: '#BA4949', btnColor: '#C15C5C', boxColor: '#C15C5C' },
    ShortBreak: { time: short_break_time, color: '#428455', btnColor: '#6fa67f', boxColor: '#6fa67f' },
    LongBreak: { time: long_break_time, color: '#854284', btnColor: '#c482c3', boxColor: '#c482c3' }
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await core.invoke('get_config') as {
          pomodoro_time: Time;
          short_break_time: Time;
          long_break_time: Time;
        };
        set_default_pomodoro_time(response.pomodoro_time);
        set_short_break_time(response.short_break_time);
        set_long_break_time(response.long_break_time);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };

    fetchConfig();
    const intervalId = setInterval(fetchConfig, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    onStatusChange(selected_mode === 'Pomodoro' && is_running);
  }, [selected_mode, is_running]);

  useEffect(() => {
    if (!is_running) {
      const { time: t, boxColor } = modeOptions[selected_mode];
      if (!is_paused) {
        set_time(t);
      }
      set_box_color(boxColor);
      set_btn_color(modeOptions[selected_mode].btnColor);
    }
  }, [selected_mode, is_running, short_break_time, long_break_time, default_pomodoro_time]);

  useEffect(() => {
    if (time.minutes === 0 && time.seconds === 0 && is_running) {
      handle_timer_end();
      set_time(modeOptions[selected_mode].time);
    }
  }, [time, is_running, selected_mode]);

  useEffect(() => {
    if (is_running) {
      const intervalId = setInterval(() => {
        set_time(prev => {
          if (prev.minutes === 0 && prev.seconds === 0) {
            clearInterval(intervalId);
            handle_timer_end();
            return prev;
          }
          if (prev.seconds === 0) {
            return { minutes: prev.minutes - 1, seconds: 59 };
          }
          return { ...prev, seconds: prev.seconds - 1 };
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [is_running]);

  useEffect(() => {
    document.body.style.transition = 'background-color 0.7s ease-in-out';
    document.body.style.backgroundColor = background_color;
  }, [background_color]);

  const select_mode = (mode: 'Pomodoro' | 'ShortBreak' | 'LongBreak') => {
    set_selected_mode(mode);
    set_is_running(false);
    set_is_paused(false);
    onSelectMode(mode);
    set_box_color(modeOptions[mode].boxColor);
    set_btn_color(modeOptions[mode].btnColor);
    set_background_color(modeOptions[mode].color);
  };

  const start_timer = () => {
    set_is_running(prev => !prev);
    set_is_paused(false);
  };

  const pause_timer = () => {
    set_is_paused(true);
    set_is_running(false);
  };

  const handle_mode_change = (mode: 'Pomodoro' | 'ShortBreak' | 'LongBreak') => {
    set_selected_mode(mode);
    onSelectMode(mode);
    const { time: t, color, btnColor } = modeOptions[mode];
    set_time(t);
    set_background_color(color);
    set_btn_color(btnColor);
  };

  const reset_timer = () => {
    handle_mode_change(selected_mode);
    set_is_running(false);
    set_is_paused(false);
  };

  const handle_timer_end = () => {
    handle_timer_skip();
  };

  const handle_timer_skip = () => {
    if (selected_mode === 'Pomodoro' && counter < 4) {
      select_mode('ShortBreak');
    } else if (selected_mode === 'ShortBreak' && counter < 4) {
      set_counter(prev => prev + 1);
      select_mode('Pomodoro');
    } else if (selected_mode === 'Pomodoro' && counter === 4) {
      select_mode('LongBreak');
    } else {
      select_mode('Pomodoro');
      set_counter(1);
    }
  };

  const minutes = time.minutes;
  const seconds = time.seconds;

  return (
    <div className="box" style={{ backgroundColor: box_color, transition: 'background-color 0.7s ease-in-out' }}>
      <ModeButtonWrapper>
        <ModeButton selected={selected_mode === 'Pomodoro'} onClick={() => select_mode('Pomodoro')}>
          Pomodoro
        </ModeButton>
        <ModeButton selected={selected_mode === 'ShortBreak'} onClick={() => select_mode('ShortBreak')}>
          Short Break
        </ModeButton>
        <ModeButton selected={selected_mode === 'LongBreak'} onClick={() => select_mode('LongBreak')}>
          Long Break
        </ModeButton>
      </ModeButtonWrapper>
      <ButtonContainer>
        <span>
          <Countdown>
            {minutes < 10 ? '0' : ''}{minutes}:
          </Countdown>
          <StartResetButton
            onClick={is_running ? pause_timer : start_timer}
            style={{ color: btn_color, transition: 'background-color 0.7s ease-in-out' }}
          >
            {is_running ? 'PAUSE' : 'START'}
          </StartResetButton>
        </span>
        <span>
          <Countdown>
            {seconds < 10 ? '0' : ''}{seconds}
          </Countdown>
          <ResetButton
            onClick={reset_timer}
            style={{ color: btn_color, transition: 'background-color 0.7s ease-in-out' }}
          >
            RESET
          </ResetButton>
        </span>
      </ButtonContainer>
    </div>
  );
};

export default Timer;
