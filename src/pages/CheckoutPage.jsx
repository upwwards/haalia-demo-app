import { Button } from '../components/common/Button.jsx';

export function CheckoutPage({ checkout, onDone, tableLabel, venueName }) {
  return (
    <section className="screen checkout-screen" data-screen="checkout">
      <div className="scroll-area checkout-scroll">
        <p className="overline accent">{venueName} · {tableLabel}</p>
        <h2>Thanks for<br />coming<span>.</span></h2>
        <p className="body-copy">Your table is closed - settle the bill with your server whenever you're ready.</p>
        <article className="checkout-card card">
          <div className="checkout-meta">
            <span className="overline">{checkout.ordersLabel}</span>
            <span className="overline">{checkout.count} items</span>
          </div>
          <div className="checkout-lines">
            {checkout.lines.map((line) => (
              <p key={`${line.name}-${line.qtyLabel}`}><span>{line.qtyLabel} {line.name}</span><strong>{line.lineTotal}</strong></p>
            ))}
          </div>
          <div className="total-row"><span>Total</span><strong>{checkout.total}</strong></div>
        </article>
        <Button className="wide" variant="dark" onClick={onDone}>Done</Button>
        <p className="fine-print">A receipt's been sent to the front desk.</p>
      </div>
    </section>
  );
}
