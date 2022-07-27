module.exports = {
  customId: "products",
  description: "Products interaction",
  async execute(
    client,
    interaction,
    Discord,
    wait,
    UserModel,
    { account },
    addon
  ) {
    const embed = new Discord.MessageEmbed().setTitle("**Меню продуктов: **")
      .setDescription(`**
Выберите продукт который хотите купить!
Перед вашей покупкой, проверьте ваш баланс!
**`);
    const row2 = new Discord.MessageActionRow().addComponents(
      new Discord.MessageSelectMenu()
        .setCustomId("product-menu")
        .setPlaceholder("Выберите товар")
        .addOptions([
          {
            label: `Nitro Boost ${client.prices.Full.Price.price}RUB`,
            value: "f",
            emoji: {
              name: "nitroBoostIcon",
              id: "1000447424067817492",
            },
            description: "Подписка на 1 месяц. Гарантия 5 минут после покупки!",
          },
          {
            label: `Nitro Boost Гарантия ${client.prices.FullGuar.Price.price}RUB`,
            value: "fg",
            emoji: {
              name: "nitroBoost",
              id: "1000447426240450630",
            },
            description: "Подписка на 1 месяц. Гарантия 24 часа после покупки!",
          },
          {
            label: `Nitro Classic ${client.prices.Classic.Price.price}RUB`,
            value: "c",
            emoji: {
              name: "nitroClassicIcon",
              id: "1000447421110816871",
            },
            description: "Подписка на 1 месяц. Гарантия 5 минут после покупки!",
          },
          {
            label: `Nitro Classic Гарантия ${client.prices.ClassicGuar.Price.price}RUB`,
            value: "cg",
            emoji: {
              name: "nitroWumpus",
              id: "1000447429407146004",
            },
            description: "Подписка на 1 месяц. Гарантия 24 часа после покупки!",
          },
        ])
    );

    addon
      ? (await interaction.reply(),
        await interaction
          .update({
            embeds: [embed],
            components: [row2],
            ephemeral: true,
            flags: 64,
          })
          .catch((err) => {
            console.log(err);
          }))
      : await interaction
          .reply({
            embeds: [embed],
            components: [row2],
            ephemeral: true,
            flags: 64,
          })
          .catch((err) => {
            console.log(err);
          });
  },
};
