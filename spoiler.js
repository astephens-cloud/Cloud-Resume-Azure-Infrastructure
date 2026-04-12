// Inline — toggle on/off
document.querySelectorAll('.spoiler').forEach(el => {
  el.addEventListener('click', () => el.classList.toggle('revealed'));
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      el.classList.toggle('revealed');
    }
  });
});
