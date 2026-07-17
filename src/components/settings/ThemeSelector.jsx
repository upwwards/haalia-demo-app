import { Icon } from '../../icons/Icon.jsx';
import { useTheme } from '../../hooks/useTheme.js';
import { ThemePreview } from './ThemePreview.jsx';

export function ThemeSelector() {
  const { activeTheme, availableThemes, setTheme } = useTheme();

  return (
    <div className="theme-list" role="radiogroup" aria-label="Theme">
      {availableThemes.map((theme) => {
        const selected = activeTheme === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            className={`theme-option ${selected ? 'selected' : ''}`}
            data-testid={`theme-option-${theme.id}`}
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(theme.id)}
          >
            <ThemePreview colors={theme.previewColors} />
            <span>
              <strong>{theme.name}</strong>
              <small>{theme.description}</small>
            </span>
            {selected ? <Icon name="check" size={18} /> : null}
          </button>
        );
      })}
    </div>
  );
}
