// Support Modal Logic

document.addEventListener('DOMContentLoaded', () => {
  const supportBtns = document.querySelectorAll('.support-btn-trigger');

  // If the modal isn't loaded yet on the page, do not proceed
  const supportModal = document.getElementById('supportModalOverlay');
  if (!supportModal) return;

  const closeBtn = document.getElementById('closeSupportModal');

  // Show modal
  supportBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      supportModal.classList.add('active');
    });
  });

  // Hide modal
  const hideModal = () => {
    supportModal.classList.remove('active');
  };

  closeBtn.addEventListener('click', hideModal);
  supportModal.addEventListener('click', (e) => {
    if (e.target === supportModal) hideModal();
  });
});
