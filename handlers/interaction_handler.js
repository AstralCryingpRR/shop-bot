const fs = require('fs');

module.exports = (client, Discord) => {
    const interaction_files = fs.readdirSync('./interactions/').filter(file => file.endsWith('.js'));

    for(const file of interaction_files) {
    const interaction = require(`../interactions/${file}`);
    if(interaction.customId) {
        client.interactions.set(interaction.customId, interaction);
    } else {
        continue;
    }
    }
}
