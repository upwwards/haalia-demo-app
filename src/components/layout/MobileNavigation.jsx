import { Icon } from '../../icons/Icon.jsx';

export function MobileNavigation({ active, onNavigate, hasLive }) {
  const items = [
    { id: 'menu', label: 'Menu', icon: 'list' },
    { id: 'track', label: 'Orders', icon: 'clock' },
    { id: 'help', label: 'Help', icon: 'bell' },
  ];

  return (
    <nav className="mobile-nav" aria-label="Main navigation">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={active === item.id ? 'active' : ''}
          onClick={() => onNavigate(item.id)}
          aria-current={active === item.id ? 'page' : undefined}
        >
          <Icon name={item.icon} size={16} />
          <span className="mobile-nav-label">{item.label}</span>
          {item.id === 'track' && hasLive ? <span className="live-dot" /> : null}
        </button>
      ))}
    </nav>
  );
}
