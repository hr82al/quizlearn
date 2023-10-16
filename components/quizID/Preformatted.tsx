
export function Preformatted({ text }: { text: string; }) {
  return (
    <pre className="inline break-all whitespace-pre-wrap">
      {text}
    </pre>
  );
}
