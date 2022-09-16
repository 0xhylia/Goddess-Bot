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
        logger.info(JSON.stringify(interactionInfo));
	},
};