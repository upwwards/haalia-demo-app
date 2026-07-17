export function ThemePreview({ colors }) {
  const swatch = `linear-gradient(135deg, ${colors.join(', ')})`;

  return (
    <div className="theme-preview" aria-hidden="true" style={{ background: swatch }} />
  );
}
