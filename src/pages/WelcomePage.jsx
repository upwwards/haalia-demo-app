import { Button } from '../components/common/Button.jsx';
import { Card } from '../components/common/Card.jsx';
import { Icon } from '../icons/Icon.jsx';
import { categoryNames, money, tintByCategory } from '../data/menu.js';

export function WelcomePage({ picks, onGoHelp, onGoMenu, onOpenItem, tableLabel, venueName }) {
  return (
    <section className="screen welcome-screen" data-screen="welcome">
      <div className="welcome-top">
        <span className="overline brand-small">{venueName}</span>
        <span className="table-pill"><span />{tableLabel}</span>
      </div>
      <div className="welcome-content">
        <p className="overline accent">Good evening</p>
        <h1>Hungry?<br />The fire's<br />ready<span>.</span></h1>
        <p className="lead">Order from your phone, track the kitchen live, pay when you're done.</p>
        <p className="overline muted">Tonight's picks</p>
        <div className="pick-list">
          {picks.map((pick) => (
            <Card key={pick.id} as="button" className="pick-card" onClick={() => onOpenItem(pick.id)}>
              <div className="thumb" style={{ background: tintByCategory[pick.cat] }}>{pick.name[0]}</div>
              <span>
                <strong>{pick.name}</strong>
                <small>{categoryNames[pick.cat] || 'Dish'} · {pick.hasVariants ? 'from ' : ''}{money(pick.price)}</small>
              </span>
              <em>{(pick.tags || []).includes('chef') ? "Chef's" : pick.veg ? 'Veg' : 'Popular'}</em>
            </Card>
          ))}
        </div>
      </div>
      <div className="welcome-actions">
        <Button className="wide" onClick={onGoMenu}>See the full menu <Icon name="arrowRight" /></Button>
        <div className="split-actions">
          <Button variant="ghost" onClick={onGoHelp}>Call a server</Button>
          <Button variant="ghost" onClick={onGoHelp}>Ask for the bill</Button>
        </div>
      </div>
    </section>
  );
}
