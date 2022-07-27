const wait = require("node:util").promisify(setTimeout);
const UserModel = require("../../Models/User");
const isAccountNew = require("../../functions/isAccountNew");
const text = require("../../config/text.json");
module.exports = async (Discord, client, interaction) => {
  if (interaction.isCommand()) {
    const cmd = client.commands.get(`${interaction.commandName}`);
    if (!cmd) return;

    try {
      interaction.args = [];
      interaction.options.data.forEach((option) => {
        interaction.args.push(option.value);
      });
      await cmd.execute(
        client,
        interaction,
        interaction.args,
        Discord,
        wait,
        UserModel,
        text
      );
    } catch (err) {
      console.log(err);
    }
  }

  const int =
    (await client.interactions.get(interaction.customId)) ||
    client.interactions.find(
      (c) => c.addon && c.addon.includes(interaction.customId)
    );
  const addon = client.interactions.find(
    (c) => c.addon && c.addon.includes(interaction.customId)
  );
  await isAccountNew(interaction.user);
  if (int)
    await int.execute(
      client,
      interaction,
      Discord,
      wait,
      UserModel,
      text,
      addon
    );
};
