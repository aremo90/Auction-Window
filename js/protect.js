(function() {
  // Disable context menu
  document.addEventListener('contextmenu', e => e.preventDefault());
  
  // Disable keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'u')) {
      e.preventDefault();
      alert('Developer tools are restricted on this site');
    }
  });
  
  // Detect dev tools opening
  let devToolsOpen = false;
  const devToolsCheck = setInterval(() => {
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    
    if ((widthDiff > 160 || heightDiff > 160) && !devToolsOpen) {
      devToolsOpen = true;
      alert('Please close developer tools to continue using this site');
      document.body.innerHTML = '<h1>Developer tools detected. Please refresh the page.</h1>';
      clearInterval(devToolsCheck);
    }
  }, 500);
})();