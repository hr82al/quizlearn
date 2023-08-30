export default function Modal({ children }: {children: React.ReactNode}) {
  return (
    <div
      className="modal-notify"
    >
        {children}
    </div>
  );
}