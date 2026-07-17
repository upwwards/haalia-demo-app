import { Header } from './Header.jsx';
import { MobileNavigation } from './MobileNavigation.jsx';
import { Sidebar } from './Sidebar.jsx';
import { SettingsDrawer } from '../settings/SettingsDrawer.jsx';

export function AppShell({
  activeScreen,
  cartCount,
  children,
  hasLive,
  isLocked = false,
  menuChromeCompact,
  onNavigate,
  onSettings,
  settingsOpen,
  setSettingsOpen,
  tableLabel,
  venueName,
}) {
  const showNav = !isLocked && ['menu', 'track', 'help'].includes(activeScreen);

  return (
    <div className={`app-frame ${isLocked ? 'locked' : ''}`.trim()}>
      {!isLocked ? <Sidebar active={activeScreen} cartCount={cartCount} hasLive={hasLive} onNavigate={onNavigate} /> : null}
      <main className={`phone-shell ${showNav ? 'has-bottom-nav' : ''} ${menuChromeCompact ? 'menu-chrome-compact' : ''}`.trim()}>
        {!isLocked && activeScreen === 'menu' ? (
          <Header
            showNotifications={!showNav}
            venueName={venueName}
            tableLabel={tableLabel}
            onHelp={() => onNavigate('help')}
            onSettings={onSettings}
          />
        ) : null}
        <div className="screen-stack">{children}</div>
        {showNav ? (
          <div className="bottom-nav-cluster">
            <MobileNavigation active={activeScreen} hasLive={hasLive} onNavigate={onNavigate} />
          </div>
        ) : null}
        {!isLocked ? <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} /> : null}
      </main>
    </div>
  );
}
