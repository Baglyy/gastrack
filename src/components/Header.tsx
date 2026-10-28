interface Props {
  locating: boolean;
  onLocate: () => void;
}

export function Header({ locating, onLocate }: Props) {
  return (
    <header className="header">
      <div className="brand">
        <img src="/favicon.svg" alt="" width={32} height={32} />
        <h1>GasTrack</h1>
      </div>
      <button className="btn btn-primary" onClick={onLocate} disabled={locating}>
        {locating ? "Localisation…" : "Autour de moi"}
      </button>
    </header>
  );
}
