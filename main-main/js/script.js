const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    if (themeToggle.querySelector('span')) {
        themeToggle.querySelector('span').textContent = 'Светлая';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            if (themeToggle.querySelector('span')) {
                themeToggle.querySelector('span').textContent = 'Светлая';
            }
        } else {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            if (themeToggle.querySelector('span')) {
                themeToggle.querySelector('span').textContent = 'Тёмная';
            }
        }
    });
}

// Навигация между страницами
function showMainPage() {
    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('specialtyPages').style.display = 'none';
    document.getElementById('backBtn').style.display = 'none';
    window.scrollTo(0, 0);
}

function showSpecialty(specialtyId) {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('specialtyPages').style.display = 'block';
    document.getElementById('backBtn').style.display = 'flex';
    
    // Загружаем контент специальности
    loadSpecialtyContent(specialtyId);
    window.scrollTo(0, 0);
}

function loadSpecialtyContent(specialtyId) {
    const specialtyPages = document.getElementById('specialtyPages');
    
    // Очищаем контейнер
    specialtyPages.innerHTML = '';
    
    // Загружаем контент в зависимости от выбранной специальности
    switch(specialtyId) {
        case 'programming':
            specialtyPages.innerHTML = getProgrammingContent();
            break;
        case 'network':
            specialtyPages.innerHTML = getNetworkContent();
            break;
        case 'electronics':
            specialtyPages.innerHTML = getElectronicsContent();
            break;
        case 'electrical':
            specialtyPages.innerHTML = getElectricalContent();
            break;
        case 'mechanical':
            specialtyPages.innerHTML = getMechanicalContent();
            break;
        case 'transport':
            specialtyPages.innerHTML = getTransportContent();
            break;
        case 'economics':
            specialtyPages.innerHTML = getEconomicsContent();
            break;
        case 'trade':
            specialtyPages.innerHTML = getTradeContent();
            break;
        case 'design':
            specialtyPages.innerHTML = getDesignContent();
            break;
        default:
            specialtyPages.innerHTML = '<div class="container"><div class="section"><h2>Специальность не найдена</h2></div></div>';
    }
    
    // Инициализируем мини-игры если они есть
    initMiniGames();
}

// Функция для плавной прокрутки
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Инициализация мини-игр
function initMiniGames() {
    // Инициализация мини-игры для программирования
    const codeInput = document.getElementById('codeInput');
    const checkCodeBtn = document.getElementById('checkCodeBtn');
    
    if (codeInput && checkCodeBtn) {
        initProgrammingGame();
    }
    
    // Инициализация мини-игры для торгового дела
    const checkScenarioBtn = document.getElementById('checkScenarioBtn');
    if (checkScenarioBtn) {
        initTradeGame();
    }
}

// Анимация появления элементов при скролле
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.info-card, .teacher-card, .achievement-card, .semester, .specialty-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);

setTimeout(animateOnScroll, 100);

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    const tabs = document.querySelectorAll(`#${modalId} .modal-tab`);
        const tabContents = document.querySelectorAll(`#${modalId} .modal-tab-content`);
    if (tabs.length > 0) {
        tabs[0].classList.add('active');
        tabContents[0].classList.add('active');
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function openTab(evt, tabId) {
    const tabcontent = document.querySelectorAll('.modal-tab-content');
    tabcontent.forEach(tab => {
        tab.classList.remove('active');
    });

    const tablinks = document.querySelectorAll('.modal-tab');
    tablinks.forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    evt.currentTarget.classList.add('active');
}

window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = 'none';
        }
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.getElementsByClassName('modal');
        for (let i = 0; i < modals.length; i++) {
            modals[i].style.display = 'none';
        }
    }
});

// Добавьте в конец script.js

// Обработчик изменения ориентации и размера экрана
function handleViewportChanges() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Оптимизация для мобильных устройств
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-view');
    } else {
        document.body.classList.remove('mobile-view');
    }
}

// Инициализация при загрузке и изменении размера
window.addEventListener('load', handleViewportChanges);
window.addEventListener('resize', handleViewportChanges);
window.addEventListener('orientationchange', handleViewportChanges);

// Поддержка touch событий
document.addEventListener('touchstart', function() {}, {passive: true});

// Предотвращение масштабирования на быстрый дабл-тап
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Добавьте этот код в конец файла script.js

// Улучшения для мобильных устройств
function initMobileImprovements() {
    // Улучшение для сенсорных устройств
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Улучшение задержки для :active состояний
        document.addEventListener('touchstart', function() {}, {passive: true});
    }
    
    // Предотвращение масштабирования при двойном тапе
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Улучшение производительности скролла на iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.style.webkitOverflowScrolling = 'touch';
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initMobileImprovements();
    
    // Улучшение для медленных соединений
    if ('connection' in navigator) {
        if (navigator.connection.saveData) {
            // Отключение анимаций для режима экономии данных
            document.body.classList.add('save-data');
        }
        
        if (navigator.connection.effectiveType.includes('2g')) {
            // Упрощение интерфейса для медленных сетей
            document.body.classList.add('slow-connection');
        }
    }
});

// Улучшение для модальных окон на мобильных
function enhanceModalForMobile(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Закрытие по свайпу вниз (только для мобильных)
    let startY = 0;
    modal.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    }, {passive: true});
    
    modal.addEventListener('touchmove', function(e) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        
        if (diff > 100) { // Свайп вниз более 100px
            closeModal(modalId);
        }
    }, {passive: true});
}