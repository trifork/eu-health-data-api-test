// Appended to the pinned ITB UI bundle by patch-assets.py.
// Format whitespace only: JSON.parse/stringify would round large numbers,
// rewrite numeric lexemes and collapse duplicate object keys in test evidence.
function itbPrettyJson(raw) {
  if (typeof raw !== 'string' || !/^[\s]*[\[{]/.test(raw)) return null;
  try { JSON.parse(raw); } catch { return null; }
  const tokens = raw.match(/"(?:\\.|[^"\\])*"|[{}\[\],:]|[^\s{}\[\],:]+/g);
  const output = [];
  let depth = 0;
  const newline = () => output.push('\n', '  '.repeat(depth));
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '{' || token === '[') {
      output.push(token);
      depth++;
      if (tokens[i + 1] !== '}' && tokens[i + 1] !== ']') newline();
    } else if (token === '}' || token === ']') {
      depth--;
      if (tokens[i - 1] !== '{' && tokens[i - 1] !== '[') newline();
      output.push(token);
    } else if (token === ',') {
      output.push(token);
      newline();
    } else if (token === ':') {
      output.push(': ');
    } else {
      output.push(token);
    }
  }
  return output.join('');
}

function itbAttachJsonFormatter(component) {
  const editor = component.codeEditor?.codeMirror;
  // Do not change editable documents or reports with line-specific annotations.
  if (!editor || !component.editorOptions?.readOnly ||
      component.indicators?.length || component.lineNumber != null) return;
  const raw = editor.getValue();
  const formatted = itbPrettyJson(raw);
  if (formatted === null) return;
  const modal = editor.getWrapperElement().closest('app-code-editor-modal');
  const toolbar = modal?.querySelector('.modal-footer .btn-toolbar');
  if (!toolbar || toolbar.querySelector('[data-itb-json-format]')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-secondary';
  button.dataset.itbJsonFormat = '';
  button.style.marginRight = '8px';
  let pretty = false;
  const label = () => {
    button.textContent = pretty ? 'Show raw' : 'Pretty print JSON';
    button.setAttribute('aria-pressed', String(pretty));
    button.title = 'Toggle JSON indentation; the stored response is unchanged';
  };
  button.addEventListener('click', () => {
    pretty = !pretty;
    const value = pretty ? formatted : raw;
    component.editorOptions.value = value;
    editor.setValue(value);
    editor.scrollTo(0, 0);
    editor.refresh();
    label();
  });
  label();
  toolbar.prepend(button);
}
