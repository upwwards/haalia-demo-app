import { Icon } from '../../icons/Icon.jsx';

export function Sidebar({ active, onNavigate, cartCount, hasLive }) {
  const items = [
    { id: 'menu', label: 'Menu' },
    { id: 'track', label: 'Orders' },
    { id: 'help', label: 'Help' },
    { id: 'cart', label: 'Cart' },
  ];

  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="brand">EMBER</div>
      <nav>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={active === item.id ? 'active' : ''}
            onClick={() => onNavigate(item.id)}
          >
            <span>{item.label}</span>
            {item.id === 'track' && hasLive ? <span className="live-dot" /> : null}
            {item.id === 'cart' && cartCount > 0 ? <span className="count-pill">{cartCount}</span> : null}
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <Icon name="clock" size={15} />
        Live kitchen updates
      </div>
    </aside>
  );
}
