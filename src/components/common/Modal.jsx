import { Icon } from '../../icons/Icon.jsx';

export function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
