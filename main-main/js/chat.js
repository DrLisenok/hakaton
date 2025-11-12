const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');







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

    const response = await fetch(url, options);
    const data = await response.json();
    
    return data.choices[0].message.content;
}


async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message) {
        // Добавляем сообщение пользователя
        addMessage(message, 'user');
        messageInput.value = '';
        if(message.length < 2){
            addMessage('Слишком маленькая длинна сообщения', 'bot');
        }
        else if(message.length > 100){
            addMessage('Слишком большая длинна сообщения', 'bot');
        }
        else{
            try {
            // Получаем ответ от бота через API
            const botResponse = await getBotResponse(message);
            
            // Добавляем ответ бота в чат
            addMessage(botResponse, 'bot');
            } catch (error) {
            // Добавляем сообщение об ошибке
            addMessage('Извините, произошла ошибка. Попробуйте еще раз.', 'bot');
            console.error('Ошибка:', error);
            }
        }
        
    }
}

// Функция добавления сообщения в чат
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
            
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

// Фокус на поле ввода при загрузке
messageInput.focus();

function goBack(){
    window.location.href = "professions.html"
}