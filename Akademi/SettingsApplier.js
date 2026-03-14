const defaultSettings = {
    menuColor: '#4D44B5',
    mainBg: '#e8eafc',
    cardText: '#2d3184',
    navText: '#c5c6f3',
    isDarkTheme: false,
    fontSize: 'medium',
    fontFamily: 'Poppins, sans-serif'
};

function loadSettings() {
    const savedSettings = localStorage.getItem('akademiSettings');
    return savedSettings ? JSON.parse(savedSettings) : { ...defaultSettings };
}

function saveSettings(settings) {
    localStorage.setItem('akademiSettings', JSON.stringify(settings));
}

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

function applySettingsToPage(settings) {
    const nav = document.querySelector('.settings-nav');
    const mainContent = document.getElementById('mainContent') || document.querySelector('.content') || document.querySelector('main') || document.querySelector('.main-container') || document.querySelector('.container');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const mainContainer = document.querySelector('.main-container');
    const container = document.querySelector('.container');
    
    if (nav) {
        nav.style.backgroundColor = settings.menuColor;
        nav.style.color = settings.navText || 'white';
    }
    
    if (sidebar) {
        sidebar.style.backgroundColor = settings.menuColor;
    }
    
    if (mainContent) {
        mainContent.style.background = settings.mainBg;
    }
    
    if (content) {
        content.style.background = settings.mainBg;
    }
    
    if (mainContainer) {
        mainContainer.style.background = settings.mainBg;
    }
    
    if (container) {
        container.style.background = settings.mainBg;
    }
    
    document.body.style.setProperty('--toggle-color', settings.menuColor);
    
    const activeNavLink = sidebar ? sidebar.querySelector('.nav-link.active') : (nav ? nav.querySelector('ul li:first-child') : null);
    if (activeNavLink) {
        activeNavLink.style.color = settings.menuColor;
        activeNavLink.style.background = 'white';
        const activeSvg = activeNavLink.querySelector('svg path');
        if (activeSvg) {
            activeSvg.style.fill = settings.menuColor;
        }
    }
    
    document.body.style.fontFamily = settings.fontFamily;
    
    applyFontSizeToElements(settings.fontSize);
    
    if (settings.isDarkTheme) {
        applyDarkThemeToPage();
    }
}

function applyDarkThemeToPage() {
    const mainContent = document.getElementById('mainContent') || document.querySelector('.content') || document.querySelector('main') || document.querySelector('.main-container') || document.querySelector('.container');
    const cards = document.querySelectorAll('.settings-card, .table-wrapper, .content-bottom-controls, .table-container, .container > *');
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

function removeDarkThemeFromPage() {
    const settings = loadSettings();
    const mainContent = document.getElementById('mainContent') || document.querySelector('.content') || document.querySelector('main') || document.querySelector('.main-container') || document.querySelector('.container');
    const cards = document.querySelectorAll('.settings-card, .table-wrapper, .content-bottom-controls, .table-container, .container > *');
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

document.addEventListener('DOMContentLoaded', function() {
    const settings = loadSettings();
    applySettingsToPage(settings);
});

