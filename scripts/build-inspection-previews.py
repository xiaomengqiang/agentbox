from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
p=root/'index.components.html'; html=p.read_text()
def clean(src):
 return re.sub(r'^import .*;\s*$', '',src,flags=re.M).replace('export default function ', 'function ')
for ident,path in [('iconstate','components/IconState/components/IconState'),('menuitem','components/MenuItem')]:
 component=clean((root/path/'index.jsx').read_text())
 preview=clean((root/'previews'/f'{ident}.jsx').read_text())
 block='/* COMPONENT_PREVIEW:'+ident+' */\n(function(){const {Icon}=window.ComponentIcons;const {useState,useEffect}=React;\n'+component+'\n'+preview+'\nwindow.PreviewDemos.'+ident+'=Demo;})();\n/* END_COMPONENT_PREVIEW:'+ident+' */'
 html,n=re.subn(r'/\* COMPONENT_PREVIEW:'+ident+r' \*/[\s\S]*?/\* END_COMPONENT_PREVIEW:'+ident+r' \*/',lambda m:block,html)
 assert n==1
# CSS synchronized from the implementation, scoped to the affected panels.
# Button's gallery rules are inside @scope(.preview-button), so class reuse
# alone cannot style another panel. Reuse its exact gallery CSS in a new scope.
reference_start = html.index('@scope (.preview-button) {') + len('@scope (.preview-button) {')
reference_end = html.rfind('/* ==========================================================================', reference_start, html.index('Button · Material 3', reference_start))
assert 'Button · Material 3' in html[reference_end:reference_end + 160]
reference_css = html[reference_start:reference_end].strip()
assert '.button-configurator {' in reference_css and '.btn-matrix-group {' in reference_css
css = '@scope (.preview-iconstate, .preview-menuitem) {\n' + reference_css + '\n}\n'
css += (root/'previews/inspection.css').read_text()
for ident,path in [('iconstate','components/IconState/components/IconState/index.css'),('menuitem','components/MenuItem/index.css')]:
 raw=re.sub(r'/\*[\s\S]*?\*/','',(root/path).read_text())
 raw=re.sub(r'([^{}]+)\{',lambda m:', '.join('.preview-'+ident+' '+x.strip() for x in m[1].split(','))+' {',raw)
 css=raw+'\n'+css
style='<style id="inspection-preview-styles">\n'+css+'\n</style>'
html=re.sub(r'<style id="inspection-preview-styles">[\s\S]*?</style>','',html)
html=html.replace('</head>',style+'\n</head>')
p.write_text(html)
print('Regenerated IconState and MenuItem previews')
