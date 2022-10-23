const Logger = require('../utils/Logger');
const logger = new Logger({ debug: true });

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
        const interactionInfo = {
            interactionChannel: interaction.channel.name,
            interactionUser: interaction.user.tag,
            interactionGuild: interaction.guild.name,
            interactionGuildId: interaction.guild.id,
            interactionId: interaction.id,
        }
        // Use logger.info to log the interactionInfo
        // Make it into a string using JSON.stringify
        logger.info(JSON.stringify(interactionInfo));
	},
};