import { Button } from '../components/common/Button.jsx';
import { Textarea } from '../components/common/Input.jsx';
import { Icon } from '../icons/Icon.jsx';

export function ServiceRequestPage({ onBack, onReqNote, onReqType, onSendReq, reqNote, reqType, requests, tiles }) {
  return (
    <section className="screen help-screen" data-screen="help">
      <div className="screen-head title-head">
        <button type="button" className="icon-button" onClick={onBack} aria-label="Back to menu"><Icon name="arrowLeft" /></button>
        <h2>How can we help?</h2>
      </div>
      <div className="scroll-area help-scroll">
        <p className="body-copy">Tap a request - your server is alerted instantly.</p>
        <div className="request-grid">
          {tiles.map((tile) => (
            <button key={tile.id} type="button" className={reqType === tile.id ? 'selected' : ''} onClick={() => onReqType(tile.id)}>
              <strong>{tile.label}</strong>
              <small>{tile.sub}</small>
            </button>
          ))}
        </div>
        <p className="overline accent">{tiles.find((tile) => tile.id === reqType)?.label || 'Request'}</p>
        <Textarea value={reqNote} onChange={(event) => onReqNote(event.target.value)} placeholder="Sparkling water, please." rows="3" data-testid="request-note" />
        <Button className="wide" onClick={onSendReq}>Send request</Button>
        {requests.length ? <p className="overline muted detail-label">Your requests</p> : null}
        {requests.map((request) => (
          <article className="request-row card" key={request.id}>
            <span>
              <strong>{request.label}</strong>
              {request.hasNote ? <small>{request.note}</small> : null}
              <em>{request.time}</em>
            </span>
            <b className={`status-${request.status.toLowerCase()}`}>{request.statusLabel}</b>
            {request.canCancel ? <button type="button" onClick={request.onCancel}>Cancel</button> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
