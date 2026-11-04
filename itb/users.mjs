import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.dirname(fileURLToPath(import.meta.url));
const base = `http://localhost:${process.env.ITB_PORT || 9000}/api`;
const file = path.join(root, '.users.json');
const users = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
function save() {
  fs.writeFileSync(file, JSON.stringify(users, null, 2) + '\n', { mode: 0o600 });
  fs.chmodSync(file, 0o600);
}
async function request(endpoint, { token, form } = {}) {
  const res = await fetch(`${base}${endpoint}`, {
    method: form ? 'POST' : 'GET',
    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest',
      ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: form ? new URLSearchParams(form) : undefined, signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`UI API ${endpoint}: HTTP ${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
async function login(email, password) {
  const result = await request('/oauth/access_token', { form: { email, password } });
  if (!result.access_token) throw new Error(`Login failed for ${email}`);
  return result.access_token;
}
let admin;
if (users.adminPassword || process.env.ITB_ADMIN_PASSWORD) {
  admin = await login('admin@itb', process.env.ITB_ADMIN_PASSWORD || users.adminPassword);
} else {
  const logs = execFileSync('docker', ['compose', '--env-file', path.join(root, '.env'),
    'logs', '--no-log-prefix', 'gitb-ui'], { cwd: path.dirname(root), encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const initial = logs.match(/The one-time password for the default administrator account \[admin@itb\] is:[\s\S]*?\n\s*([a-f0-9-]{36})\s*\n/)?.[1];
  if (!initial) throw new Error('No initial admin password found. Set ITB_ADMIN_PASSWORD to the existing password.');
  users.adminPassword = `ItbAdmin!${crypto.randomBytes(16).toString('hex')}`;
  save();
  const result = await request('/oauth/replacePassword', { form: {
    email: 'admin@itb', old_password: initial, password: users.adminPassword,
  } });
  admin = result.access_token;
}
const organisations = await request('/organizations/all', { token: admin });
const organisation = organisations.find(o => o.sname === 'EU API local testing');
if (!organisation) throw new Error('Run setup.mjs first');
users.username ??= 'eu-api-test@itb';
if (!users.password) {
  const existing = await request(`/organizations/users?id=${organisation.id}&page=1&limit=100`, { token: admin });
  const exists = existing.data.some(u => u.email === users.username);
  if (exists && !users.initialPassword) {
    throw new Error('Test user already exists but local credentials are missing; recover them instead of resetting the user.');
  }
  users.initialPassword ??= `ItbInitial!${crypto.randomBytes(16).toString('hex')}`;
  save();
  if (!exists) {
    await request(`/organizations/${organisation.id}/users/create`, { token: admin, form: {
      user_name: 'EU API Test User', user_email: users.username, password: users.initialPassword, role_id: '2',
    } });
  }
  users.password = `ItbTest!${crypto.randomBytes(16).toString('hex')}`;
  save();
}
if (users.initialPassword) {
  await request('/oauth/replacePassword', { form: {
    email: users.username, old_password: users.initialPassword, password: users.password,
  } });
  delete users.initialPassword;
  save();
}
const token = await login(users.username, users.password);
const profile = await request('/user/profile', { token });
const systems = await request(`/vendor/systems?organization_id=${organisation.id}`, { token });
const system = systems.find(s => s.sname === 'Implementation under test');
if (profile.email !== users.username || profile.organization?.id !== organisation.id || !system) {
  throw new Error('Test-user access verification failed');
}
const statements = await request(`/suts/${system.id}/conformance?page=1&limit=100`, { token });
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'build/manifest.json'), 'utf8'));
const flatten = items => items.flatMap(item => [item, ...flatten(item.items || [])]);
const visible = flatten(statements.data || []).filter(item => item.itemType === 4);
if (visible.length !== manifest.length || manifest.some(suite => {
  const result = visible.find(item => item.name === suite.actor)?.results;
  return !result || result.undefined + result.failed + result.completed !== suite.testCases.length;
})) {
  throw new Error('Expected six visible conformance statements');
}
console.log(`Verified login and assigned tests for ${users.username}. Credentials: ${file}`);
