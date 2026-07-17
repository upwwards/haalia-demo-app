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

const requestSuggestions = {
  WATER: ['Still water', 'Sparkling water', 'Ice on side'],
  BILL: ['Split bill', 'Card payment', 'Room charge'],
  WAITER: ['Speak to server', 'Chef question', 'Wine pairing'],
  CLEAN_TABLE: ['Clear plates', 'Fresh napkins', 'Wipe table'],
  REFILL: ['Refill drinks', 'More bread', 'Extra sauce'],
  ORDER_ASSISTANCE: ['Allergy question', 'Vegetarian options', 'Kids portion'],
  CUSTOM: ['Birthday note', 'Quiet corner', 'Timing request'],
};

export function ServiceRequestPage({ onBack, onReqNote, onReqType, onSendReq, reqNote, reqType, requests, tiles }) {
  const selectedTile = tiles.find((tile) => tile.id === reqType) || tiles[0];
  const suggestions = requestSuggestions[reqType] || requestSuggestions.CUSTOM;
  const openRequestCount = requests.filter((request) => request.status !== 'CANCELLED').length;

  return (
    <section className="screen help-screen" data-screen="help">
      <div className="screen-head title-head">
        <button type="button" className="icon-button" onClick={onBack} aria-label="Back to menu"><Icon name="arrowLeft" /></button>
        <h2>How can we help?</h2>
      </div>
      <div className="scroll-area help-scroll">
   

        <div className="section-kicker">
          <span>Service type</span>
          <small>{openRequestCount} open</small>
        </div>

        <div className="request-grid">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              className={`request-tile ${reqType === tile.id ? 'selected' : ''}`}
              onClick={() => onReqType(tile.id)}
              aria-pressed={reqType === tile.id}
            >
              <span className="request-icon" aria-hidden="true">
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

        <div className="request-composer card">
          <div className="request-composer-head">
            <span className="request-icon large" aria-hidden="true">
              <Icon name={requestIcons[selectedTile?.id] || 'message'} size={20} />
            </span>
            <div>
              <p className="overline accent">Selected request</p>
              <strong>{selectedTile?.label || 'Request'}</strong>
              <small>{selectedTile?.sub || 'Tell us what you need'}</small>
            </div>
          </div>
          <div className="request-suggestions" aria-label="Suggested request notes">
            {suggestions.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => onReqNote(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
          <Textarea
            value={reqNote}
            onChange={(event) => onReqNote(event.target.value)}
            placeholder={reqType === 'CUSTOM' ? 'Tell us what you need.' : 'Add details, timing, or preferences.'}
            rows="4"
            data-testid="request-note"
            aria-label="Request note"
          />
          <div className="request-actions">
            <span>{reqNote.trim().length ? `${reqNote.trim().length} characters` : 'Optional note'}</span>
            <Button onClick={onSendReq}>Send request</Button>
          </div>
        </div>

        <div className="section-kicker">
          <span>Your requests</span>
          <small>{requests.length ? `${requests.length} total` : 'No requests yet'}</small>
        </div>
        {requests.length ? (
          requests.map((request) => (
            <article className="request-row card" key={request.id}>
              <span className="request-row-main">
                <strong>{request.label}</strong>
                {request.hasNote ? <small>{request.note}</small> : null}
                <em>{request.time}</em>
              </span>
              <b className={`status-${request.status.toLowerCase()}`}>{request.statusLabel}</b>
              {request.canCancel ? <button type="button" onClick={request.onCancel}>Cancel</button> : null}
            </article>
          ))
        ) : (
          <div className="request-empty">
            <Icon name="bell" size={18} />
            <span>No open requests. New requests will appear here.</span>
          </div>
        )}
      </div>
    </section>
  );
}
