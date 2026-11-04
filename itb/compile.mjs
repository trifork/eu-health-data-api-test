import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.dirname(fileURLToPath(import.meta.url));
const features = path.resolve(root, '../input/testing/gherkin');
const build = path.join(root, 'build');
const cli = path.join(root, 'node_modules/@opentestbed/otb-gherkin/bin/otb-gherkin.mjs');
fs.mkdirSync(build, { recursive: true });
// A failed compilation must never leave a deployable manifest from an older run.
fs.rmSync(path.join(build, 'manifest.json'), { force: true });
execFileSync(process.execPath, [cli, 'dialects', '--installed', '--out', path.join(build, 'assets')], {
  cwd: root, stdio: 'inherit',
});
const manifest = [];
for (const filename of fs.readdirSync(features).filter(f => f.endsWith('.feature')).sort()) {
  const source = path.join(features, filename);
  const text = fs.readFileSync(source, 'utf8');
  // The grouped feature's descriptive @actor tag differs from its actual
  // Gherkin SUT identifier (GroupedProvider), which ITB uses for assignment.
  const actor = text.match(/Given\s+(\w+) is the system under test\b/)?.[1];
  if (!actor) throw new Error(`Missing system under test in ${filename}`);
  const name = path.basename(filename, '.feature');
  const out = path.join(build, name);
  fs.rmSync(out, { recursive: true, force: true });
  // Compiler 0.5.0 only zips the last feature in a multi-file invocation.
  const result = JSON.parse(execFileSync(process.execPath, [cli, 'compile', source,
    '--out', out, '--zip', 'suite.zip', '--json'], {
    cwd: root, encoding: 'utf8', env: { ...process.env, ITB_ASSET_ROOT: path.join(build, 'assets') },
  }));
  const report = result.files[0];
  if (!result.ok || report.errors.length || report.warnings.length || !report.testCases.length) {
    throw new Error(`Compilation failed: ${JSON.stringify(result)}`);
  }
  execFileSync('python3', [path.join(root, 'normalize.py'), out], { stdio: 'inherit' });
  manifest.push({ feature: filename, actor, suite: report.suite,
    testCases: report.testCases, archive: `${name}/suite.zip` });
  console.log(`${filename}: ${report.testCases.length} test cases`);
}
if (!manifest.length) throw new Error('No feature files found');
fs.writeFileSync(path.join(build, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Compiled ${manifest.length} suites, ${manifest.reduce((n, s) => n + s.testCases.length, 0)} test cases.`);
