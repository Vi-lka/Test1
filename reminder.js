//Подключаем модуль для работы с Telegram API и прописываем токен
var TelegramBot = require('node-telegram-bot-api');

var token = '1156060861:AAHkKqDLMiiA3fXtfMYd9qD8VRwcdXLWZNM';
// Включить опрос сервера. Бот должен обращаться к серверу Telegram, чтобы получать актуальную информацию
// Подробнее: https://core.telegram.org/bots/api#getupdates
var bot = new TelegramBot(token, { polling: true });
// Cоздаем переменную в которой будут храниться все заметки от пользователя
var notes = [];
// Добавляем команду /напомни, с помощью которой и будем добавлять напоминание.
bot.onText(/напомни (.+) в (.+)/, function (msg, match) {
    var userId = msg.from.id;// Получаем ID отправителя
    var text = match[1];// Хранит первый параметр - текст. Его бот и должен прислать
    var time = match[2];// Хранит второй параметр - время. Устанавливаем время когда прийдет уведомление.
    // Сохраняем все эти параметры в наш массив notes и бот отправляет сообщение, что запись успешно сохранилась.
    notes.push({ 'uid': userId, 'time': time, 'text': text });

    bot.sendMessage(userId, 'Отлично! Я обязательно напомню:)');
});
// Ставим таймер, он будет каждую секунду проверять записи, которые совпадают с конкретным временем
// Если одно из напоминаний соответствует настоящему времени(часу и минуте), то отправляем пользователю напоминание.
setInterval(function () {
    for (var i = 0; i < notes.length; i++) {
        const curDate = new Date().getHours() + ':' + new Date().getMinutes();
        if (notes[i]['time'] === curDate) {
            bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны: ' + notes[i]['text'] + ' сейчас.');
            notes.splice(i, 1);
        }
    }
}, 1000);
