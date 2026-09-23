import React from "react";
// Shared configurator boolean; use the existing Button control styling.
export function CompactBoolean({label,value,onChange}) {
  return <div className="button-control"><span>{label}</span><div className="button-toggle-line"><span>{value?'开启':'关闭'}</span><label className="button-switch"><input type="checkbox" checked={value} onChange={event=>onChange(event.target.checked)} aria-label={label}/><span className="button-switch-track"/></label></div></div>;
}

export function ContractTable({rows,color=false}){return <div className="preview-table-wrap"><table className={'preview-table'+(color?' preview-table--color':'')}><thead><tr>{(color?['Variant','State','Background','Outline','Text']:['Property','Value','Token / rule']).map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{rows}</tbody></table></div>;}
