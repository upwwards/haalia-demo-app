import { useRef } from 'react';
import { Badge } from '../components/common/Badge.jsx';
import { DishThumb } from '../components/common/DishThumb.jsx';
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
        <button type="button" className={item.image ? 'thumb dish-thumb image-thumb' : 'thumb dish-thumb'} style={item.image ? { backgroundImage: `url(${item.image})` } : { background: tintByCategory[item.cat] }} onClick={() => itemActions.openItem(item.id)}>
          <span>{item.name[0]}</span>
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
  onChromeCompactChange,
  onGoCart,
  onOpenSearch,
  search,
}) {
  const compactRef = useRef(false);

  function handleMenuScroll(event) {
    const compact = event.currentTarget.scrollTop > 28;
    if (compactRef.current === compact) return;
    compactRef.current = compact;
    onChromeCompactChange?.(compact);
  }

  return (
    <section className="screen menu-screen" data-screen="menu">
      <div className="menu-tools">
        <button type="button" className="search-box search-launch" aria-label="Search menu" onClick={onOpenSearch}>
          <Icon name="search" size={16} />
          <span className={search ? 'search-launch-value' : 'search-launch-placeholder'}>
            {search || 'Search dishes...'}
          </span>
        </button>
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
      <div className="scroll-area menu-list" onScroll={handleMenuScroll}>
        {hero ? (
          <button type="button" className="hero-dish" onClick={() => itemActions.openItem(hero.id)}>
            <span>
              <em className="overline">Chef's pick tonight</em>
              <strong>{hero.name}</strong>
              <small>{money(hero.price)} · {hero.time} min</small>
            </span>
            <DishThumb item={hero} />
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
