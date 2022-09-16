const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kill')
		.setDescription('Kill Someone!')
        .addUserOption(option => option
                .setName('target')
                .setDescription('Select a user')
                .setRequired(true)),
	async execute(interaction) {

        const user = interaction.options.getUser('target');


        const options = {
            method: 'GET',
            url: 'https://api.waifu.pics/sfw/kill',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        axios.request(options).then(function (response) {
            const data = response.data;
            const embed = new MessageEmbed()
                .setTitle(`${interaction.user.tag} killed ${user.tag}`)
                .setImage(data.url)
                .setColor('RANDOM')
                .setTimestamp()
                .setFooter({ text: 'Powered By Akeno API', iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless` });
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setEmoji('🌐')
                        .setLabel('Website')
                        .setURL("https://cafe.akenodev.tk")
                        .setStyle('LINK'),
                        new MessageButton()
                        .setEmoji("<:EA_partnership:1014193886161281126>")
                        .setLabel("Echo Anime")
                        .setURL("https://echoanime.xyz")
                        .setStyle("LINK"),
                        
                );
            interaction.reply({ embeds: [embed], components: [row] });

        })

       


	},
};
