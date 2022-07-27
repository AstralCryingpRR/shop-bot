module.exports = {
  customId: "addcash",
  description: "Cash interaction",
  async execute(
    client,
    interaction,
    Discord,
    wait,
    UserModel,
    { introduction }
  ) {
    const embed = new Discord.MessageEmbed()
      .setTitle(`**Выберите сумму в меню**`)
      .setFooter(
        interaction.user.username + "#" + interaction.user.discriminator
      )
      .setTimestamp();

    const row2 = new Discord.MessageActionRow().addComponents(
      new Discord.MessageSelectMenu()
        .setCustomId("money-menu")
        .setPlaceholder("Выберите сумму для оплаты")
        .addOptions([
          {
            label: `${client.prices.Full.Price.price} - Nitro Boost`,
            value: "f",
          },
          {
            label: `${client.prices.FullGuar.Price.price} - Nitro Boost Гарантия`,
            value: "fg",
          },
          {
            label: `${client.prices.Classic.Price.price} - Nitro Classic`,
            value: "c",
          },
          {
            label: `${client.prices.ClassicGuar.Price.price} - Nitro Classic Гарантия`,
            value: "cg",
          },

          // {
          //     label: `${client.prices.Spotify.Price.price} - Spotify`,
          //     value: 's',
          // },
          {
            label: "Другая цена",
            value: "other",
          },
        ])
    );

    await interaction
      .update({
        embeds: [embed],
        components: [row2],
        ephemeral: true,
        flags: 64,
      })
      .catch((err) => {});
  },
};
