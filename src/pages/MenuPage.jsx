import { Badge } from '../components/common/Badge.jsx';
import { Icon } from '../icons/Icon.jsx';
import { money, tintByCategory } from '../data/menu.js';

function MenuItem({ item, itemActions }) {
  const qty = itemActions.qtyFor(item.id);
  const configurable = Boolean(item.hasVariants || (item.modifiers && item.modifiers.length));
  const tags = item.tags || [];

  return (
    <article className={`menu-item ${item.soldOut ? 'disabled' : ''}`}>
      <button type="button" className="menu-item-copy" onClick={() => itemActions.openItem(item.id)}>
        <div className="tag-row">
          {tags.includes('chef') ? <Badge tone="accent">Chef's</Badge> : null}
          {tags.includes('popular') ? <Badge>Popular</Badge> : null}
          {item.veg ? <Badge tone="success">Veg</Badge> : null}
          {item.soldOut ? <Badge tone="danger">Sold out</Badge> : null}
        </div>
        <h3>{item.name}</h3>
        <p>{item.desc}</p>
        <div className="meta-line">
          <strong>{item.hasVariants ? 'from ' : ''}{money(item.price)}</strong>
          <span>{item.time} min</span>
          {configurable && qty > 0 ? <Badge tone="accent">{qty} in order</Badge> : null}
        </div>
      </button>
      <div className="dish-art">
        <button type="button" className="thumb dish-thumb" style={{ background: tintByCategory[item.cat] }} onClick={() => itemActions.openItem(item.id)}>
          {item.name[0]}
        </button>
        {item.model ? (
          <button type="button" className="ar-chip" aria-label="View in 3D AR" onClick={() => itemActions.openAr(item.id)}>
            <Icon name="cube" size={11} /> AR
          </button>
        ) : null}
        {!item.soldOut && qty > 0 && !configurable ? (
          <div className="mini-stepper">
            <button type="button" onClick={() => itemActions.subSimple(item.id)}><Icon name="minus" size={13} /></button>
            <span>{qty}</span>
            <button type="button" onClick={() => itemActions.addSimple(item.id)}><Icon name="plus" size={13} /></button>
          </div>
        ) : !item.soldOut ? (
          <button
            type="button"
            className="add-dot"
            aria-label={`Add ${item.name}`}
            onClick={() => {
              if (configurable) itemActions.openItem(item.id);
              else {
                itemActions.addSimple(item.id);
              }
            }}
          >
            <Icon name="plus" size={13} />
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function MenuPage({
  activeCategory,
  cartCount,
  cartTotalLabel,
  categories,
  hero,
  items,
  itemActions,
  onCategory,
  onGoCart,
  search,
  setSearch,
}) {
  return (
    <section className="screen menu-screen" data-screen="menu">
      <div className="menu-tools">
        <label className="search-box">
          <Icon name="search" size={16} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search dishes..." />
        </label>
        <div className="category-scroll" role="tablist" aria-label="Menu categories">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === category.id}
              className={activeCategory === category.id ? 'active' : ''}
              onClick={() => onCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <div className="scroll-area menu-list">
        {hero ? (
          <button type="button" className="hero-dish" onClick={() => itemActions.openItem(hero.id)}>
            <span>
              <em className="overline">Chef's pick tonight</em>
              <strong>{hero.name}</strong>
              <small>{money(hero.price)} · {hero.time} min</small>
            </span>
            <b className="thumb" style={{ background: tintByCategory[hero.cat] }}>{hero.name[0]}</b>
          </button>
        ) : null}
        {items.map((item) => (
          <MenuItem key={item.id} item={item} itemActions={itemActions} />
        ))}
        {!items.length ? <div className="empty-state">Nothing matches that search.</div> : null}
      </div>
      {cartCount > 0 ? (
        <button type="button" className="cart-bar" onClick={onGoCart}>
          <span>{cartCount}</span>
          <strong>View order <small>{cartTotalLabel} · not sent yet</small></strong>
          <Icon name="arrowRight" />
        </button>
      ) : null}
    </section>
  );
}
