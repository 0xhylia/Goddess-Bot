const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);

const ownerId = "547923574833545226";

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`redcafe-docs`)
		.setDescription('Get documentation for the specified option')
        .addStringOption(
            option => option.setName('option')
            .setDescription('The option you want to get documentation for')
            .setRequired(true)
            .addChoices(
				{ name: 'Vtuber Profile Creation', value: 'docs_vtuber_profile' },
                { name: 'Contribute', value: 'docs_contribute' },
			)
        ),
	async execute(interaction) {

        const options = interaction.options.getString('option');

        function createEmbed({ title, description, link }) {
            const embed = new MessageEmbed()
                .setTitle(title)
                .setDescription(`${description} [Click here](${link}) to view the documentation.`)
                .setColor('#0099ff')
                .setTimestamp()
                .setURL(link)
            return embed;
        }

        if (options === 'docs_vtuber_profile') {
        
            const embed = createEmbed({
                title: 'Vtuber Profile Creation',
                description: 'This documentation will help you create a vtuber profile.',
                link: 'https://docs.redcafe.lol/get-started#vtuber-profile'
            })
            interaction.reply({ embeds: [embed], ephemeral: true })

        }

        if (options === 'docs_contribute') {
            
                const embed = createEmbed({
                    title: 'Contribute',
                    description: 'This documentation will help you contribute to the project.',
                    link: 'https://docs.redcafe.lol/how-to-contribute'
                })
                interaction.reply({ embeds: [embed], ephemeral: true })
                
        }

	},
};
