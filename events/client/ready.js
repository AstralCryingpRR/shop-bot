const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = async (Discord, client) => {
  try {
    client.joinVoice = async () => {
      try {
        let configType = await client.ConfigTypeModel.findOne({ id: 1 });
        let config = await client.ConfigModel.findOne({
          id: configType.currentId,
        });
        const channel = client.channels.cache.get(config.voiceChannelId);

        const connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
      } catch (err) {}
    };
    console.log("Bot started!");
    client.user.setActivity(`!start`);

    client.joinVoice();

    setInterval(async () => {
      client.NoticeModel.find({}, function (err, notices) {
        notices.forEach(async (notice) => {
          if (!notice.used) {
            await noticeUsed(notice);
          }
        });
      });
      //await noticeUpdate();
      await client.updateProducts();
    }, 15000);
  } catch (err) {}
  async function noticeUsed(notice) {
    try {
      let channel = client.channels.cache.get("943497475443023972");
      await client.NoticeModel.findOneAndUpdate(
        { id: notice.id },
        { used: true },
        { new: true }
      );
      channel
        .send({ content: `<@&943534013656748054>` })
        .then(async (msg) => {
          msg.delete();
        })
        .catch((err) => {});
    } catch (err) {}
  }
  async function noticeUpdate() {
    let channel = client.channels.cache.get(client.noticeId);
    let count = {
      full: 0,
      classic: 0,
      spotify: 0,
      fullY: 0,
      classicY: 0,
    };
    client.ProductModel.find({}, async function (err, products) {
      products.forEach((product) => {
        switch (product.type) {
          case "f":
          case "fg":
            count.full++;
            break;
          case "c":
          case "cg":
            count.classic++;
            break;
          case "fy":
            count.fullY++;
            break;
          case "cy":
            count.classicY++;
            break;
        }
      });
    });
    setTimeout(async () => {
      const img_em = new Discord.MessageEmbed().setImage(
        "https://cdn.discordapp.com/attachments/940566686598332447/943537234638946364/10.png"
      );
      const { start } = require("../../config/text.json");
      const embed = new Discord.MessageEmbed().setTitle(
        "<a:Verificado_:939231511192928327> Уведомление о поступлениях товаров в боте!"
      ).setDescription(`
    **Пиши в лс боту: <@940565611262672897>, команда: \`/start\`**
                            
    *Чтобы включить/отключить уведомление о поступление товаров в бота, 
    Нажмите снизу на кнопку: \`Вкл/Выкл Уведомления\`*
    
    <:pin:951586432357638194><a:red:951586432324096100> **Пополни баланс сейчас, и тогда завоз товара ускорится! ** <a:check:951586432353447936>
    
    <a:1976nitroboost:939231511641747466> **Nitro Boost**: \`${count.full}\`шт
    <:bot_classic:936345974270488576> **Nitro Classic**: \`${count.classic}\`шт
    <a:fullGUR:936349647792906261> **Nitro Boost Year**(Год): \`${count.fullY}\`шт
    <a:classGUR:936349649638391818> **Nitro Classic Year**(Год): \`${count.classicY}\`шт
    `);
      const row = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setEmoji(start.introductionLabel.emoji)
          .setLabel(start.introductionLabel.label)
          .setCustomId(start.introductionLabel.customId)
          .setStyle(start.introductionLabel.style),
        new Discord.MessageButton()
          .setEmoji(start.ProfileLabel.emoji)
          .setLabel(start.ProfileLabel.label)
          .setCustomId(start.ProfileLabel.customId)
          .setStyle(start.ProfileLabel.style),
        new Discord.MessageButton()
          .setEmoji(start.ProductLabel.emoji)
          .setLabel(start.ProductLabel.label)
          .setCustomId(start.ProductLabel.customId)
          .setStyle(start.ProductLabel.style),
        new Discord.MessageButton()
          .setEmoji(start.ReviewLabel.emoji)
          .setLabel(start.ReviewLabel.label)
          .setURL(start.ReviewLabel.URL)
          .setStyle(start.ReviewLabel.style)
      );
      const notice = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setEmoji(start.NoticeLabel.emoji)
          .setLabel(start.NoticeLabel.label)
          .setCustomId(start.NoticeLabel.customId)
          .setStyle(start.NoticeLabel.style)
      );
      channel.messages
        .fetch()
        .then((messages) => {
          messages.forEach((lastMessage) => {
            if (lastMessage.id == "943538945680080957") {
              lastMessage
                .edit({
                  content: `Бот для авто покупки: <@940565611262672897>`,
                  embeds: [embed],
                  components: [row, notice],
                })
                .then(async (msg) => {})
                .catch((err) => {});
            }
          });
        })
        .catch((err) => {});
    }, 6000);
  }
};
