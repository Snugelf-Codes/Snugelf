const moonIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
`;

const sunIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
`;

function applyTheme(isDark) {
    const html = document.documentElement;
    const container = document.getElementById('theme-icon-container');

    if (isDark) {
        html.classList.add('dark');
        if (container) container.innerHTML = sunIcon;
    } else {
        html.classList.remove('dark');
        if (container) container.innerHTML = moonIcon;
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Initialize theme
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

// Default to dark mode if never set, as requested by my interpretation of "exactly like photos" (which are dark-themed)
if (!savedTheme) isDark = true;

applyTheme(isDark);

window.addEventListener('DOMContentLoaded', () => {
    applyTheme(isDark); // Re-apply to ensure icon is correct after DOM loads

    const toggleBtn = document.getElementById('dark-mode-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            isDark = !document.documentElement.classList.contains('dark');
            applyTheme(isDark);
        });
    }
});
