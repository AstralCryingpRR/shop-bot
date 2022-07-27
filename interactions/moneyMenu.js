module.exports = {
  customId: "money-menu",
  description: "Money Menu interaction",
  async execute(client, interaction, Discord, wait, UserModel, { account }) {
    let channel_b = await client.channels.cache.find(
      (c) => c.id === "952190059556270101"
    );
    switch (interaction.values[0]) {
      case "f":
      case "c":
      case "fg":
      case "cg":
      case "fy":
      case "cy":
        let price =
          interaction.values[0] == "f"
            ? client.prices.Full.Price.price
            : interaction.values[0] == "c"
            ? client.prices.Classic.Price.price
            : interaction.values[0] == "fg"
            ? client.prices.FullGuar.Price.price
            : interaction.values[0] == "cg"
            ? client.prices.ClassicGuar.Price.price
            : interaction.values[0] == "fy"
            ? client.prices.FullY.Price.price
            : client.prices.ClassicY.Price.price;

        const billId = client.qiwiApi.generateId();
        const fields = {
          amount: price,
          currency: "RUB",
          expirationDateTime: client.qiwiApi.getLifetimeByDay(0.0055),
          comment: `${interaction.user.tag}`,
          successUrl: interaction.message.url,
        };

        client.qiwiApi.createBill(billId, fields).then((data) => {
          const embed = new Discord.MessageEmbed()
            .setTitle("Ссылка на оплату")
            .setDescription(
              `Сумма к оплате: ${price}p\nСсылка на оплату - [клик](${data.payUrl})\n Ссылка истечет через 7 минут`
            )
            .setFooter(
              interaction.user.username + "#" + interaction.user.discriminator
            )
            .setTimestamp()
            .setColor("#fff");
          interaction.update({
            content: data.payUrl,
            embeds: [embed],
            components: [],
          });
        });
        await client.createBill(billId, interaction.user, "qiwi");
        break;
      case "other":
        const embed = new Discord.MessageEmbed()
          .setTitle("**Enter the amount to pay**")
          .setFooter(
            interaction.user.username + "#" + interaction.user.discriminator
          )
          .setTimestamp()
          .setColor("#fff");
        const embed_ = new Discord.MessageEmbed()
          .setTitle("**Enter the amount to pay in dm's**")
          .setFooter(
            interaction.user.username + "#" + interaction.user.discriminator
          )
          .setTimestamp()
          .setColor("#fff");
        const msg_int = await interaction.user
          .send({ embeds: [embed], ephemeral: true, flags: 64 })
          .catch(async (err) => {});
        if (!msg_int)
          return await interaction.update(
            `**<a:alert:939231510781898773>Возможно, вы отключили личные сообщение! Я не смог отправить вам сообщения!<a:alert:939231510781898773>**`
          );
        await interaction
          .update({
            content: msg_int.url,
            embeds: [embed_],
            components: [],
            ephemeral: true,
            flags: 64,
          })
          .catch((err) => {});
        const filter = (m) => m.author.id === interaction.user.id;
        let collector = interaction.user.dmChannel.createMessageCollector(
          filter,
          {
            time: 60000,
          }
        );

        collector.on("collect", async (msg) => {
          let args = msg.content.split(" ");
          if (args.length > 1)
            return (
              msg.author.send("You entered the wrong amount!"), collector.stop()
            );
          if (isNaN(args[0]))
            return (
              msg.author.send("You entered the wrong amount!"), collector.stop()
            );
          if (args[0] < 1)
            return (
              msg.author.send("You entered the wrong amount!"), collector.stop()
            );
          const billId = client.qiwiApi.generateId();
          const fields = {
            amount: msg.content.split(" ")[0],
            currency: "RUB",
            comment: `${msg.author.tag}`,
            expirationDateTime: client.qiwiApi.getLifetimeByDay(0.0055),
            successUrl: msg.url,
          };

          client.qiwiApi.createBill(billId, fields).then(async (data) => {
            let embed = new Discord.MessageEmbed()
              .setTitle("Payment link")
              .setDescription(
                `Amount to pay: ${msg.content}p\nLink to pay - [click](${data.payUrl})\n Payment check is valid for 7 minutes`
              )
              .setFooter(
                interaction.user.username + "#" + interaction.user.discriminator
              )
              .setTimestamp()
              .setColor("#fff");
            msg_int
              .edit({ content: data.payUrl, embeds: [embed], components: [] })
              .catch((err) => {});
          });
          await client.createBill(billId, msg.author, "qiwi");
          collector.stop();
        });

        // fires when the collector is finished collecting
        collector.on("end", (collected, reason) => {
          // only send a message when the "end" event fires because of timeout
          if (reason === "time") {
            console.log("Time expired!");
          }
        });
        break;
    }
  },
};
