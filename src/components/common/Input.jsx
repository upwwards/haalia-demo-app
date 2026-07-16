export function Input({ className = '', ...props }) {
  return <input className={`field ${className}`.trim()} {...props} />;
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`field textarea ${className}`.trim()} {...props} />;
}
