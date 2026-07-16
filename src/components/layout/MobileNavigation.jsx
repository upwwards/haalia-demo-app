export function MobileNavigation({ active, onNavigate, hasLive }) {
  const items = [
    { id: 'menu', label: 'Menu' },
    { id: 'track', label: 'Orders' },
    { id: 'help', label: 'Help' },
  ];

  return (
    <nav className="mobile-nav" aria-label="Main navigation">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={active === item.id ? 'active' : ''}
          onClick={() => onNavigate(item.id)}
        >
          {item.label}
          {item.id === 'track' && hasLive ? <span className="live-dot" /> : null}
        </button>
      ))}
    </nav>
  );
}
