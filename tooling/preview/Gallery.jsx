import React, { useEffect, useState } from 'react';
import { Icon } from '../../assets/shared/icons.js';

export default function Gallery({ entries, title, standalone = false, panelClassName = "" }) {
  const [active, setActive] = useState(() => entries.find(item => item.id === location.hash.slice(1))?.id || entries[0].id);
  const [visited, setVisited] = useState(() => new Set([active]));
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('agentbox-preview-theme') === 'dark'; } catch { return false; }
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    try { localStorage.setItem('agentbox-preview-theme', dark ? 'dark' : 'light'); } catch {}
  }, [dark]);
  useEffect(() => { document.getElementById('tab-' + active)?.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }, [active]);
  function select(id) {
    setActive(id);
    setVisited(previous => new Set([...previous, id]));
    history.replaceState(null, '', '#' + id);
  }
  function navigate(event, index) {
    const offsets = { ArrowRight: (index + 1) % entries.length, ArrowLeft: (index + entries.length - 1) % entries.length, Home: 0, End: entries.length - 1 };
    if (!(event.key in offsets)) return;
    event.preventDefault();
    const id = entries[offsets[event.key]].id;
    select(id);
    document.getElementById('tab-' + id)?.focus();
  }
  return <>
    <header className="preview-toolbar">
      <div className="preview-heading">
        <h1>组件预览</h1>
        <button type="button" className="preview-theme" role="switch" aria-label="深色模式" aria-checked={dark} onClick={() => setDark(value => !value)}>
          <span className="theme-sun" aria-hidden="true"><Icon name="sun" size={18} /></span>
          <span className="theme-moon" aria-hidden="true"><Icon name="moon" size={18} /></span>
        </button>
        <span className="gallery-library-label">{title}</span>
      </div>
      {!standalone && <nav className="preview-tabs" role="tablist" aria-label={title}>
        {entries.map((entry, index) => <button key={entry.id} id={'tab-' + entry.id} className="preview-tab" role="tab"
          aria-selected={active === entry.id} aria-controls={'panel-' + entry.id} tabIndex={active === entry.id ? 0 : -1}
          onClick={() => select(entry.id)} onKeyDown={event => navigate(event, index)}>{entry.name}</button>)}
      </nav>}
    </header>
    {entries.map(({ id, name, Demo }) => <main key={id} className={'preview-' + id + ' ' + panelClassName} id={'panel-' + id}
      role={standalone ? undefined : 'tabpanel'} aria-label={standalone ? name : undefined}
      aria-labelledby={standalone ? undefined : 'tab-' + id} hidden={active !== id}>
      {visited.has(id) ? <Demo /> : null}
    </main>)}
  </>;
}
