export default function Ticker({ phrases }) {
  const group = phrases.map((phrase) => <span key={phrase}><b>✳</b>{phrase}</span>);
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track"><div>{group}</div><div>{group}</div></div>
    </div>
  );
}
