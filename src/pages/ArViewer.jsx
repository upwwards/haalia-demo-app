import { Button } from '../components/common/Button.jsx';
import { Icon } from '../icons/Icon.jsx';

export function ArViewer({ item, onClose, onPlace, open }) {
  if (!open || !item) return null;
  return (
    <section className="ar-view" data-screen="ar" aria-label="3D AR preview">
      <header>
        <span className="overline">3D · AR preview</span>
        <button type="button" className="icon-button" aria-label="Close AR preview" onClick={onClose}><Icon name="x" /></button>
      </header>
      <div className="ar-stage">
        <div className="plate"><span>{item.name[0]}</span></div>
        <h2>{item.name}</h2>
        <p>Drag to rotate · pinch to zoom</p>
      </div>
      <footer>
        <Button onClick={onPlace}>Place on your table</Button>
        <p>Point your camera at the table to see it at real size.</p>
      </footer>
    </section>
  );
}
