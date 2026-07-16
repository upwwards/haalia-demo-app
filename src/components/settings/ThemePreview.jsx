export function ThemePreview({ colors }) {
  return (
    <div className="theme-preview" aria-hidden="true">
      {colors.map((color) => (
        <span key={color} style={{ background: color }} />
      ))}
    </div>
  );
}
