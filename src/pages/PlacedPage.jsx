import { Button } from '../components/common/Button.jsx';
import { Icon } from '../icons/Icon.jsx';

export function PlacedPage({ onBackMenu, onViewOrder }) {
  return (
    <section className="screen placed-screen" data-screen="placed">
      <div className="success-mark"><Icon name="check" size={34} color="#fff" /></div>
      <h2>Order sent</h2>
      <p>The kitchen has it - track every step live.</p>
      <Button variant="dark" onClick={onViewOrder}>Track my order</Button>
      <button type="button" className="text-button" onClick={onBackMenu}>Back to the menu</button>
    </section>
  );
}
