const numberInput = document.getElementById('bid-input');

numberInput.addEventListener('input', function(e) {
  // Remove any non-digit characters
  this.value = this.value.replace(/[^0-9]/g, '');
});

// Optional: Prevent paste of non-numeric content
numberInput.addEventListener('paste', function(e) {
  const pasteData = e.clipboardData.getData('text');
  if (!/^\d+$/.test(pasteData)) {
    e.preventDefault();
  }
});