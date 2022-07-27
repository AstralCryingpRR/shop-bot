module.exports = {
  name: "whitelist",
  description: "Белый список",
  isHidden: true,
  dm: [false, true],
  async execute(client, message, args, Discord, wait, UserModel, {}) {
    const NoArgs = new Discord.MessageEmbed()
      .setTitle("**Упс, что то пошло не так...:(**")
      .setDescription("Попробуйте еще раз! `whitelist <id> [allow | deny]`")
      .setFooter(message.author.username + "#" + message.author.discriminator)
      .setTimestamp();
    const Successfully = new Discord.MessageEmbed()
      .setTitle("**Успешно!**")
      .setFooter(message.author.username + "#" + message.author.discriminator)
      .setTimestamp();
    const permission = (await UserModel.findOne({ login: message.author.id }))
      .permission;
    if (permission == true) {
      if (!args[0] || !args[1]) return message.reply({ embeds: [NoArgs] });
      await UserModel.findOneAndUpdate(
        { login: args[0] },
        { permission: args[1] == "allow" ? true : false },
        { new: true }
      );
      Successfully.setDescription(
        `Изменил права пользователю: <@${args[0]}> - ${
          args[1] == "allow" ? true : false
        }`
      );
      message.reply({ embeds: [Successfully] }).catch((err) => {});
    }
  },
};
