import { Button } from '../components/common/Button.jsx';
import { Icon } from '../icons/Icon.jsx';

export function TrackingPage({ confirm, noOrders, onCloseBill, onGoHelp, onGoMenu, orders }) {
  return (
    <section className="screen track-screen" data-screen="track">
      <div className="screen-head split-head">
        <div>
          <h2>Your orders</h2>
          <p>Live from the kitchen</p>
        </div>
        <span className="live-pill"><span />Live</span>
      </div>
      <div className="scroll-area track-list">
        {noOrders ? (
          <div className="empty-state">
            <strong>No orders yet</strong>
            <p>Send an order from the menu to track it here.</p>
            <Button onClick={onGoMenu}>Browse the menu</Button>
          </div>
        ) : null}
        {orders.map((order) => (
          <article className="order-card card" key={order.id}>
            <div className="order-top">
              <span><em className="overline">Order · {order.time}</em><strong>#{order.number}</strong></span>
              <b>{order.stageLabel}</b>
            </div>
            {order.showEta ? (
              <div className="eta"><span className="overline">Ready in about</span><strong>{order.etaLabel}<small>min</small></strong></div>
            ) : null}
            {order.ready ? <p className="ready-text">Ready now - your server is bringing it over.</p> : null}
            {order.served ? (
              <div className="served-actions">
                <p>Served - enjoy your meal.</p>
                <Button size="sm" variant="ghost" onClick={order.onReorder}>Order this again</Button>
              </div>
            ) : null}
            <div className="progress"><span style={{ width: `${order.progressPct}%` }} /></div>
            <div className="step-list">
              {order.steps.map((step) => (
                <div key={step.label} className={step.todo ? 'muted-step' : ''}>
                  <span className={step.done || step.now ? 'active' : ''}>{step.done ? <Icon name="check" size={12} /> : step.now ? <i /> : step.num}</span>
                  <strong>{step.label}<small>{step.sub}</small></strong>
                </div>
              ))}
            </div>
            <div className="order-lines">
              {order.lines.map((line) => (
                <p key={line.key}><span>{line.qtyLabel} {line.name}</span><strong>{line.lineTotal}</strong></p>
              ))}
              <p className="order-total"><span>Total</span><strong>{order.totalLabel}</strong></p>
            </div>
          </article>
        ))}
        {!noOrders ? (
          <>
            <div className="split-actions">
              <Button variant="ghost" onClick={onGoMenu}>Add to order</Button>
              <Button variant="ghost" onClick={onGoHelp}>Need a server</Button>
            </div>
            <Button className="wide" variant={confirm ? 'dark' : 'text'} onClick={onCloseBill}>
              {confirm ? 'Confirm - this closes your table' : 'Done dining? Close the bill'}
            </Button>
          </>
        ) : null}
      </div>
    </section>
  );
}
