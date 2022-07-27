module.exports = {
  customId: "profile-menu",
  description: "Profile menu interaction",
  async execute(client, interaction, Discord, wait, UserModel, { account }) {
    if (!interaction.isSelectMenu()) return;

    console.log(interaction.values[0]);
    switch (interaction.values[0]) {
      case "history":
        (async function () {
          const data = await UserModel.findOne({ login: interaction.user.id });
          let string = "";
          if (data.history.length > 0) {
            if (data.history.length == 1) {
              string = `Название: ${data.history[0].productName}(${data.history[0].productPrice}RUB)\nТовар: ${data.history[0].productLink}\n`;
            } else {
              data.history.forEach(async (dat) => {
                if (data.history.length == 1) {
                  string = `Название: \`${dat.productName}(${dat.productPrice}RUB)\`\nТовар: \`${dat.productLink}\`\n`;
                } else if (
                  data.history.length - 1 ==
                  data.history.indexOf(dat)
                ) {
                  string += `Название: \`${dat.productName}(${dat.productPrice}RUB)\`\nТовар: \`${dat.productLink}\`\n`;
                } else {
                  string += `Название: \`${dat.productName}(${dat.productPrice}RUB)\`\nТовар: \`${dat.productLink}\`\n`;
                }
              });
            }
          }
          const embedHistory = new Discord.MessageEmbed()
            .setTitle(`Ваш профиль:`)
            .setDescription(
              `
**Баланс:** \`${data.balance}\`
**Ты потратил:** \`${data.total}\`
**История покупок:**
${data.history.length > 0 ? string : "**`Пусто`**"}`
            )
            .setFooter(
              interaction.user.username + "#" + interaction.user.discriminator
            )
            .setTimestamp();
          const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
              .setEmoji("🔙")
              .setLabel("Назад")
              .setCustomId("profile_return")
              .setStyle("SECONDARY")
          );

          await interaction
            .update({
              embeds: [embedHistory],
              components: [row],
              ephemeral: true,
              flags: 64,
            })
            .catch((err) => {
              console.log(err);
            });
        })();
        break;
    }
  },
};
