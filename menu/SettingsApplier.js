// Default settings
const defaultSettings = {
    menuColor: '#4D44B5',
    mainBg: '#e8eafc',
    cardText: '#2d3184',
    navText: '#c5c6f3',
    isDarkTheme: false,
    fontSize: 'medium',
    fontFamily: 'Poppins, sans-serif'
};

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('akademiSettings');
    return savedSettings ? JSON.parse(savedSettings) : { ...defaultSettings };
}

// Save settings to localStorage
function saveSettings(settings) {
    localStorage.setItem('akademiSettings', JSON.stringify(settings));
}

// Apply font size to all elements
function applyFontSizeToElements(size) {
    const allElements = document.querySelectorAll('body *');
    allElements.forEach(el => {
        if (size === 'large') {
            el.style.fontSize = 'calc(1em + 2px)';
        } else {
            el.style.fontSize = '';
        }
    });
}

// Apply settings to the current page
function applySettingsToPage(settings) {
    const nav = document.querySelector('.settings-nav');
    const mainContent = document.getElementById('mainContent') || document.querySelector('.content') || document.querySelector('main');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    
    // Apply theme colors to sidebar/nav
    if (nav) {
        nav.style.backgroundColor = settings.menuColor;
        nav.style.color = settings.navText || 'white';
    }
    
    if (sidebar) {
        sidebar.style.backgroundColor = settings.menuColor;
    }
    
    // Apply to main content
    if (mainContent) {
        mainContent.style.background = settings.mainBg;
    }
    
    if (content) {
        content.style.background = settings.mainBg;
    }
    
    document.body.style.setProperty('--toggle-color', settings.menuColor);
    
    // Apply to nav items
    const firstLi = nav ? nav.querySelector('ul li:first-child') : (sidebar ? sidebar.querySelector('.main-nav li:first-child') : null);
    if (firstLi) {
        firstLi.style.color = settings.menuColor;
        firstLi.style.background = 'white';
    }
    
    // Apply font family
    document.body.style.fontFamily = settings.fontFamily;
    
    // Apply font size to all elements
    applyFontSizeToElements(settings.fontSize);
    
    // Apply dark theme if enabled
    if (settings.isDarkTheme) {
        applyDarkThemeToPage();
    }
}

// Apply dark theme to current page
function applyDarkThemeToPage() {
    const mainContent = document.getElementById('mainContent') || document.querySelector('.content') || document.querySelector('main');
    const cards = document.querySelectorAll('.settings-card, .table-wrapper, .content-bottom-controls');
    const h3 = document.querySelector('h3');
    const h1 = document.querySelector('h1');
    
    if (mainContent) {
        mainContent.style.backgroundColor = '#121212';
        mainContent.style.color = '#e8eaed';
    }
    
    if (h3) {
        h3.style.color = '#e8eaed';
    }
    
    if (h1) {
        h1.style.color = '#e8eaed';
    }
    
    cards.forEach(card => {
        card.style.backgroundColor = '#1e1e1e';
        card.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.3)';
        
        const textElements = card.querySelectorAll('div, span, label, strong, p');
        textElements.forEach(el => {
            el.style.color = '#e8eaed';
        });
    });
}

// Remove dark theme from current page
function removeDarkThemeFromPage() {
    const settings = loadSettings();
    const mainContent = document.getElementById('mainContent') || document.querySelector('.content') || document.querySelector('main');
    const cards = document.querySelectorAll('.settings-card, .table-wrapper, .content-bottom-controls');
    const h3 = document.querySelector('h3');
    const h1 = document.querySelector('h1');
    
    if (mainContent) {
        mainContent.style.background = settings.mainBg;
        mainContent.style.color = '';
    }
    
    if (h3) {
        h3.style.color = settings.cardText;
    }
    
    if (h1) {
        h1.style.color = '#2c2c54';
    }
    
    cards.forEach(card => {
        card.style.backgroundColor = 'white';
        card.style.boxShadow = '';
        
        const textElements = card.querySelectorAll('div, span, label, strong, p');
        textElements.forEach(el => {
            el.style.color = '';
        });
    });
}

// Initialize settings on page load
document.addEventListener('DOMContentLoaded', function() {
    const settings = loadSettings();
    applySettingsToPage(settings);
});

