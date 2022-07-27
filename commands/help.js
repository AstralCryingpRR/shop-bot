module.exports = {
    name: 'help',
    description: 'Help command',
    aliases: ['h'],
    isHidden: false,
    dm: [true],
    async execute(client, message, args, Discord, wait, UserModel, {}) {
        const permission = (await UserModel.findOne({login: message.author.id})).permission;
        if(!permission) return;
        try {
        let string = "";
        let count = 0;
        client.commands.forEach(async command => {
            
            if(command.isHidden == false) {
                count++;
            string+= `
[${count}]\`${command.name}\`
Command aliases: \`[${command.aliases}]\`
Server & Dm: ${command.dm}
\`\`\`md\n# ${command.description}\`\`\`
`;
            console.log(command);
            }
        })

        const embed = new Discord.MessageEmbed()
        .setTitle('Help command')
        .setDescription(string)
        .setTimestamp();

        message.reply({embeds: [embed]}).catch(err => {});
    } catch(err) {}
    } 
}