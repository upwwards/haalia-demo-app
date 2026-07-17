import { useEffect, useMemo, useRef } from 'react';
import { DishThumb } from '../components/common/DishThumb.jsx';
import { Icon } from '../icons/Icon.jsx';
import { categoryNames, money } from '../data/menu.js';

const quickSearches = [
  { label: "Chef's picks", query: 'chef' },
  { label: 'Vegetarian', query: 'veg' },
  { label: 'Ribeye', query: 'ribeye' },
  { label: 'Dessert', query: 'dessert' },
  { label: 'Drinks', query: 'drink' },
];

function matchItem(item, query) {
  if (!query) return true;
  const haystack = [
    item.name,
    item.desc,
    categoryNames[item.cat],
    item.veg ? 'vegetarian veg' : '',
    ...(item.tags || []),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

export function SearchPage({ items, query, setQuery, onBack, onOpenItem }) {
  const inputRef = useRef(null);
  const cleanQuery = query.trim().toLowerCase();

  useEffect(() => {
    window.setTimeout(() => inputRef.current?.focus(), 90);
  }, []);

  const results = useMemo(() => {
    const filtered = items.filter((item) => matchItem(item, cleanQuery));
    if (cleanQuery) return filtered;
    return filtered.filter((item) => !item.soldOut).slice(0, 8);
  }, [cleanQuery, items]);

  return (
    <section className="screen search-screen" data-screen="search">
      <header className="search-head">
        <button type="button" className="icon-button" aria-label="Back to menu" onClick={onBack}>
          <Icon name="arrowLeft" size={19} />
        </button>
        <label className="sr-only" htmlFor="menu-search-page-input">
          Search dishes
        </label>
        <div className="search-page-field">
          <Icon name="search" size={18} />
          <input
            ref={inputRef}
            id="menu-search-page-input"
            data-testid="search-page-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by dish, ingredient, or category"
            autoComplete="off"
            enterKeyHint="search"
          />
          {query ? (
            <button type="button" aria-label="Clear search" onClick={() => setQuery('')}>
              <Icon name="x" size={17} />
            </button>
          ) : null}
        </div>
      </header>

      <div className="scroll-area search-scroll">
        {!cleanQuery ? (
          <section className="search-suggestions" aria-label="Suggested searches">
            <p className="section-kicker">Popular searches</p>
            <div className="search-chip-row">
              {quickSearches.map((term) => (
                <button key={term.label} type="button" onClick={() => setQuery(term.query)}>
                  {term.label}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <div className="search-result-meta">
          <span>{cleanQuery ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : 'Recommended now'}</span>
        </div>

        <div className="search-results">
          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`search-result ${item.soldOut ? 'disabled' : ''}`}
              onClick={() => onOpenItem(item.id)}
            >
              <DishThumb item={item} className="search-result-thumb" />
              <span className="search-result-copy">
                <strong>{item.name}</strong>
                <small>{item.desc}</small>
                <em>
                  {item.soldOut ? 'Sold out' : `${money(item.price)} - ${item.time} min`}
                </em>
              </span>
            </button>
          ))}
        </div>

        {!results.length ? (
          <div className="empty-state search-empty">
            <strong>No matching dishes</strong>
            Try a dish name, ingredient, or a category like mains.
          </div>
        ) : null}
      </div>
    </section>
  );
}
