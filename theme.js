function updateDarkModeUI(isDark) {
    const html = document.documentElement;
    const toggleCircle = document.getElementById('toggle-circle');
    const toggleIcon = document.getElementById('toggle-icon');

    if (!toggleCircle || !toggleIcon) return;

    if (isDark) {
        html.classList.add('dark');
        toggleCircle.classList.remove('bg-black');
        toggleCircle.classList.add('bg-white');
        toggleIcon.classList.remove('text-white');
        toggleIcon.classList.add('text-yellow-400');
        toggleIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 7a5 5 0 100 10 5 5 0 000-10zM2 13h2a1 1 0 100-2H2a1 1 0 100 2zm18 0h2a1 1 0 100-2h-2a1 1 0 100 2zM11 2v2a1 1 0 100 2V2a1 1 0 100-2zm0 18v2a1 1 0 100 2v-2a1 1 0 100-2zM5.99 4.576a1 1 0 10-1.414 1.414l1.414 1.414a1 1 0 001.414-1.414L5.99 4.576zm12.02 12.02a1 1 0 10-1.414 1.414l1.414 1.414a1 1 0 001.414-1.414l-1.414-1.414zM18.01 4.576l1.414 1.414a1 1 0 101.414-1.414l-1.414-1.414a1 1 0 10-1.414 1.414zM5.99 16.596l-1.414 1.414a1 1 0 101.414 1.414l1.414-1.414a1 1 0 10-1.414-1.414z" />
            </svg>
        `;
    } else {
        html.classList.remove('dark');
        toggleCircle.classList.add('bg-black');
        toggleCircle.classList.remove('bg-white');
        toggleIcon.classList.add('text-white');
        toggleIcon.classList.remove('text-yellow-400');
        toggleIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
        `;
    }
}

// Apply theme immediately to prevent flash
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

window.addEventListener('DOMContentLoaded', () => {
    const isDark = document.documentElement.classList.contains('dark');
    updateDarkModeUI(isDark);

    const toggleBtn = document.getElementById('dark-mode-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const willBeDark = !document.documentElement.classList.contains('dark');
            localStorage.setItem('theme', willBeDark ? 'dark' : 'light');
            updateDarkModeUI(willBeDark);
        });
    }
});
