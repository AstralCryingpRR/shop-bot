const { Schema, model } = require("mongoose");

const Config = Schema({
  id: Number, // айди текущего конфига  / можно сетнуть другой конфиг по команде: set ID

  roleId: String, // айди роль покупателя

  guildId: String, // сервер

  noticeRoleId: String, // роль уведомлений

  noticeChannelId: String, // канал, куда бот отправит уведомление о завозе

  reviewChannelURL: String, // канал с отзывами

  ownerId: String, // Айди текущего овнера

  voiceChannelId: String, // голосовой канал, куда бот будет подключен (Если его нет, то бот напишет уведомление админу. Перезапуск будет через команду)
});

module.exports = model("Config", Config);
