document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const toggleBtn = document.getElementById('toggleMenu');
  const key = 'menuOpen';

  // Restaurar estado
  const saved = localStorage.getItem(key);
  if (saved === 'true') menu.classList.add('open');
  else menu.classList.remove('open');

  // Alternar visibilidad
  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('open');
    const isOpen = menu.classList.contains('open');
    localStorage.setItem(key, isOpen);
  });
});