(function() {
  // Load Mermaid.js dynamically
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js';
  script.onload = function() {
    mermaid.initialize({ startOnLoad: false });
    // Wait for React to finish rendering
    setTimeout(function() {
      document.querySelectorAll('code.language-mermaid').forEach(function(el) {
        var pre = el.parentElement;
        var div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = el.textContent;
        pre.parentElement.replaceChild(div, pre);
      });
      mermaid.init(undefined, '.mermaid');
    }, 500);
  };
  document.head.appendChild(script);
})();
