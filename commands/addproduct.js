const ProductModel = require("../Models/Product");
module.exports = {
  name: "addproduct",
  aliases: ["add-product", "addprod", "ap", "aproduct"],
  isHidden: false,
  description: "Пополнить товарыПример: ap f (link)",
  dm: [true],
  async execute(client, message, args, Discord, wait, UserModel, {}) {
    const permission = (await UserModel.findOne({ login: message.author.id }))
      .permission;
    if (!permission) return;
    const embed = new Discord.MessageEmbed()
      .setTitle(`Успешно!`)
      .setDescription(`**Продукты успешно добавлены в базу данных!**`)
      .setFooter(message.author.username + "#" + message.author.discriminator)
      .setTimestamp();
    switch (args[0]) {
      case "f":
      case "c":
      case "cg":
      case "fg":
        addProductType(args[0], args);
        let notice = await client.NoticeModel.findOne({
          id: message.author.id,
        });
        if (!notice) {
          let date = new Date().getTime();
          let doc = new client.NoticeModel({
            id: message.author.id,
            date: date,
            used: false,
            type: message.author.tag,
          });
          await doc.save();
          return true;
        }
        if (getMinutesBetweenDates(notice.date, new Date()) < 15) {
          message.reply(`Used cooldown already! Wait some`);
        } else {
          await client.NoticeModel.findOneAndUpdate(
            { id: message.author.id },
            { date: new Date().getTime(), used: false },
            { new: true }
          );
        }

        break;
      default:
        message.reply("types: [`f | c | fg | cg`]").catch((err) => {});
        break;
    }
    async function addProductType(type, args, addressProduct = false) {
      for (let i = 1; i < args.length; i++) {
        let links = args[i].split("\n").join(" ");
        let gg = links.split(" ");
        gg.forEach(async (g) => {
          if (String(g).startsWith("https://")) {
            let doc = new ProductModel({
              type: type,
              link: g,
              id: getId(6),
              addressProduct: addressProduct,
              date: new Date().getTime(),
            });
            await doc.save();
          }
        });
      }
      await message.reply({ embeds: [embed] }).catch((err) => {});
      wait(2000);
      await client.updateProducts();
    }
  },
};

function getId(length) {
  var randomChars = "123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

function getMinutesBetweenDates(startDate, endDate) {
  var diff = endDate.getTime() - startDate;
  return diff / 60000;
}
