import { tintByCategory } from '../../data/menu.js';

export function DishThumb({ item, className = '', children }) {
  if (item.image) {
    return (
      <span className={`thumb image-thumb ${className}`.trim()}>
        <img src={item.image} alt="" loading="lazy" draggable="false" />
        <span>{item.name[0]}</span>
      </span>
    );
  }

  return (
    <span className={`thumb ${className}`.trim()} style={{ background: tintByCategory[item.cat] }}>
      {children || item.name[0]}
    </span>
  );
}
