import { Button } from '../components/common/Button.jsx';
import { Textarea } from '../components/common/Input.jsx';
import { Icon } from '../icons/Icon.jsx';

export function CartPage({
  cartCount,
  cartEmpty,
  cartLines,
  cartTotalLabel,
  estWaitLabel,
  onBack,
  onBackMenu,
  onSend,
  tableLabel,
}) {
  return (
    <section className="screen cart-screen" data-screen="cart">
      <div className="screen-head title-head">
        <button type="button" className="icon-button" onClick={onBack} aria-label="Back to menu"><Icon name="arrowLeft" /></button>
        <div>
          <h2>Your order</h2>
          <p>{tableLabel} · {cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
        </div>
      </div>
      <div className="scroll-area cart-list">
        {cartEmpty ? (
          <div className="empty-state">
            <strong>Nothing here yet</strong>
            <p>Add something from the menu.</p>
            <Button onClick={onBackMenu}>Browse the menu</Button>
          </div>
        ) : null}
        {cartLines.map((line) => (
          <article className="cart-line card" key={line.key}>
            <div className="line-title">
              <strong>{line.name}</strong>
              <b>{line.lineTotal}</b>
            </div>
            {line.hasVariant ? <p>{line.variantLabel}</p> : null}
            {line.hasMods ? <p>{line.modSummary}</p> : null}
            {line.editing ? (
              <div className="note-editor">
                <Textarea value={line.draftNote} onChange={(event) => line.onDraftNote(event.target.value)} placeholder="Doneness, allergies, plating..." rows="2" />
                <Button size="sm" onClick={line.onCommitNote}>Save note</Button>
              </div>
            ) : null}
            {line.showNote ? <button type="button" className="note-link" onClick={line.onBeginNote}>"{line.notes}" · Edit</button> : null}
            {line.showAddNote ? <button type="button" className="note-link" onClick={line.onBeginNote}>+ Add a note</button> : null}
            <div className="line-actions">
              <div className="mini-stepper quiet">
                <button type="button" onClick={line.onDec}><Icon name="minus" size={13} /></button>
                <span>{line.qty}</span>
                <button type="button" onClick={line.onInc}><Icon name="plus" size={13} /></button>
              </div>
            </div>
          </article>
        ))}
        {!cartEmpty ? (
          <div className="wait-card">
            <Icon name="clock" size={15} />
            <span>{estWaitLabel} from the kitchen once you send.</span>
          </div>
        ) : null}
      </div>
      {!cartEmpty ? (
        <div className="bottom-panel">
          <div className="total-row"><span>Total</span><strong>{cartTotalLabel}</strong></div>
          <Button className="wide" onClick={onSend}>Send to the kitchen</Button>
          <p>Pay at the end of your meal.</p>
        </div>
      ) : null}
    </section>
  );
}
