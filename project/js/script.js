// Переключение темы
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

// Проверяем сохраненную тему
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    
    if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeToggle.querySelector('span').textContent = 'Светлая';
    } else {
        localStorage.setItem('theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeToggle.querySelector('span').textContent = 'Тёмная';
    }
});

// Функция для кнопки "Назад"
function goBack() {
    window.history.back();
}

// Функция для плавной прокрутки
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Логика мини-игры
document.addEventListener('DOMContentLoaded', function() {
    const codeInput = document.getElementById('codeInput');
    const checkCodeBtn = document.getElementById('checkCodeBtn');
    const hintBtn = document.getElementById('hintBtn');
    const resetGameBtn = document.getElementById('resetGameBtn');
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    const runCodeBtn = document.getElementById('runCode');
    const message = document.getElementById('gameMessage');
    const output = document.getElementById('output');
    const currentLevel = document.getElementById('currentLevel');
    const scoreElement = document.getElementById('score');
    
    let currentGameLevel = 1;
    let score = 0;
    let gameCompleted = false;
    let levels = [
        {
            initialCode: `function calculateSum(a, b) {
  return a + b
}

let result = calculateSum(5, 10);
console.log("Результат: " + result);`,
            correctCode: `function calculateSum(a, b) {
  return a + b;
}

let result = calculateSum(5, 10);
console.log("Результат: " + result);`,
            hint: 'Ошибка находится в строке 2. Не хватает точки с запятой в конце строки.',
            check: function(userCode) {
                // Проверяем наличие точки с запятой в нужных местах
                const lines = userCode.split('\n');
                let hasSemicolon = false;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line.startsWith('return a + b')) {
                        hasSemicolon = line.endsWith(';');
                        break;
                    }
                }
                
                return hasSemicolon;
            },
            expectedOutput: 'Результат: 15'
        },
        {
            initialCode: `function factorial(n) {
  if (n === 0) {
    return 1
  } else {
    return n * factorial(n - 1)
  }
}

console.log("Факториал 5: " + factorial(5));`,
            correctCode: `function factorial(n) {
  if (n === 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

console.log("Факториал 5: " + factorial(5));`,
            hint: 'В строках 3 и 6 не хватает точек с запятой.',
            check: function(userCode) {
                // Проверяем наличие точек с запятой в нужных местах
                const lines = userCode.split('\n');
                let line3Correct = false;
                let line6Correct = false;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    
                    if (line === 'return 1;') {
                        line3Correct = true;
                    }
                    
                    if (line === 'return n * factorial(n - 1);') {
                        line6Correct = true;
                    }
                }
                
                return line3Correct && line6Correct;
            },
            expectedOutput: 'Факториал 5: 120'
        },
        {
            initialCode: `class Rectangle {
  constructor(width, height) {
    this.width = width
    this.height = height
  }

  getArea() {
    return this.width * this.height
  }
}

const rect = new Rectangle(10, 5);
console.log("Площадь: " + rect.getArea());`,
            correctCode: `class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

const rect = new Rectangle(10, 5);
console.log("Площадь: " + rect.getArea());`,
            hint: 'В строках 3, 4 и 8 не хватает точек с запятой.',
            check: function(userCode) {
                // Проверяем наличие точек с запятой в нужных местах
                const lines = userCode.split('\n');
                let line3Correct = false;
                let line4Correct = false;
                let line8Correct = false;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    
                    if (line === 'this.width = width;') {
                        line3Correct = true;
                    }
                    
                    if (line === 'this.height = height;') {
                        line4Correct = true;
                    }
                    
                    if (line === 'return this.width * this.height;') {
                        line8Correct = true;
                    }
                }
                
                return line3Correct && line4Correct && line8Correct;
            },
            expectedOutput: 'Площадь: 50'
        }
    ];
    
    // Инициализация игры
    function initGame() {
        loadLevel(currentGameLevel);
        message.textContent = '';
        output.textContent = '';
        nextLevelBtn.style.display = 'none';
        updateScore();
        gameCompleted = false;
    }
    
    function loadLevel(levelIndex) {
        const level = levels[levelIndex - 1];
        currentLevel.textContent = levelIndex;
        codeInput.value = level.initialCode;
    }
    
    function checkCode() {
        const level = levels[currentGameLevel - 1];
        const userCode = codeInput.value;
        const isCorrect = level.check(userCode);
        
        if (isCorrect) {
            score += 10 * currentGameLevel;
            updateScore();
            
            if (currentGameLevel < levels.length) {
                message.innerHTML = '<i class="fas fa-check-circle"></i> Поздравляем! Код исправлен правильно!';
                message.style.color = '#10b981';
                message.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                message.style.borderColor = '#10b981';
                nextLevelBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Следующий уровень';
                nextLevelBtn.style.display = 'flex';
            } else {
                gameCompleted = true;
                message.innerHTML = `<i class="fas fa-trophy"></i> Поздравляем! Вы прошли все уровни!<br>Ваш итоговый счет: <strong>${score}</strong> баллов`;
                message.style.color = '#f59e0b';
                message.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
                message.style.borderColor = '#f59e0b';
                nextLevelBtn.innerHTML = '<i class="fas fa-redo"></i> Начать заново';
                nextLevelBtn.style.display = 'flex';
            }
        } else {
            message.innerHTML = '<i class="fas fa-exclamation-circle"></i> В коде остались ошибки. Попробуйте еще раз!';
            message.style.color = '#ef4444';
            message.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            message.style.borderColor = '#ef4444';
        }
    }
    
    function showHint() {
        const level = levels[currentGameLevel - 1];
        alert(level.hint);
        
        // Штраф за использование подсказки
        if (score > 0) {
            score -= 5;
            updateScore();
        }
    }
    
    function resetGame() {
        const level = levels[currentGameLevel - 1];
        codeInput.value = level.initialCode;
        message.textContent = '';
        output.textContent = '';
    }
    
    function resetFullGame() {
        currentGameLevel = 1;
        score = 0;
        initGame();
    }
    
    function nextLevel() {
        if (gameCompleted) {
            resetFullGame();
            return;
        }
        
        if (currentGameLevel < levels.length) {
            currentGameLevel++;
            initGame();
        }
    }
    
    function runCode() {
        const level = levels[currentGameLevel - 1];
        const userCode = codeInput.value;
        const isCorrect = level.check(userCode);
        
        if (isCorrect) {
            output.textContent = level.expectedOutput;
            output.style.color = '#10b981';
        } else {
            output.textContent = 'Ошибка: Код содержит ошибки. Исправьте их перед запуском.';
            output.style.color = '#ef4444';
        }
    }
    
    function updateScore() {
        scoreElement.textContent = score;
    }
    
    // Назначаем обработчики событий
    checkCodeBtn.addEventListener('click', checkCode);
    hintBtn.addEventListener('click', showHint);
    resetGameBtn.addEventListener('click', resetGame);
    nextLevelBtn.addEventListener('click', nextLevel);
    runCodeBtn.addEventListener('click', runCode);
    
    // Инициализируем игру при загрузке страницы
    initGame();
});