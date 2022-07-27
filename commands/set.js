module.exports = {
  name: "set",
  aliases: ["sc", "sb"],
  isHidden: false,
  description: "Создать новый конфиг\nПример: set 4334",
  dm: [true],
  async execute(client, message, args, Discord, wait, UserModel, {}) {
    const permission = (await UserModel.findOne({ login: message.author.id }))
      .permission;

    if (!permission) return;
    let id = args[0];

    let config = await client.ConfigModel.findOne({ id: id });

    if (!config) return message.reply("Такого конфига не существует");

    let configType = await client.ConfigTypeModel.findOne({ id: 1 });

    await client.ConfigTypeModel.findOneAndUpdate(
      { id: 1 },
      { currentId: parseInt(id) },
      { new: true }
    );

    const successEmbed = new Discord.MessageEmbed()
      .setColor("#fff")
      .setDescription(
        `**Id предыдущего конфига: ${configType.currentId}\nId текущего конфига: ${id}**`
      )
      .setTimestamp()
      .setTitle("🎉 Успешно установлен конфиг");

    client.setConfig();

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
