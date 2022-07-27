module.exports = {
    customId: 'notice-enable',
    description: 'Notice interaction',
    async execute(client, interaction, Discord, wait, UserModel, { account }) {
        const embedS = new Discord.MessageEmbed()
            .setTitle('**<a:yes:881638621583638558> Уведомления включены!**')
            .setDescription(`**
Теперь вы сможете узнать о поставке товаров в боте первыми!
**`).setFooter(interaction.user.username + '#' + interaction.user.discriminator)
.setTimestamp();
const embedO = new Discord.MessageEmbed()
            .setTitle('**<a:no:951575788031975474> Уведомления отключены!**')
            .setDescription(`**
Оу, надеюсь вы передумаете!
Вы упускаете возможность первыми узнать о поставке товаров!
**`)
.setFooter(interaction.user.username + '#' + interaction.user.discriminator)
.setTimestamp();
try {
const user = await UserModel.findOne({login: interaction.user.id});

let guild = await client.guilds.fetch(client.guildId);
const member = await guild.members.fetch(interaction.user.id);
let role = await guild.roles.fetch(client.roleId);

if(!user) return;
if(user.notice) {
    await member.roles.remove(role).catch(err => console.log(err));
    await UserModel.findOneAndUpdate({login: interaction.user.id}, {notice: false}, {new: true});
    await interaction.reply({ embeds: [embedO], components: [], ephemeral: true, flags: 64 }).catch(err => { 
        console.log(err)
    })
} else {
    await member.roles.add(role).catch(err => console.log(err));
    await UserModel.findOneAndUpdate({login: interaction.user.id}, {notice: true}, {new: true});
    await interaction.reply({ embeds: [embedS], components: [], ephemeral: true, flags: 64 }).catch(err => { 
        console.log(err)
    })
}
} catch(err) {
    console.log(err)
}

    
    }
}