import { Button } from '../components/common/Button.jsx';
import { Card } from '../components/common/Card.jsx';
import { Icon } from '../icons/Icon.jsx';
import { categoryNames, money, tintByCategory } from '../data/menu.js';

function WelcomePickSkeleton() {
  return (
    <div className="card pick-card pick-card-skeleton skeleton-card" aria-hidden="true">
      <span className="skeleton-block skeleton-thumb" />
      <span className="skeleton-copy">
        <span className="skeleton-line skeleton-line-strong" />
        <span className="skeleton-line skeleton-line-short" />
      </span>
      <span className="skeleton-pill" />
    </div>
  );
}

export function WelcomePage({ isLoading = false, picks, onGoHelp, onGoMenu, onOpenItem, tableLabel, venueName }) {
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
        <div className="pick-list" aria-busy={isLoading}>
          {isLoading ? (
            <>
              <WelcomePickSkeleton />
              <WelcomePickSkeleton />
            </>
          ) : (
            picks.map((pick) => (
            <Card key={pick.id} as="button" className="pick-card" onClick={() => onOpenItem(pick.id)}>
              <div
                className={pick.image ? 'thumb image-thumb' : 'thumb'}
                style={pick.image ? { backgroundImage: `url(${pick.image})` } : { background: tintByCategory[pick.cat] }}
              >
                <span>{pick.name[0]}</span>
              </div>
              <span>
                <strong>{pick.name}</strong>
                <small>{categoryNames[pick.cat] || 'Dish'} · {pick.hasVariants ? 'from ' : ''}{money(pick.price)}</small>
              </span>
              <em>{(pick.tags || []).includes('chef') ? "Chef's" : pick.veg ? 'Veg' : 'Popular'}</em>
            </Card>
            ))
          )}
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
