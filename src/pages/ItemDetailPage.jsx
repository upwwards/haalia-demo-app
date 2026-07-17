import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { Icon } from '../icons/Icon.jsx';
import { money, tintByCategory } from '../data/menu.js';

export function ItemDetailPage({
  detail,
  item,
  menuItems,
  modOptions,
  mods,
  onAdd,
  onBack,
  onOpenAr,
  onOpenPair,
  qty,
  setQty,
  setSingleMod,
  setVariant,
  toggleMultiMod,
  variant,
}) {
  const selectedVariant = item.hasVariants ? item.variants.find((entry) => entry.id === variant) || item.variants[0] : null;
  const options = modOptions(item, mods);
  const unit = (selectedVariant ? selectedVariant.price : item.price) + options.delta;
  const pairs = menuItems.filter((entry) => entry.id !== item.id && !entry.soldOut).slice(0, 2);
  const tags = item.tags || [];

  return (
    <section className="screen detail-screen" data-screen="item">
      <div className="scroll-area detail-scroll">
        <div
          className={item.image ? 'detail-hero image-detail-hero' : 'detail-hero'}
          style={item.image ? { backgroundImage: `url(${item.image})` } : { background: tintByCategory[item.cat] }}
        >
          <div className="detail-topbar">
            <button type="button" className="icon-button detail-back" onClick={onBack} aria-label="Back to menu">
              <Icon name="arrowLeft" />
            </button>
          </div>
          <span>{item.name[0]}</span>
          <div className="floating-tags">
            {tags.includes('chef') ? <Badge tone="accent">Chef's</Badge> : null}
            {tags.includes('popular') ? <Badge>Popular</Badge> : null}
          </div>
          {item.model ? (
            <Button variant="dark" size="sm" className="ar-button" onClick={onOpenAr}>
              <Icon name="cube" size={15} /> View in 3D · AR
            </Button>
          ) : null}
        </div>
        <div className="detail-title">
          <h2>{item.name}</h2>
          <strong>{item.hasVariants ? <small>from</small> : null}{money(item.price)}</strong>
        </div>
        <p className="detail-desc">{item.desc}</p>
        {detail.more ? <p className="detail-more">{detail.more}</p> : null}
        <div className="info-pills">
          <span><Icon name="clock" size={14} /> ~{item.time} min</span>
          <span>{item.veg ? 'Vegetarian' : 'Signature'}</span>
        </div>
        {detail.ing?.length ? (
          <>
            <p className="overline muted detail-label">What's inside</p>
            <div className="chip-row">{detail.ing.map((entry) => <span key={entry}>{entry}</span>)}</div>
          </>
        ) : null}
        {detail.alg ? <p className="allergy-note">Contains {detail.alg} - tell us about any allergies in your order note.</p> : null}
        {item.hasVariants ? (
          <div className="option-block">
            <p className="overline accent">Choose your cut</p>
            {item.variants.map((entry) => (
              <button key={entry.id} type="button" className={variant === entry.id ? 'selected option-row' : 'option-row'} onClick={() => setVariant(entry.id)}>
                <span>{entry.label}</span>
                <strong>{money(entry.price)}</strong>
              </button>
            ))}
          </div>
        ) : null}
        {(item.modifiers || []).map((group) => (
          <div className="option-block" key={group.id}>
            <p className="overline accent">{group.name} <small>{group.required ? 'Required' : 'Optional'}</small></p>
            {group.options.map((option) => {
              const selected = group.type === 'multi' ? (mods[group.id] || []).includes(option.id) : mods[group.id] === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={selected ? 'selected option-row with-mark' : 'option-row with-mark'}
                  onClick={() => (group.type === 'multi' ? toggleMultiMod(group.id, option.id) : setSingleMod(group.id, option.id))}
                >
                  <span className={group.type === 'multi' ? 'mark square' : 'mark'}>{selected ? <Icon name="check" size={11} /> : null}</span>
                  <span>{option.label}</span>
                  {option.price ? <strong>+{money(option.price)}</strong> : null}
                </button>
              );
            })}
          </div>
        ))}
        <p className="overline muted detail-label">Goes well with</p>
        <div className="pair-grid">
          {pairs.map((pair) => (
            <button key={pair.id} type="button" className="pair-card" onClick={() => onOpenPair(pair.id)}>
              <span
                className={pair.image ? 'thumb image-thumb' : 'thumb'}
                style={pair.image ? { backgroundImage: `url(${pair.image})` } : { background: tintByCategory[pair.cat] }}
              >
                <span>{pair.name[0]}</span>
              </span>
              <strong>{pair.name}<small>{pair.hasVariants ? 'from ' : ''}{money(pair.price)}</small></strong>
            </button>
          ))}
        </div>
      </div>
      <div className="bottom-action">
        <div className="stepper">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}><Icon name="minus" size={15} /></button>
          <span>{qty}</span>
          <button type="button" onClick={() => setQty(qty + 1)}><Icon name="plus" size={16} /></button>
        </div>
        <Button className="grow" onClick={onAdd}>Add to order · {money(unit * Math.max(1, qty))}</Button>
      </div>
    </section>
  );
}
