import { Icon } from '../../icons/Icon.jsx';
import { ThemeSelector } from './ThemeSelector.jsx';

export function SettingsDrawer({ open, onClose }) {
  return (
    <>
      <div className={`drawer-scrim ${open ? 'open' : ''}`} onClick={onClose} />
      <aside
        className={`settings-drawer ${open ? 'open' : ''}`}
        data-testid="settings-drawer"
        aria-hidden={!open}
        aria-label="Settings"
      >
        <div className="drawer-head">
          <div>
            <p className="overline">Settings</p>
            <h2>Appearance</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Close settings" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
        <section className="drawer-section">
          <h3>Theme</h3>
          <ThemeSelector />
        </section>
      </aside>
    </>
  );
}
