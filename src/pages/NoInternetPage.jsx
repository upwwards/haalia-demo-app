import { Icon } from '../icons/Icon.jsx';

export function NoInternetPage({ onRetry }) {
  return (
    <section className="screen no-internet-screen" data-screen="offline" aria-live="polite">
      <div className="offline-panel">
        <div className="offline-icon" aria-hidden="true">
          <Icon name="wifiOff" size={34} />
        </div>
        <p className="overline">Connection lost</p>
        <h2>No internet connection</h2>
        <p className="body-copy">
          Check your Wi-Fi or mobile data. Your current screen and order are still saved on this device.
        </p>
        <button type="button" className="btn btn-primary btn-md" onClick={onRetry}>
          <Icon name="refresh" size={17} />
          Try again
        </button>
      </div>
    </section>
  );
}
