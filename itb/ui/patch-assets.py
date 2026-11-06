"""Add a JSON viewer toggle to the pinned stock ITB 1.30.2 asset archive.

Fail closed if the component changes. This is a local UI adaptation, not a
change to the engine, stored reports, or the published ITB distribution.
"""
import gzip
from pathlib import Path
import sys
from zipfile import ZipFile

source, target = map(Path, sys.argv[1:3])
asset = 'public/build/main.js'
anchor = 'var Ur=(()=>{class i extends V_{constructor(e,n,t)'
hook = ('var Ur=(()=>{class i extends V_{'
        'ngAfterViewInit(){super.ngAfterViewInit();'
        'this.codeEditor?.codeMirrorLoaded.subscribe(()=>itbAttachJsonFormatter(this))}'
        'constructor(e,n,t)')
with ZipFile(source) as original:
    script = original.read(asset).decode('utf-8')
    if script.count(anchor) != 1 or 'itbAttachJsonFormatter' in script:
        raise RuntimeError('Unexpected ITB UI bundle: review the 1.30.2 formatter hook')
    script = script.replace(anchor, hook) + '\n' + Path(__file__).with_name('json-viewer.js').read_text()
    updated = script.encode('utf-8')
    with ZipFile(target, 'w') as output:
        for entry in original.infolist():
            if entry.filename == asset:
                content = updated
            elif entry.filename == asset + '.gz':
                content = gzip.compress(updated, mtime=0)
            else:
                content = original.read(entry)
            output.writestr(entry, content)
