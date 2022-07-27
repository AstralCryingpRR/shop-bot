module.exports = {
  name: "infouser",
  description: "Информация пользователей\nExample: i 532889574045777920",
  aliases: ["i"],
  isHidden: false,
  dm: [false, true],
  async execute(client, message, args, Discord, wait, UserModel, {}) {
    const permission = (await UserModel.findOne({ login: message.author.id }))
      .permission;
    if (!permission) return;
    if (!args[0]) return message.reply("Нет аргументов").catch((err) => {});
    if (isNaN(args[0]))
      return message
        .reply("Пожалуйста, введите id пользователя")
        .catch((err) => {});

    let member = await client.users.fetch(args[0]);
    if (!member) return message.author.send(`Неизс`).catch((err) => {});
    let userData = await UserModel.findOne({ idUser: args[0] });
    if (!userData) return;
    try {
      let embed = new Discord.MessageEmbed()
        .setTitle(`${member.username}'s Кошелёк:`)
        .setDescription(
          `
Логин: ${userData.login}
Потрачено денег: ${userData.total}
Баланс: ${userData.balance}
Подписка: ${userData.subscribe.name}
${
  userData.subscribe.subscribedAt
    ? `Активно до...\n Месяц: ${userData.subscribe.duration}`
    : ""
}
`
        )
        .setColor("#fff");
      message.reply({ embeds: [embed] }).catch((err) => {});
    } catch (err) {}
  },
};
