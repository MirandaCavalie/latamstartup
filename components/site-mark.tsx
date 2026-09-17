export function SiteMark({
  variant = 'header',
}: {
  variant?: 'header' | 'footer';
}) {
  return (
    <span className={'site-mark site-mark-' + variant}>
      <img src="/brand/combi-mark.png" alt="" width="1254" height="1254" />
      <span className="site-wordmark">la combi<span className="site-wordmark-stop">.</span></span>
    </span>
  );
}
