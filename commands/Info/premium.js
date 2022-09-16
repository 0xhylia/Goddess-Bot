const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);
const premiumRole = "1006952317679046723";


module.exports = {
	data: new SlashCommandBuilder()
		.setName("premium")
		.setDescription('Check the premium commands'),
	async execute(interaction) {
        const commands = {
            "wheelspin": "Spin the wheel for a chance to win a prize!",
        }
        const embed = new MessageEmbed()
            .setTitle(`Premium Commands`)
            .setDescription(`Here are the premium commands!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter({
                text: "Powered By Akeno API",
                iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
            })

        for (const [key, value] of Object.entries(commands)) {
            embed.addFields(
                { name: `${key}`, value: `${value}`, inline: true },
            )
        }

        interaction.reply({ embeds: [embed] });



	},
};
