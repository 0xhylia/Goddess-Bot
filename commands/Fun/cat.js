const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('Get a random cat image!'),
	async execute(interaction) {


        const options = {
            method: 'GET',
            url: 'https://aws.random.cat/meow',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        axios.request(options).then(function (response) {
            const data = response.data;
            const embed = new MessageEmbed()
                .setTitle(`Cat Image`)
                .setImage(data.file)
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
