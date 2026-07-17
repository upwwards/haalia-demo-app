import { useState } from 'react';
import { Button } from '../components/common/Button.jsx';
import { Icon } from '../icons/Icon.jsx';

export function TrackingPage({ confirm, noOrders, onCloseBill, onGoHelp, onGoMenu, orders }) {
  const [topbarScrolled, setTopbarScrolled] = useState(false);

  function handleScroll(event) {
    setTopbarScrolled(event.currentTarget.scrollTop > 8);
  }

  return (
    <section className="screen track-screen" data-screen="track">
      <header className={`track-topbar ${topbarScrolled ? 'scrolled' : ''}`}>
        <button type="button" className="track-back-button" aria-label="Back to menu" onClick={onGoMenu}>
          <Icon name="arrowLeft" size={26} strokeWidth={2.1} />
        </button>
        <h2>MY ORDER</h2>
        <span aria-hidden="true" />
      </header>
      <div className="scroll-area track-list" onScroll={handleScroll}>
        {noOrders ? (
          <div className="order-empty">
            <div className="order-empty-visual" aria-hidden="true">
              <Icon name="receipt" size={34} />
              <span />
            </div>
            <p className="overline">Ready when you are</p>
            <h3>No active orders</h3>
            <p>Start from the menu and your kitchen updates will appear here in real time.</p>
            <div className="order-empty-actions">
              <Button onClick={onGoMenu}>Browse menu</Button>
            </div>
          </div>
        ) : null}
        {orders.map((order) => (
          <article className={`order-card card ${order.served ? 'served' : ''}`} key={order.id}>
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
                <Button size="sm" variant="ghost" className="reorder-button" onClick={order.onReorder}>
                  <Icon name="refresh" size={14} /> Order this again
                </Button>
              </div>
            ) : null}
            {!order.served ? (
              <>
                <div className="progress"><span style={{ width: `${order.progressPct}%` }} /></div>
                <div className="step-list">
                  {order.steps.map((step) => (
                    <div key={step.label} className={step.todo ? 'muted-step' : ''}>
                      <span className={step.done || step.now ? 'active' : ''}>{step.done ? <Icon name="check" size={12} /> : step.now ? <i /> : step.num}</span>
                      <strong>{step.label}<small>{step.sub}</small></strong>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
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
