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

function applySettings(settings) {
    const nav = document.querySelector('.settings-nav');
    const mainContent = document.getElementById('mainContent');
    const cards = document.querySelectorAll('#mainContent > section > div');
    const firstLi = nav ? nav.querySelector('ul li:first-child') : null;
    const resetBtn = document.querySelector('.reset-btn');
    const selects = document.querySelectorAll('.settings-select');
    const darkToggle = document.getElementById('darkThemeToggle');
    const fontSizeSelect = document.getElementById('fontSize');
    const fontFamilySelect = document.getElementById('fontFamily');
    
    if (nav) {
        nav.style.backgroundColor = settings.menuColor;
        nav.style.color = settings.navText;
    }
    
    if (mainContent) {
        mainContent.style.background = settings.mainBg;
    }
    
    document.body.style.setProperty('--toggle-color', settings.menuColor);
    
    if (firstLi) {
        firstLi.style.color = settings.menuColor;
        firstLi.style.background = 'white';
    }
    
    if (resetBtn) {
        resetBtn.style.backgroundColor = settings.menuColor;
    }
    
    cards.forEach(card => {
        const textElements = card.querySelectorAll('div, span, label, strong');
        textElements.forEach(el => {
            if (!settings.isDarkTheme) {
                el.style.color = settings.cardText;
            }
        });
    });
    
    selects.forEach(select => {
        select.style.borderColor = settings.menuColor;
        select.style.color = settings.cardText;
    });
    
    if (darkToggle) {
        darkToggle.checked = settings.isDarkTheme;
    }
    
    if (settings.isDarkTheme) {
        enableDarkTheme();
    }
    
    if (fontSizeSelect) {
        fontSizeSelect.value = settings.fontSize;
    }
    
    if (fontFamilySelect) {
        fontFamilySelect.value = settings.fontFamily;
    }
    
    document.body.style.fontFamily = settings.fontFamily;
    
    applyFontSize(settings.fontSize);
    
    updateThemeRings(settings.menuColor);
}

function enableDarkTheme() {
    const mainContent = document.getElementById('mainContent');
    const cards = document.querySelectorAll('#mainContent > section > div');
    const h3 = mainContent ? mainContent.querySelector('h3') : null;
    
    if (mainContent) {
        mainContent.style.backgroundColor = '#121212';
        mainContent.style.color = '#e8eaed';
    }
    
    if (h3) {
        h3.style.color = '#e8eaed';
    }
    
    cards.forEach(card => {
        card.style.backgroundColor = '#1e1e1e';
        card.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.3)';
        
        const textElements = card.querySelectorAll('div, span, label, strong');
        textElements.forEach(el => {
            el.style.color = '#e8eaed';
        });
    });
}

function disableDarkTheme() {
    const settings = loadSettings();
    const mainContent = document.getElementById('mainContent');
    const cards = document.querySelectorAll('#mainContent > section > div');
    const h3 = mainContent ? mainContent.querySelector('h3') : null;
    
    if (mainContent) {
        mainContent.style.background = settings.mainBg;
        mainContent.style.color = settings.cardText;
    }
    
    if (h3) {
        h3.style.color = settings.cardText;
    }
    
    cards.forEach(card => {
        card.style.backgroundColor = 'white';
        card.style.boxShadow = '0 3px 6px rgba(221, 226, 243, 0.5)';
        
        const textElements = card.querySelectorAll('div, span, label, strong');
        textElements.forEach(el => {
            el.style.color = settings.cardText;
        });
    });
}

function applyFontSize(size) {
    const allElements = document.querySelectorAll('body *');
    
    allElements.forEach(el => {
        if (size === 'large') {
            el.style.fontSize = 'calc(1em + 2px)';
        } else if (size === 'medium') {
            el.style.fontSize = '';
        }
    });
}

function updateThemeRings(menuColor) {
    document.querySelectorAll('.theme-btn-ring').forEach(ring => {
        ring.classList.remove('active');
        ring.style.borderColor = 'transparent';
    });
    
    if (menuColor === '#4D44B5') {
        const ring = document.getElementById('theme-purple-ring');
        if (ring) {
            ring.classList.add('active');
            ring.style.borderColor = '#4D44B5';
        }
    } else if (menuColor === '#FB7D5B') {
        const ring = document.getElementById('theme-orange-ring');
        if (ring) {
            ring.classList.add('active');
            ring.style.borderColor = '#FB7D5B';
        }
    } else if (menuColor === '#FCC43E') {
        const ring = document.getElementById('theme-yellow-ring');
        if (ring) {
            ring.classList.add('active');
            ring.style.borderColor = '#FCC43E';
        }
    }
}

function toggleDarkTheme(checkbox) {
    const settings = loadSettings();
    settings.isDarkTheme = checkbox.checked;
    saveSettings(settings);
    
    if (checkbox.checked) {
        enableDarkTheme();
    } else {
        disableDarkTheme();
    }
}

function changeFontSize(select) {
    const settings = loadSettings();
    settings.fontSize = select.value;
    saveSettings(settings);
    
    if (select.value === 'large') {
        document.body.style.fontSize = 'calc(1em + 2px)';
    } else {
        document.body.style.fontSize = '';
    }
    
    applyFontSize(select.value);
}

function changeFontFamily(select) {
    const settings = loadSettings();
    settings.fontFamily = select.value;
    saveSettings(settings);
    
    document.body.style.fontFamily = select.value;
}

function changeTheme(menuColor, mainBg, cardText, navText = 'white') {
    const settings = loadSettings();
    
    document.querySelectorAll('.theme-btn-ring').forEach(ring => {
        ring.classList.remove('active');
        ring.style.borderColor = 'transparent';
    });
    
    settings.menuColor = menuColor;
    settings.mainBg = mainBg;
    settings.cardText = cardText;
    settings.navText = navText;
    
    saveSettings(settings);
    
    const nav = document.querySelector('.settings-nav');
    const mainContent = document.getElementById('mainContent');
    const cards = document.querySelectorAll('#mainContent > section > div');
    const firstLi = nav ? nav.querySelector('ul li:first-child') : null;
    const resetBtn = document.querySelector('.reset-btn');
    const selects = document.querySelectorAll('.settings-select');
    
    nav.style.backgroundColor = menuColor;
    nav.style.color = navText;
    mainContent.style.background = mainBg;
    document.body.style.setProperty('--toggle-color', menuColor);
    
    if (firstLi) {
        firstLi.style.color = menuColor;
        firstLi.style.background = 'white';
    }
    
    if (resetBtn) {
        resetBtn.style.backgroundColor = menuColor;
    }
    
    selects.forEach(select => {
        select.style.borderColor = menuColor;
        select.style.color = cardText;
    });
    
    cards.forEach(card => {
        const textElements = card.querySelectorAll('div, span, label, strong');
        textElements.forEach(el => {
            if (el.style.color) {
                el.dataset.originalColor = el.style.color;
            }
            el.style.color = cardText;
        });
    });
    
    if (menuColor === '#4D44B5') {
        const ring = document.getElementById('theme-purple-ring');
        if (ring) {
            ring.classList.add('active');
            ring.style.borderColor = '#4D44B5';
        }
    } else if (menuColor === '#FB7D5B') {
        const ring = document.getElementById('theme-orange-ring');
        if (ring) {
            ring.classList.add('active');
            ring.style.borderColor = '#FB7D5B';
        }
    } else if (menuColor === '#FCC43E') {
        const ring = document.getElementById('theme-yellow-ring');
        if (ring) {
            ring.classList.add('active');
            ring.style.borderColor = '#FCC43E';
        }
    }
}

function resetTheme() {
    saveSettings({ ...defaultSettings });
    
    document.querySelectorAll('.theme-btn-ring').forEach(ring => {
        ring.classList.remove('active');
        ring.style.borderColor = 'transparent';
    });
    
    const nav = document.querySelector('.settings-nav');
    const mainContent = document.getElementById('mainContent');
    const cards = document.querySelectorAll('#mainContent > section > div');
    const firstLi = nav ? nav.querySelector('ul li:first-child') : null;
    const resetBtn = document.querySelector('.reset-btn');
    const selects = document.querySelectorAll('.settings-select');
    const darkToggle = document.getElementById('darkThemeToggle');
    const fontSizeSelect = document.getElementById('fontSize');
    const fontFamilySelect = document.getElementById('fontFamily');
    
    nav.style.backgroundColor = '#4D44B5';
    nav.style.color = '#c5c6f3';
    mainContent.style.background = defaultSettings.mainBg;
    document.body.style.setProperty('--toggle-color', '#4D44B5');
    
    if (firstLi) {
        firstLi.style.color = '#4D44B5';
        firstLi.style.background = 'white';
    }
    
    if (resetBtn) {
        resetBtn.style.backgroundColor = '#4D44B5';
    }
    
    if (darkToggle) {
        darkToggle.checked = false;
    }
    
    if (fontSizeSelect) {
        fontSizeSelect.value = 'medium';
    }
    
    if (fontFamilySelect) {
        fontFamilySelect.value = 'Poppins, sans-serif';
    }
    
    document.body.style.fontFamily = 'Poppins, sans-serif';
    
    selects.forEach(select => {
        select.style.borderColor = '#ddd';
        select.style.color = '#2d3184';
    });
    
    cards.forEach(card => {
        card.style.backgroundColor = 'white';
        card.style.boxShadow = '0 3px 6px rgba(221, 226, 243, 0.5)';
        
        const textElements = card.querySelectorAll('div, span, label, strong');
        textElements.forEach(el => {
            el.style.color = '#2d3184';
        });
    });
    
    const ring = document.getElementById('theme-purple-ring');
    if (ring) {
        ring.classList.add('active');
        ring.style.borderColor = '#4D44B5';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const settings = loadSettings();
    applySettings(settings);
});
