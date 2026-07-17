import { Header } from './Header.jsx';
import { MobileNavigation } from './MobileNavigation.jsx';
import { Sidebar } from './Sidebar.jsx';
import { SettingsDrawer } from '../settings/SettingsDrawer.jsx';
import { Icon } from '../../icons/Icon.jsx';

export function AppShell({
  activeScreen,
  cartCount,
  children,
  hasLive,
  onNavigate,
  onSettings,
  settingsOpen,
  setSettingsOpen,
  tableLabel,
  venueName,
}) {
  const showNav = ['menu', 'track', 'help'].includes(activeScreen);
  const showFloatingActions = !['menu', 'welcome', 'placed', 'checkout'].includes(activeScreen);

  return (
    <div className="app-frame">
      <Sidebar active={activeScreen} cartCount={cartCount} hasLive={hasLive} onNavigate={onNavigate} />
      <main className={`phone-shell ${showFloatingActions ? 'has-floating-actions' : ''} ${showNav ? 'has-bottom-nav' : ''}`.trim()}>
        {activeScreen === 'menu' ? (
          <Header
            showNotifications={!showNav}
            venueName={venueName}
            tableLabel={tableLabel}
            onHelp={() => onNavigate('help')}
            onSettings={onSettings}
          />
        ) : null}
        {showFloatingActions ? (
          <div className="floating-header-actions" aria-label="Header actions">
            {!showNav ? (
              <button type="button" className="icon-button" aria-label="Open notifications" title="Notifications" onClick={() => onNavigate('help')}>
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
              <Icon name="paint" size={28} />
            </button>
          </div>
        ) : null}
        <div className="screen-stack">{children}</div>
        {showNav ? (
          <div className="bottom-nav-cluster">
            <MobileNavigation active={activeScreen} hasLive={hasLive} onNavigate={onNavigate} />
            <button type="button" className="icon-button bottom-notification" aria-label="Open notifications" title="Notifications" onClick={() => onNavigate('help')}>
              <Icon name="bell" size={20} />
            </button>
          </div>
        ) : null}
      </main>
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
