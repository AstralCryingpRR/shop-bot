

require("dotenv").config();
const admin_id = process.env.ADMIN_ID;

const Discord = require("discord.js"),
  { Intents } = require("discord.js");

const mongoose = require("mongoose");

const uri = `mongodb+srv://xTime:${process.env.PASSWORD_MONGOOSE}@cluster0.4unqd.mongodb.net/nasri?retryWrites=true&w=majority`;

const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  partials: [
    "CHANNEL",
    "USER",
    "MESSAGE",
    "GUILD_MEMBER",
    "GUILD_SCHEDULED_EVENT",
    "REACTION",
  ],
});

/*

  @@@@@@@@@@@  MODELS  @@@@@@@@@@@@@@

*/

const PriceModel = require("./Models/Price");
const NoticeModel = require("./Models/Notice");
const ProductModel = require("./Models/Product");
const WhitelistModel = require("./Models/Whitelist");
const UserModel = require("./Models/User");
const ConfigModel = require("./Models/Config");
const ConfigTypeModel = require("./Models/ConfigType");

client.setConfig = async () => {
  let configType = await ConfigTypeModel.findOne({ id: 1 });

  let config = await ConfigModel.findOne({
    id: parseInt(configType.currentId),
  });

  client.roleBuyerId = config.roleId;
  client.noticeId = config.noticeChannelId;
  client.voiceId = config.voiceChannelId;
  client.ownerId = config.ownerId;
  client.roleId = config.noticeRoleId;
  client.guildId = config.guildId;
  client.reviewChannelURL = config.reviewChannelURL;

  client.joinVoice ? client.joinVoice() : 0;
};

async function run() {
  let configType = await ConfigTypeModel.findOne({ id: 1 });

  if (!configType) {
    try {
      let newConfigType = await new ConfigTypeModel({
        id: 1,
        currentId: 0,
      });
      await newConfigType.save();

      return run();
    } catch (err) {
      console.log(`Error in run function`);
    }
  }

  let config = await ConfigModel.findOne({ id: configType.currentId });

  console.log(configType, config);
  if (!config) {
    console.log("  Could not to find configuration!");

    console.log("\n\n CREATING DEFAULT CONFIGURATIONS...");

    let config_ = await new ConfigModel({
      id: 666,
      roleId: "999969056348180480",
      guildId: "993086776736485457",
      noticeRoleId: "996384036601724978",
      noticeChannelId: "996384036601724978",
      reviewChannelURL: "https://discord.gg/ZwFAJ4vk",
      ownerId: "867652642192883732",
      voiceChannelId: "1000458983720616016",
    });
    await config_.save();

    let configTypeToUpdate = await ConfigTypeModel.findOneAndUpdate(
      { id: 1 },
      { currentId: 666 },
      { new: true }
    );

    throw new Error(
      "Configuration is not available, try again...\n CREATE YOUR OWN CONFIG WITH COMMAND: !create <arguments>\n SET YOUR OWN CONFIG WITH COMMAND: !set <id>"
    );
  }
  client.setConfig();
}

run();

client.PriceModel2 = PriceModel;
client.NoticeModel = NoticeModel;
client.ProductModel = ProductModel;
client.WlModel = WhitelistModel;
client.ConfigModel = ConfigModel;
client.ConfigTypeModel = ConfigTypeModel;

client.prices = {
  Full: {
    Price: 250,
  },
  Classic: {
    Price: 150,
  },
  FullGuar: {
    Price: 370,
  },
  ClassicGuar: {
    Price: 250,
  },
  FullY: {
    Price: 2000,
  },
  ClassicY: {
    Price: 1000,
  },
};

client.products = {
  f: [],
  c: [],
  fg: [],
  cg: [],
  fy: [],
  cy: [],
};

client.updatePrice = async function () {
  client.prices.Full.Price = await checkPriceProduct("f", 250);
  client.prices.Classic.Price = await checkPriceProduct("c", 150);
  client.prices.FullGuar.Price = await checkPriceProduct("fg", 370);
  client.prices.ClassicGuar.Price = await checkPriceProduct("cg", 250);
  client.prices.FullY.Price = await checkPriceProduct("fy", 2000);
  client.prices.ClassicY.Price = await checkPriceProduct("cy", 1000);
};

setInterval(async () => {
  await client.updateProducts();
}, 30000);

// functions
async function checkPriceProduct(type, price) {
  let product = await PriceModel.findOne({ type: type });
  if (!product) {
    let doc = await new PriceModel({
      type: type,
      price: price,
      priceStr: price,
    });
    await doc.save();
    let product2 = await PriceModel.findOne({ type: type });
    return product2;
  }
  return product;
}

async function checkWhitelist() {
  let whitelist = await WhitelistModel.findOne({ id: 55 });
  if (!whitelist) {
    let doc = await new WhitelistModel({
      id: 55,
      list: [admin_id],
    });
    await doc.save();
    return true;
  }
  return false;
}

const BillModel = require("./Models/Bill");
const QiwiBillPaymentsAPI = require("@qiwi/bill-payments-node-js-sdk");

client.qiwiApi = new QiwiBillPaymentsAPI(process.env.SECRET_KEY);

client.createBill = async function (billId, author, type) {
  try {
    let date = new Date().getTime();
    let doc = new BillModel({
      type: type,
      id: author.id,
      userId: author.id,
      bill: billId,
      date: date,
    });
    await doc.save();
  } catch (err) {}
};

(async function () {
  try {
    client.db = await mongoose.connect(uri, {});
    await client.updatePrice();
    await client.updateProducts();
    await checkWhitelist();
  } catch (e) {
    console.error(e);
  }
})();
client.updateProducts = async function () {
  client.products.f = [];
  client.products.c = [];
  client.products.fg = [];
  client.products.cg = [];
  client.products.fy = [];
  client.products.cy = [];

  ProductModel.find({}, function (err, products) {
    if (!products) return;
    products.forEach((product) => {
      switch (product.type) {
        case "f":
        case "c":
        case "cg":
        case "fg":
        case "fy":
        case "cy":
          client.products[product.type].push(product);
          break;
      }
    });
  });
};

setInterval(async () => {
  BillModel.find({}, (err, users) => {
    users.forEach(async (u) => {
      if (u.type == "qiwi") {
        client.qiwiApi
          .getBillInfo(u.bill)
          .then(async (data) => {
            if (data.status.value === "PAID" && u.bill === data.billId) {
              let user = await UserModel.findOne({ idUser: u.userId });
              let bal = user.balance + +data.amount.value;
              await UserModel.findOneAndUpdate(
                { idUser: u.userId },
                { balance: +bal },
                { new: true }
              );
              user = await UserModel.findOne({ idUser: u.userId });
              userAfterPay(u.userId, data.amount.value, user, "Qiwi");
              BillModel.findOneAndDelete(
                { bill: data.billId },
                function (err, docs) {}
              );
            }
          })
          .catch((err) => {});
      }
      if (getMinutesBetweenDates(u.date, new Date()) > 7) {
        BillModel.findOneAndDelete({ date: u.date }, function (err, docs) {});
      }
    });
  });
}, 5000);

async function userAfterPay(id, amount, user2, type) {
  let user = await client.users.fetch(id);

  let embed = new Discord.MessageEmbed()
    .setTitle(`**Успешно!**`)
    .setDescription(
      `**💰 Пополнил \`${amount}\` RUB!**\nБаланс: \`${user2.balance}\`\nПополнено через \`${type}\``
    )
    .setColor("#fff");
  user.send({ embeds: [embed] }).catch((err) => {});
  let UserPaidEmbed = new Discord.MessageEmbed()
    .setDescription(
      `**💰 <@${user.id}> Пополнил \`${amount}\` RUB!**\n ID: \`${user.id}\`\nБаланс: \`${user2.balance}\`\nПополнено через \`${type}\``
    )
    .setTimestamp()
    .setColor("#fff");
  try {
    await WhitelistModel.find({}, async function (err, wl) {
      wl[0].list.forEach(async (id) => {
        (await client.users.fetch(`${id}`))
          .send({ embeds: [UserPaidEmbed] })
          .catch((err) => {});
      });
    });
  } catch (err) {}
}

function getMinutesBetweenDates(startDate, endDate) {
  var diff = endDate.getTime() - startDate;
  return diff / 60000;
}
client.commands = new Discord.Collection();
client.applicationCommands = [];
client.interactions = new Discord.Collection();

client.login(process.env.TOKEN).then(() => {
  ["command_handler", "event_handler", "interaction_handler"].forEach(
    (handler) => {
      require(`./handlers/${handler}`)(client, Discord);
    }
  );
});
