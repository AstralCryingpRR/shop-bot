const wait = require("node:util").promisify(setTimeout);
const isAccountNew = require("../../functions/isAccountNew");
const UserModel = require("../../Models/User");
const text = require("../../config/text.json");

module.exports = async (Discord, client, message) => {
  console.log(message.content, `message!`);
  if (message.author.bot) return;
  if (message.channel.id == "943497447219552256") {
    if (message.attachments.size > 0) {
      let roel = await message.guild.roles
        .fetch(client.roleBuyerId)
        .catch((err) => {});
      message.member.roles.add(roel).catch((err) => {});
      await message.react("<a:check:951586432353447936>").catch((err) => {});
    } else {
      try {
        let isWl = (await UserModel.findOne({ login: message.author.id }))
          .permission;
        if (
          message.member.permissions.has(
            Discord.Permissions.FLAGS.MANAGE_MESSAGES
          ) ||
          isWl
        )
          return;
        message
          .reply(`**ПРИКРЕПИТЕ ПОЖАЛУЙСТА СКРИНШОТ!**`)
          .then(async (msg) => {
            setTimeout(async () => {
              msg.delete();
            }, 60000);
          })
          .catch((err) => {});
        message.delete().catch((err) => {});
      } catch (err) {}
    }
  }
  const prefix = "!";
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  await isAccountNew(message.author);
  const args = message.content.slice(prefix.length).split(/ +/);
  const cmd = args.shift().toLowerCase();

  const command =
    client.commands.get(cmd) ||
    client.commands.find((c) => c.aliases && c.aliases.includes(cmd));
  if (command)
    if (command.dm.length > 1) {
      command.execute(client, message, args, Discord, wait, UserModel, text);
    } else {
      command.dm[0] == (message.guild == null ? true : false)
        ? command.execute(client, message, args, Discord, wait, UserModel, text)
        : message.reply("Dm channel are not supported!");
    }
};
