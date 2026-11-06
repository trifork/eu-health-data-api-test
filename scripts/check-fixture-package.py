"""Check the built package ships exact R4 fixture assets and case links."""
import json
from pathlib import Path
import tarfile
root = Path(__file__).resolve().parent.parent
fixture_dir = root / 'input/testing/fixtures/provider-v1'
manifest = json.loads((fixture_dir / 'manifest.json').read_text())
with tarfile.open(root / 'dist/package.tgz') as package:
    for source in fixture_dir.iterdir():
        packed = package.extractfile('package/tests/fixtures/provider-v1/' + source.name)
        assert packed and packed.read() == source.read_bytes(), source.name
    cases = set()
    for entry in package.getmembers():
        if entry.name.startswith('package/TestPlan-') and entry.name.endswith('.json'):
            plan = json.load(package.extractfile(entry))
            for suite in plan['suite']:
                for case in suite['test']:
                    identifier = case['name'].split()[0]
                    assert 'fixtures/provider-v1/manifest.json' in case.get('description', ''), identifier
                    assert identifier in manifest['cases'], identifier
                    cases.add(identifier)
    assert cases == set(manifest['cases'])
    assert manifest['fhirVersion'] == '4.0.1'
    assert not any(e.name.startswith(('package/Patient-', 'package/Observation-', 'package/Bundle-eu-api-provider')) for e in package.getmembers())
print(f'Package contains all 4 fixture files unchanged and fixture links from all {len(cases)} cases; R4 data stays under tests/.')
