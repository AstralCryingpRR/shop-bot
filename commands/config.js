module.exports = {
  name: "config",
  aliases: ["c"],
  isHidden: false,
  description: "Конфиг чтоб менять цены на нитро\nПример: c price example 1000",
  dm: [true, false],
  async execute(client, message, args, Discord, wait, UserModel, {}) {
    const ArgumentEmbed = new Discord.MessageEmbed()
      .setColor("#fff")
      .setDescription(`**Вы ничего не написали!**`)
      .setTimestamp()
      .setTitle("❌ Отклонено!");
    const permission = (await UserModel.findOne({ login: message.author.id }))
      .permission;
    let type = args[1];
    if (!permission) return;
    let configType = args[0];
    switch (configType) {
      case "price":
        if (!type)
          return message
            .reply({
              content: `Types: \`f | c | fg | cg | fy | cy\``,
              embeds: [ArgumentEmbed],
            })
            .catch((err) => {});

        switch (type) {
          case "f":
          case "c":
          case "cg":
          case "fg":
            let price = args[2];
            if (isNaN(price))
              return message
                .reply({
                  content: `Цена должна быть цифрой!`,
                  embeds: [ArgumentEmbed],
                })
                .catch((err) => {});
            await client.PriceModel2.findOneAndUpdate(
              { type },
              { price: +price, priceStr: `${price}` },
              { new: true }
            );
            let nitrof = await client.PriceModel2.findOne({ type });
            let messageFull = new Discord.MessageEmbed()
              .setTitle("✅ Success !")
              .setDescription(
                `
                            **Обновил базу данных цен**:
                            Тип: \`${nitrof.type}\`
                            Цена: \`${nitrof.price}\`
                            PriceStringed: \`\'${nitrof.priceStr}\'\`
                            `
              )
              .setTimestamp();
            message.reply({ embeds: [messageFull] }).catch((err) => {});
            client.updatePrice();
            break;

          default:
            return message
              .reply({
                content: `Типы: \`f | c | cg | fg\``,
                embeds: [ArgumentEmbed],
              })
              .catch((err) => {});
            break;
        }
        break;

      default:
        return message
          .reply({
            content: `Config Types: \`price\``,
            embeds: [ArgumentEmbed],
          })
          .catch((err) => {});
        break;
    }
  },
};
