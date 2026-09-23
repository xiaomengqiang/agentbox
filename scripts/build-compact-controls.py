from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
p=root/'index.components.html';s=p.read_text()
entries=[('checkbox','Demo','window.PreviewDemos.checkbox'),('action-chip','Demo',"window.PreviewDemos['action-chip']"),('tag','TagDemo','function TextTabsDemo'),('text-tabs','TextTabsDemo','function ToggleDemo'),('toggle','ToggleDemo','window.PreviewDemos.tag=TagDemo')]
for ident,name,stop in entries:
 end=s.index(stop);start=s.rfind('function '+name+'(){',0,end)
 assert start>=0
 src=(root/'previews'/f'{ident}.jsx').read_text()
 src=src[src.index('function '+name+'(){'):].strip()
 s=s[:start]+src+'\n '+s[end:]
helper=(root/'previews/compact-controls.jsx').read_text()
block='/* BEGIN_COMPACT_CONTROL_HELPERS */\n'+helper+'/* END_COMPACT_CONTROL_HELPERS */'
pattern=r'/\* BEGIN_COMPACT_CONTROL_HELPERS \*/[\s\S]*?/\* END_COMPACT_CONTROL_HELPERS \*/'
if re.search(pattern,s):s=re.sub(pattern,lambda m:block,s)
else:s=s.replace('const COMPONENT_PREVIEWS =',block+'\nconst COMPONENT_PREVIEWS =',1)
# Source Button rules, including wrapped arrow, hover/focus/disabled and switches.
a=s.index('.button-control {',s.index('@scope (.preview-button) {'))
b=s.index('.button-configurator-preview {',a)
reference=s[a:b].strip()
scopes=', '.join('.preview-'+ident for ident,_,_ in entries)
style='<style id="compact-control-styles">\n@scope ('+scopes+') {\n'+reference+'\n}\n</style>'
pattern=r'<style id="compact-control-styles">[\s\S]*?</style>'
if re.search(pattern,s):s=re.sub(pattern,lambda m:style,s)
else:s=s.replace('</head>',style+'\n</head>',1)
p.write_text(s)
print('Updated controls in Toggle, Checkbox, TextTabs, Tag and ActionChip')
