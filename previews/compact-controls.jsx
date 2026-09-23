// Shared configurator boolean; use the existing Button control styling.
function CompactBoolean({label,value,onChange}) {
  return <div className="button-control"><span>{label}</span><div className="button-toggle-line"><span>{value?'开启':'关闭'}</span><label className="button-switch"><input type="checkbox" checked={value} onChange={event=>onChange(event.target.checked)} aria-label={label}/><span className="button-switch-track"/></label></div></div>;
}
