import { Icon } from '../../icons/Icon.jsx';

export function Header({ showNotifications = true, venueName, tableLabel, onHelp, onSettings }) {
  return (
    <header className="app-header">
      <div>
        <p className="overline">{venueName} · {tableLabel}</p>
        <h1>Tonight's menu</h1>
      </div>
      <div className="header-actions" aria-label="Header actions">
        {showNotifications ? (
          <button type="button" className="icon-button" aria-label="Open notifications" title="Notifications" onClick={onHelp}>
            <Icon name="bell" />
          </button>
        ) : null}
        <button
          type="button"
          className="icon-button"
          aria-label="Open settings"
          title="Settings"
          data-testid="settings-button"
          onClick={onSettings}
        >
          <Icon name="paint" size={21} />
        </button>
      </div>
    </header>
  );
}
