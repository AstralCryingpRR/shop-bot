const UserModel = require('../Models/User');
function generateSecureKey(length) {
    var randomChars = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

async function isAccountNew(user) {
    if(!user) return console.log('Couldnot find the user!');
    let date = new Date().getTime();
    let req = await UserModel.findOne({ idUser: user.id });
   
    if (!req) {
        const user_obj = {
            id: user.id,
            bot: user.bot,
            system: user.system,
            username: user.username,
            discriminator: user.discriminator
        };

        let doc = await new UserModel({
            idUser: user.id,
            balance: 0,
            permission: false,
            total: 0,
            history: [],
            notice: false,
            lastUse: date,
            subscribe: {
                name: "Обычный",
                duration: 0,
                subscribedAt: {}
            },
            login: user.id,
            user: user_obj
        })
        await doc.save();
        return true;
    }
    if(req.idUser) if(req.idUser != req.login) await UserModel.findOneAndUpdate({idUser: user.id}, {login: user.id}, {new: true});
    UserModel.findOne({login: user.id}).clone().then(async u => {
        if(!u.total)  await UserModel.findOneAndUpdate({ login: user.id }, {total: 0}, {new: true});
        if(u.userSpend) await UserModel.findOneAndUpdate({ login: user.id }, {total: u.userSpend, userSpend: 0}, {new: true});
        if(u.ad) await UserModel.findOneAndUpdate({ login: user.id }, {notice: ad}, {new: true});
        if(!u.subscribe.name) await UserModel.findOneAndUpdate({ login: user.id }, {"subscribe.name": u.subscribe.duration > 0 ? 'VIP' : 'Обычный'}, {new: true});
        if(!u.history || !u.user) {
            const user_obj = {
                id: user.id,
                bot: user.bot,
                system: user.system,
                username: user.username,
                discriminator: user.discriminator
            };
            await UserModel.findOneAndUpdate({ login: user.id }, {
                history: [],
                user: user_obj
            }, {new: true});
        } 
    })
    await UserModel.findOneAndUpdate({ login: user.id }, {lastUse: date}, {new: true});
    
    return false;
}
module.exports = isAccountNew;