const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('website-data')
		.setDescription('Get data from a website!')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The url of the website')
                .setRequired(true)
                .addChoices(
                    { name: 'Akeno Dev Website', value: 'https://akenodev.tk' },
                    { name: 'Red Cafe Website', value: 'https://cafe.akenodev.tk' },
                    { name: 'Echo Anime Website', value: 'https://echoanime.xyz' },

                )),
        
	async execute(interaction) {
        const url = interaction.options.getString('url');

        const options = {
            method: 'GET',
            url: `${url}`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        axios.request(options).then(function (response) {
            
            const status = response.status;
            const statusText = response.statusText;
            const headers = response.headers;

            const embed = new MessageEmbed()
                .setTitle(`Website Data for ${url}`)
                .setColor('RANDOM')
                .addFields(
                    { name: 'Status', value: `${status} ${statusText}` },
                )

            for (const [key, value] of Object.entries(headers)) {
                embed.addFields(
                    { name: `${key}`, value: `${value}` },
                )
            }
            interaction.reply({ embeds: [embed], ephemeral: true });


            
        }).catch(function (error) {
            console.error(error);

            const embed = new MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`There was an error getting the data from ${url}`)
                .setColor('RED')
                .setTimestamp()
                .setFooter({ text: 'Powered By Akeno API', iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless` });

            interaction.reply({ embeds:[embed], ephemeral: true });

        });
	},
};
