const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// Функция для получения текущего времени в формате HH:MM
function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0');
}

// Функция показа индикатора набора сообщения
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="message-sender">Помощник СТМиИТ</div>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Функция скрытия индикатора набора
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function getBotResponse(userMessage) {
    const url = "https://api.intelligence.io.solutions/api/v1/chat/completions";
    
    const payload = {
        "model": "openai/gpt-oss-120b",
        "messages": [
            {
                "role": "system",
                "content": "Ты карьерный консультант. Твоя задача - помогать людям выбирать профессии. Отвечай на русском языке. Доступные профессии: Оператор станков ЧПУ, Станочник широкого профиля, Токарь, Фрезеровщик, Шлифовщик, Энергетик, Инженер-технолог, оператор лазерной резки. Сразу предлагай подходящую профессию без лишних вопросов. Если информации недостаточно - задай 1-2 ключевых вопроса и сразу дай рекомендацию. Отвечай кратко."
            },
            {
                "role": "user",
                "content": `${userMessage}`
            }
        ]
    };

    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer io-v2-eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6ImEyNDljNWEzLTE0YzQtNDQ3Zi1iYzYwLTFmZmZmOGM5NmZjYiIsImV4cCI6NDkxNjQ3NjQyOX0.VDcd3EitR4rOV3bfC9spB9MXl-qjXeF79DzVSfRvdfnvkZU0HiM3v46rAoeKXkhQCbtvgtzf6CwRA_OfQQy3YA',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Ошибка API:', error);
        throw error;
    }
}

async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message) {
        // Добавляем сообщение пользователя
        addMessage(message, 'user');
        messageInput.value = '';
        
        // Показываем индикатор загрузки
        showTypingIndicator();
        
        // Блокируем кнопку отправки
        sendBtn.disabled = true;
        
        if (message.length < 2) {
            hideTypingIndicator();
            addMessage('Пожалуйста, напишите сообщение длиннее', 'bot');
            sendBtn.disabled = false;
        } else if (message.length > 500) {
            hideTypingIndicator();
            addMessage('Сообщение слишком длинное. Пожалуйста, сократите его до 500 символов.', 'bot');
            sendBtn.disabled = false;
        } else {
            try {
                // Получаем ответ от бота через API
                const botResponse = await getBotResponse(message);
                hideTypingIndicator();
                // Добавляем ответ бота в чат
                addMessage(botResponse, 'bot');
            } catch (error) {
                hideTypingIndicator();
                // Добавляем сообщение об ошибке
                addMessage('Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.', 'bot');
                console.error('Ошибка:', error);
            } finally {
                sendBtn.disabled = false;
            }
        }
    }
}

// Функция добавления сообщения в чат
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatarIcon = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
    const senderName = sender === 'user' ? 'Вы' : 'Помощник СТМиИТ';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="${avatarIcon}"></i>
        </div>
        <div class="message-content">
            <div class="message-sender">${senderName}</div>
            <div class="message-text">${text}</div>
            <div class="message-time">${getCurrentTime()}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Обработчики событий
sendBtn.addEventListener('click', sendMessage);
        
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Автофокус на поле ввода
messageInput.focus();

// Функция для кнопки "Назад"
function goBack(){
    window.location.href = "professions.html";
}

// Обработка изменения размера окна
window.addEventListener('resize', function() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
});