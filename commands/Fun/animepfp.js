const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);




module.exports = {
	data: new SlashCommandBuilder()
		.setName('animepfp')
		.setDescription("Get a anime profile picture"),
	async execute(interaction) {

        const options = {
            method: 'GET',
			url: 'https://api.waifu.pics/sfw/waifu',
			headers: {
				'Content-Type': 'application/json'
			}
        };

		axios.request(options).then(function (response) {
			const embed = new MessageEmbed()
				.setTitle('Anime Profile Picture')
				.setImage(response.data.url)
				.setColor('RANDOM')
				.setFooter({
					text: `Requested by ${interaction.user.tag}`,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true })
				})
			interaction.reply({ embeds: [embed] })
		})

	},
};
