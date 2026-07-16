import { Icon } from '../../icons/Icon.jsx';

export function Avatar() {
  return (
    <div className="avatar" aria-label="Guest profile" title="Guest profile">
      <Icon name="user" size={18} />
    </div>
  );
}
