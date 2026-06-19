const fs = require('fs');
const path = require('path');

const dir = __dirname;
const labs = ['lab.html', 'lab2.html', 'lab3.html', 'lab4.html', 'lab5.html'];

const navHTML = `
  <!-- Lab Navigation -->
  <div class="lab-nav" style="position: fixed; bottom: 2.5rem; left: 50%; transform: translateX(-50%); z-index: 10000; font-family: 'Space Mono', monospace; font-size: 0.7rem; display: flex; gap: 1.5rem; border: 1px solid var(--line); padding: 0.75rem 1.5rem; background: rgba(11,13,18,0.85); backdrop-filter: blur(12px); border-radius: 2px; white-space: nowrap;">
    <a href="lab.html" class="lab-link" data-lab="lab.html" style="color: var(--steel); text-decoration: none; transition: color 0.3s; text-transform: uppercase;">[01] The Lab</a>
    <a href="lab2.html" class="lab-link" data-lab="lab2.html" style="color: var(--steel); text-decoration: none; transition: color 0.3s; text-transform: uppercase;">[02] Playground</a>
    <a href="lab3.html" class="lab-link" data-lab="lab3.html" style="color: var(--steel); text-decoration: none; transition: color 0.3s; text-transform: uppercase;">[03] Game Engine</a>
    <a href="lab4.html" class="lab-link" data-lab="lab4.html" style="color: var(--steel); text-decoration: none; transition: color 0.3s; text-transform: uppercase;">[04] Cosmic Scale</a>
    <a href="lab5.html" class="lab-link" data-lab="lab5.html" style="color: var(--steel); text-decoration: none; transition: color 0.3s; text-transform: uppercase;">[05] Audio Vis</a>
  </div>
  <style>
    .lab-link:hover { color: var(--paper) !important; text-shadow: 0 0 10px rgba(243, 241, 236, 0.5); }
    .lab-link.active { color: var(--ember) !important; text-shadow: 0 0 10px rgba(255, 107, 61, 0.5); }
    @media (max-width: 768px) {
      .lab-nav { width: 90%; flex-wrap: wrap; justify-content: center; gap: 0.5rem; padding: 0.75rem; bottom: 1rem; }
      .lab-link { font-size: 0.6rem; }
    }
  </style>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const currentPath = window.location.pathname.split('/').pop() || 'lab.html';
      const links = document.querySelectorAll('.lab-link');
      links.forEach(link => {
        if(link.getAttribute('data-lab') === currentPath) {
          link.classList.add('active');
        }
      });
    });
  </script>
`;

labs.forEach(file => {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('class="lab-nav"')) {
      content = content.replace('</body>', navHTML + '\n</body>');
      fs.writeFileSync(filePath, content);
      console.log('Added lab nav to ' + file);
    } else {
      console.log('Lab nav already in ' + file);
    }
  }
});
