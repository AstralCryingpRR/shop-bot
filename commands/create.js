module.exports = {
  name: "create",
  aliases: ["cr", "build"],
  isHidden: false,
  description:
    "Создать новый конфиг\nЕсли вы введете неверные данные, бот может сломаться!\nПример: create buyerRoleId guildId noticeRoleId noticeChannelId reviewChannelURL ownerId voiceChannelId",
  dm: [true],
  async execute(client, message, args, Discord, wait, UserModel, {}) {
    const permission = (await UserModel.findOne({ login: message.author.id }))
      .permission;

    if (!permission) return;

    if (args.length < 6)
      return message.reply(
        "Arguments length less than 7\nExample: roleBuyerId guildId noticeRoleId noticeChannelId reviewChannelURL ownerId voiceChannelId"
      );

    let newId = getId(4);
    let config = await new client.ConfigModel({
      id: newId,
      roleId: args[0],
      guildId: args[1],
      noticeRoleId: args[2],
      noticeChannelId: args[3],
      reviewChannelURL: args[4],
      ownerId: args[5],
      voiceChannelId: args[6],
    });

    await config.save();

    const successEmbed = new Discord.MessageEmbed()
      .setColor("#fff")
      .setDescription(
        `
**Ваш id конфига: ${newId}**
RoleBuyerId: \`${args[0]}\`
GuildId: \`${args[1]}\`
NoticeRoleId: \`${args[2]}\`
NoticeChannelId: \`${args[3]}\`
ReviewChannelURL: \`${args[4]}\`
OwnerId: \`${args[5]}\`
VoiceChannelId: \`${args[6]}\`
`
      )
      .setTimestamp()
      .setTitle("🎉 Успешно создан конфиг");

    message.reply({ embeds: [successEmbed] });
  },
};

function getId(length) {
  var randomChars = "123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}
