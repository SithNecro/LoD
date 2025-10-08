
        const menu = document.querySelector('.menu');
        const toggleBtn = document.getElementById('toggleMenu');

        toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('open');
        });
