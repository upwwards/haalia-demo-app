import { useState } from 'react';
import { Button } from '../components/common/Button.jsx';
import { Textarea } from '../components/common/Input.jsx';
import { Icon } from '../icons/Icon.jsx';

const requestIcons = {
  WATER: 'droplet',
  BILL: 'receipt',
  WAITER: 'serviceBell',
  CLEAN_TABLE: 'sparkle',
  REFILL: 'refresh',
  ORDER_ASSISTANCE: 'helpCircle',
  CUSTOM: 'message',
};

export function ServiceRequestPage({ onBack, onReqNote, onReqType, onSendReq, reqNote, reqType, requests, tiles }) {
  const [topbarScrolled, setTopbarScrolled] = useState(false);
  const selectedTile = tiles.find((tile) => tile.id === reqType) || tiles[0];
  const composerLabel = reqType === 'CUSTOM' ? 'Tell us what you need' : 'Add a note (optional)';

  function handleScroll(event) {
    setTopbarScrolled(event.currentTarget.scrollTop > 8);
  }

  return (
    <section className="screen help-screen" data-screen="help">
      <header className={`track-topbar ${topbarScrolled ? 'scrolled' : ''}`}>
        <button type="button" className="track-back-button" onClick={onBack} aria-label="Back to menu">
          <Icon name="arrowLeft" size={26} strokeWidth={2.1} />
        </button>
        <h2>How can we help?</h2>
        <span aria-hidden="true" />
      </header>

      <div className="scroll-area help-scroll" onScroll={handleScroll}>
        <div className="help-service-hero" role="status">
          <span className="help-service-orb top" aria-hidden="true" />
          <span className="help-service-orb bottom" aria-hidden="true" />
          <span className="service-hero-icon" aria-hidden="true">
            <span />
            <Icon name="bell" size={24} />
          </span>
          <span className="service-hero-copy">
            <strong>Instant service</strong>
            <small>One tap alerts your server - no waving needed.</small>
          </span>
        </div>

        <p className="help-kicker">Quick requests</p>

        <div className="request-grid">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              className={`help-request-tile ${reqType === tile.id ? 'selected' : ''} ${tile.id === 'CUSTOM' ? 'wide' : ''}`}
              onClick={() => onReqType(tile.id)}
              aria-pressed={reqType === tile.id}
            >
              <span className="help-request-icon" aria-hidden="true">
                <Icon name={requestIcons[tile.id] || 'message'} size={18} />
              </span>
              <span>
                <strong>{tile.label}</strong>
                <small>{tile.sub}</small>
              </span>
              {reqType === tile.id ? <Icon name="check" size={15} className="request-check" /> : null}
            </button>
          ))}
        </div>

        <div className="help-composer help-gl">
          <p className="help-composer-label">{composerLabel}</p>
          <Textarea
            value={reqNote}
            onChange={(event) => onReqNote(event.target.value)}
            placeholder={selectedTile?.id === 'CUSTOM' ? 'Tell us what you need.' : 'Sparkling water, please.'}
            rows="3"
            className="help-note-field"
            data-testid="request-note"
            aria-label="Request note"
          />
          <Button className="help-send-button" onClick={onSendReq}>Send request</Button>
        </div>

        {requests.length ? (
          <>
            <p className="help-kicker requests">Your requests</p>
            {requests.map((request) => (
              <article className="help-request-row help-gl" key={request.id}>
                <span className="request-row-main">
                  <strong>{request.label}</strong>
                  {request.hasNote ? <small>{request.note}</small> : null}
                  <em>{request.time}</em>
                </span>
                <b className={`status-${request.status.toLowerCase()}`}>{request.statusLabel}</b>
                {request.canCancel ? <button type="button" onClick={request.onCancel}>Cancel</button> : null}
              </article>
            ))}
          </>
        ) : null}
      </div>
    </section>
  );
}
