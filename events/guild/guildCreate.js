module.exports = async (Discord, client, guild) => {
  guild.commands.set(client.applicationCommands);
};
