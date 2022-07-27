module.exports = {
  customId: "profile",
  description: "Profile interaction",
  addon: ["profile_return"],
  async execute(
    client,
    interaction,
    Discord,
    wait,
    UserModel,
    { account },
    addon
  ) {
    const data = await UserModel.findOne({ login: interaction.user.id });
    if (!data) return;
    const embed = new Discord.MessageEmbed()
      .setTitle(account.Embed.title)
      .setDescription(
        `**
ID: \`${data.login}\`
Баланс: \`${data.balance}\`
**`
      )
      .setFooter(
        interaction.user.username + "#" + interaction.user.discriminator
      )
      .setTimestamp();
    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setEmoji(account.AddLabel.emoji)
        .setLabel(account.AddLabel.label)
        .setCustomId(account.AddLabel.customId)
        .setStyle(account.AddLabel.style)
    );
    const row2 = new Discord.MessageActionRow().addComponents(
      new Discord.MessageSelectMenu()
        .setCustomId("profile-menu")
        .setPlaceholder("Выберите категорию")
        .addOptions([
          {
            label: "История покупок",
            value: "history",
          },
        ])
    );

    addon
      ? await interaction
          .update({
            embeds: [embed],
            components: [row2, row],
            ephemeral: true,
            flags: 64,
          })
          .catch((err) => {})
      : await interaction
          .reply({
            embeds: [embed],
            components: [row2, row],
            ephemeral: true,
            flags: 64,
          })
          .catch((err) => {});
  },
};
