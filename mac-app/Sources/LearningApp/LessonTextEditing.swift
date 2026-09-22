import WebKit

// Runs in a separate JavaScript world; lesson scripts cannot invoke the native editor.
enum LessonTextEditing {
    @MainActor static let world = WKContentWorld.world(name: "LessonTextEditing")
    static let script = #"""
    (() => {
      let edits = {}, editing = false, root = '', currentEdit = null;
      const known = new WeakMap();
      const excluded = 'script,style,noscript,textarea,input,select,code,pre,[contenteditable]';
      const style = document.createElement('style');
      style.textContent = `html[data-wording-edit] body { cursor: text; }
        html[data-wording-edit] :is(h1,h2,h3,p,span,button,a,summary,svg text):hover {
          outline: 1px dashed #a89bff; outline-offset: 3px;
        }`;
      document.head.append(style);
      function eligible(node) {
        return node.nodeType === 3 && node.nodeValue.trim() && node.parentElement &&
          !node.parentElement.closest(excluded);
      }
      function identity(node, original) {
        const parts = [];
        let el = node.parentElement;
        while (el && el !== document.body) {
          if (el.id) { parts.unshift('#' + el.id); break; }
          parts.unshift(el.tagName + ':' + Array.from(el.parentNode.children).indexOf(el));
          el = el.parentElement;
        }
        return JSON.stringify([decodeURI(location.pathname).slice(root.length), parts.join('/'),
          Array.from(node.parentNode.childNodes).indexOf(node), original]);
      }
      function record(node) {
        let item = known.get(node);
        if (!item || (node.nodeValue !== item.original && node.nodeValue !== item.rendered)) {
          item = { original: node.nodeValue, field: identity(node, node.nodeValue), rendered: node.nodeValue };
          known.set(node, item);
        }
        return item;
      }
      function apply(node) {
        if (!eligible(node)) return;
        const item = record(node);
        const value = Object.hasOwn(edits, item.field) ? edits[item.field] : item.original;
        item.rendered = value;
        if (node.nodeValue !== value) node.nodeValue = value;
      }
      function scan(start) {
        if (start.nodeType === 3) { apply(start); return; }
        const walker = document.createTreeWalker(start, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) apply(walker.currentNode);
      }
      const observer = new MutationObserver(changes => {
        observer.disconnect();
        for (const change of changes) {
          if (change.type === 'characterData') apply(change.target);
          else for (const node of change.addedNodes) scan(node);
        }
        observe();
      });
      function observe() { observer.observe(document.body, {subtree:true, childList:true, characterData:true}); }
      function finish(save = true) {
        if (!currentEdit) return;
        const { node, item, editor, svg, visibility } = currentEdit;
        currentEdit = null;
        const value = svg ? editor.value : editor.textContent;
        observer.disconnect();
        if (svg) { node.parentElement.style.visibility = visibility; editor.remove(); }
        else editor.replaceWith(node);
        if (save && value.trim() && value !== node.nodeValue) {
          edits[item.field] = value;
          item.rendered = value;
          node.nodeValue = value;
          window.webkit.messageHandlers.editLessonText.postMessage({
            field: item.field, original: item.original, current: value
          });
        }
        observe();
      }
      function begin(node) {
        const item = record(node);
        const svg = node.parentElement.namespaceURI === 'http://www.w3.org/2000/svg';
        const editor = document.createElement(svg ? 'textarea' : 'span');
        editor.setAttribute('data-wording-input', '');
        editor.setAttribute('aria-label', 'Edit wording');
        editor.title = 'Click away to save · Escape to cancel · Option+Backspace to restore original';
        observer.disconnect();
        const visibility = node.parentElement.style.visibility;
        if (svg) {
          const range = document.createRange(); range.selectNodeContents(node);
          const rect = range.getBoundingClientRect(), font = getComputedStyle(node.parentElement);
          editor.value = node.nodeValue;
          editor.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;
            width:${Math.max(rect.width + 20, 60)}px;height:${Math.max(rect.height + 8,32)}px;
            margin:0;padding:0;border:0;border-radius:0;resize:none;z-index:2147483647;
            background:#101114;color:${font.fill};font:${font.font};outline:1px solid #a89bff;`;
          node.parentElement.style.visibility = 'hidden';
          document.body.append(editor);
        } else {
          editor.contentEditable = 'plaintext-only';
          editor.textContent = node.nodeValue;
          editor.style.cssText = 'outline:1px solid #a89bff;outline-offset:3px;cursor:text;white-space:pre-wrap;';
          node.replaceWith(editor);
        }
        currentEdit = { node, item, editor, svg, visibility };
        editor.addEventListener('blur', () => finish());
        editor.addEventListener('keydown', e => {
          e.stopPropagation();
          if (e.key === 'Escape') { e.preventDefault(); finish(false); }
          else if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); finish(); }
          else if (e.altKey && e.key === 'Backspace') {
            e.preventDefault();
            if (svg) editor.value = item.original; else editor.textContent = item.original;
            finish();
          }
        });
        editor.focus();
        if (svg) editor.select();
        else {
          const selection = window.getSelection(), range = document.createRange();
          range.selectNodeContents(editor); selection.removeAllRanges(); selection.addRange(range);
        }
        observe();
      }
      window.lessonTextEditor = { configure(next, active, directory) {
        if (!active) finish();
        observer.disconnect();
        // Preserve a just-finished edit until its asynchronous native save completes.
        edits = {...next, ...(currentEdit || editing && !active ? edits : {})};
        editing = active; root = directory;
        document.documentElement.toggleAttribute('data-wording-edit', editing);
        scan(document.body); observe();
      }};
      document.addEventListener('click', event => {
        if (!editing || event.target.closest('[data-wording-input]')) return;
        finish();
        // In editing mode, text on a button is editable without triggering its action.
        event.preventDefault(); event.stopImmediatePropagation();
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          if (!eligible(node)) continue;
          const range = document.createRange(); range.selectNodeContents(node);
          if (!Array.from(range.getClientRects()).some(r => event.clientX >= r.left &&
              event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom)) continue;
          begin(node);
          break;
        }
      }, true);
    })();
    """#
}
