import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/common/Button.jsx';

const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

export function PinPage({ onUnlock, tableLabel, venueName }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const clearTimer = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(clearTimer.current);
  }, []);

  function submitPin(candidate) {
    if (onUnlock(candidate)) return;
    setError('Incorrect PIN');
    window.clearTimeout(clearTimer.current);
    clearTimer.current = window.setTimeout(() => setPin(''), 260);
  }

  function appendDigit(digit) {
    if (pin.length >= 4) return;
    setError('');
    const nextPin = `${pin}${digit}`;
    setPin(nextPin);
    if (nextPin.length === 4) submitPin(nextPin);
  }

  function removeDigit() {
    setError('');
    window.clearTimeout(clearTimer.current);
    setPin((current) => current.slice(0, -1));
  }

  return (
    <section className="screen pin-screen" data-screen="pin">
      <div className="pin-panel">
        <div className="pin-brand">
          <p className="overline">{venueName}</p>
          <span className="table-pill"><span />{tableLabel}</span>
        </div>
        <div className="pin-copy">
          <p className="overline accent">Welcome</p>
          <h1>Enter PIN</h1>
          <p className="lead">Use the 4 digit table code to open your menu.</p>
        </div>

        <div className="pin-entry" aria-label="PIN entry">
          {[0, 1, 2, 3].map((index) => (
            <span key={index} className={index < pin.length ? 'filled' : ''} />
          ))}
        </div>
        <div className="pin-error" role="status" aria-live="polite">
          {error}
        </div>

        <div className="pin-keypad" aria-label="PIN keypad">
          {keypad.slice(0, 9).map((digit) => (
            <button key={digit} type="button" onClick={() => appendDigit(digit)}>
              {digit}
            </button>
          ))}
          <span />
          <button type="button" onClick={() => appendDigit('0')}>0</button>
          <button type="button" className="pin-key-action" onClick={removeDigit} disabled={!pin}>
            Delete
          </button>
        </div>

        <Button className="wide" disabled={pin.length !== 4} onClick={() => submitPin(pin)}>
          Unlock menu
        </Button>
      </div>
    </section>
  );
}
