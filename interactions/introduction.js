module.exports = {
  customId: "introduction",
  description: "introduction interaction",
  async execute(
    client,
    interaction,
    Discord,
    wait,
    UserModel,
    { introduction }
  ) {
    const embed = new Discord.MessageEmbed()
      .setTitle(introduction.Embed.title)
      .setDescription(
        introduction.Embed.description +
          `\n<@${client.ownerId}> | ${client.ownerId}`
      )
      .addField(introduction.Embed.field1, introduction.Embed.field1_1)
      .addField(introduction.Embed.field2, introduction.Embed.field2_1)
      .addField(introduction.Embed.field3, introduction.Embed.field3_1)
      .addField(introduction.Embed.field4, introduction.Embed.field4_1)
      .setFooter(
        interaction.user.username + "#" + interaction.user.discriminator
      )
      .setTimestamp();
    await interaction
      .reply({ embeds: [embed], ephemeral: true, flags: 64 })
      .catch((err) => {});
  },
};
