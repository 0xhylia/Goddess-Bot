const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('webstats')
		.setDescription("Get the stats of a website")
        .addStringOption(option =>
            option.setName('website')
                .setDescription('The website you want to get the stats of')
                .setRequired(true)
                .addChoices(
                    {
                        name: 'AkenoDev',
                        value: 'https://akenodev.me'
                    },
                    {
                        name: 'Red Cafe',
                        value: 'https://site.redcafe.lol'
                    }
                )),
	async execute(interaction) {

     const website = interaction.options.getString('website');

     const options = {
            method: 'GET',
            url: `${website}`,

     }

        axios.request(options).then(function (response) { 
            const stats = {
                200: "<:Green:1024702462826913833>",
                400: "<:Red:1024702464362020945>",
                500: "<:Yellow:1024702465607733419>",
            }

            const embed = new MessageEmbed()
            .setTitle(`Website Stats`)
            .setDescription(`Here are the stats of ${website}`)
            .addFields(
                { name: 'Status', value: `${stats[response.status]}` },
                { name: 'Response Size', value: `${response.headers['content-length']}` },
                { name: 'Date', value: `${response.headers.date}` },
            )
            .setColor("GREEN")
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })

            interaction.reply({ embeds: [embed] });
        })
	},
};
