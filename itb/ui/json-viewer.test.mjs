import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

function load(document) {
  const context = vm.createContext({ document });
  vm.runInContext(fs.readFileSync(new URL('./json-viewer.js', import.meta.url), 'utf8'), context);
  return context;
}

test('formats a FHIR bundle and preserves every non-whitespace JSON token', () => {
  const { itbPrettyJson } = load();
  const raw = ' {"resourceType":"Bundle","entry":[{"resource":{"id":"123","text":"a, \\\"b\\\" \\n {} []"}}],"empty":{},"list":[],"big":9007199254740993,"decimal":1.2300,"exponent":1e+08,"negative":-0,"duplicate":1,"duplicate":2} ';
  const formatted = itbPrettyJson(raw);
  assert.match(formatted, /^\{\n  "resourceType": "Bundle",\n  "entry": \[\n/);
  const tokens = text => text.match(/"(?:\\.|[^"\\])*"|[^\s]+?/g);
  assert.deepEqual(tokens(formatted), tokens(raw));
  assert.equal(itbPrettyJson(formatted), formatted);
  assert.deepEqual(JSON.parse(formatted), JSON.parse(raw));
  assert.equal(itbPrettyJson('{}'), '{}');
  assert.equal(itbPrettyJson('[]'), '[]');
});

test('does not offer JSON formatting for invalid JSON or other content', () => {
  const { itbPrettyJson } = load();
  for (const raw of ['{"bad":}', '<Bundle/>', 'plain text', '', 'null', '123', '{"unterminated":"x}', '{"x": NaN}']) {
    assert.equal(itbPrettyJson(raw), null, raw);
  }
});

function viewer(options = {}) {
  const raw = '  {"id":9007199254740993,"entry":[]}\r\n';
  let value = raw;
  const buttons = [];
  const toolbar = { querySelector: () => buttons[0], prepend: button => buttons.unshift(button) };
  const document = { createElement: () => ({ dataset: {}, style: {}, attributes: {},
    setAttribute(key, val) { this.attributes[key] = val; },
    addEventListener(event, listener) { this[event] = listener; },
  }) };
  const editor = { getValue: () => value, setValue: next => { value = next; },
    getWrapperElement: () => ({ closest: () => ({ querySelector: () => toolbar }) }),
    scrollTo() {}, refresh() {},
  };
  const component = { codeEditor: { codeMirror: editor }, editorOptions: { readOnly: true, value: raw }, ...options };
  return { ...load(document), component, buttons, raw, editor };
}

test('toggle formats the displayed/copied content and restores the exact raw response', () => {
  const view = viewer();
  view.itbAttachJsonFormatter(view.component);
  assert.equal(view.buttons.length, 1);
  const button = view.buttons[0];
  assert.equal(button.textContent, 'Pretty print JSON');
  button.click();
  assert.equal(button.textContent, 'Show raw');
  assert.equal(button.attributes['aria-pressed'], 'true');
  assert.match(view.editor.getValue(), /\n  "id": 9007199254740993,/);
  assert.equal(view.component.editorOptions.value, view.editor.getValue());
  button.click();
  assert.equal(view.editor.getValue(), view.raw);
  assert.equal(button.attributes['aria-pressed'], 'false');
  view.itbAttachJsonFormatter(view.component);
  assert.equal(view.buttons.length, 1);
});

test('leaves editable documents and line-annotated reports alone', () => {
  for (const options of [{ editorOptions: { readOnly: false } }, { indicators: [{}] }, { lineNumber: 1 }]) {
    const view = viewer(options);
    view.itbAttachJsonFormatter(view.component);
    assert.equal(view.buttons.length, 0);
    assert.equal(view.editor.getValue(), view.raw);
  }
});
