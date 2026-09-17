export function SiteMark({
  variant = 'header',
}: {
  variant?: 'header' | 'footer';
}) {
  return (
    <span className={'site-mark site-mark-' + variant}>
      <img src="/brand/chancla-mark.png" alt="" width="27" height="40" />
      <span className="site-wordmark">chancletazo</span>
    </span>
  );
}
