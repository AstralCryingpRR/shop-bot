const wait = require('node:util').promisify(setTimeout);
const UserModel = require('../../Models/User');
const isAccountNew = require('../../functions/isAccountNew');
const text = require('../../config/text.json');
module.exports = async (Discord, client, member) => {
    try {
        if(member.guild.id === client.guildId) {
        const user = await UserModel.findOne({login: member.id});
        if(!user) return console.log(member.id + ' has left the server..');;
    await UserModel.findOneAndUpdate({login: member.id}, {notice: false}, {new: true});
    console.log(member.id + ' has left the server.. Removed Notice');
        }
} catch(err) {}
}