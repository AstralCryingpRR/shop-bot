const ProductModel = require("../Models/Product");
module.exports = {
  name: "removeproduct",
  aliases: ["remove-product", "remprod", "rp", "rproduct"],
  description: "Удалить продукт\nПример: rp f https://example.com/",
  isHidden: false,
  dm: [true],
  async execute(client, message, args, Discord, wait, UserModel, {}) {
    const permission = (await UserModel.findOne({ login: message.author.id }))
      .permission;
    if (!permission) return;
    const embed = new Discord.MessageEmbed()
      .setTitle(`Успешно!`)
      .setDescription(`**Удалены продукты с дата базы!**`)
      .setFooter(message.author.username + "#" + message.author.discriminator)
      .setTimestamp();
    switch (args[0]) {
      case "f":
      case "c":
      case "cg":
      case "fg":
        removeProductType(args[0], args);
        break;
      default:
        message.reply("types: [`f | c | fg | cg`]").catch((err) => {});
        break;
    }
    async function removeProductType(type, args) {
      for (let i = 2; i < args.length; i++) {
        let links = args[i].split("\n").join(" ");
        let gg = links.split(" ");
        gg.forEach(async (g) => {
          ProductModel.findOneAndDelete(
            { link: g, type: type },
            function (err, docs) {}
          );
        });
      }
      await message.reply({ embeds: [embed] }).catch((err) => {});
      wait(2000);
      await client.updateProducts();
    }
  },
};
