const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);
const premiumRole = "1014212532715667487";


module.exports = {
	data: new SlashCommandBuilder()
		.setName("premium")
		.setDescription('Check the premium commands'),
	async execute(interaction) {
        const commands = {}
        const embed = new MessageEmbed()
            .setTitle(`Premium Commands`)
            .setDescription(`There are no premium commands!`)
            .setColor("PURPLE")
            .setTimestamp()
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })

       
        for (const [key, value] of Object.entries(commands)) {
            embed.addFields(
                { name: `${key}`, value: `${value}`, inline: false },
            )
        }

        interaction.reply({ embeds: [embed] });



	},
};
