const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);


module.exports = {
	data: new SlashCommandBuilder()
		.setName(`help`)
		.setDescription('Get help about the bot')
        .addStringOption(option => option.setName('command').setDescription('The command you want help with')),
	async execute(interaction) {
        const clientCommands = interaction.client.commands;
        const command = interaction.options.getString('command');
       

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



        if (!command) {
            
            const embed = new MessageEmbed()
            .setTitle(`Help Menu`)
            .setDescription(`Here is a list of all my commands!`)
            .addFields(
                { name: 'Commands', value: `${clientCommands.map(command => command.data.name).join(' | ')}` },
            )
            .setColor("GREEN")
            .setFooter({
                text: "Powered By Akeno API",
                iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
            })
            .setTimestamp();

            

            interaction.reply({ embeds: [embed], components: [row] });
        }

        if (command) {
            const cmd = clientCommands.get(command);

            if (!cmd) return interaction.reply({ content: `That's not a valid command!`, ephemeral: true });

            const embed = new MessageEmbed()
            .setTitle(`Help Menu`)
            .setDescription(`Here is a list of all my commands!`)
            .addFields(
                { name: 'Name', value: `${cmd.data.name}` },
                { name: 'Description', value: `${cmd.data.description}` },
                { name: 'Options', value: `\u200B` },
            )
            .setColor("GREEN")
            .setFooter({
                text: "Powered By Akeno API",
                iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
            })
            .setTimestamp();


            cmd.data.options.forEach(option => {
                embed.addFields(
                    { name: `${option.name}`, value: `${option.description}` }
                )
            })

            interaction.reply({ embeds: [embed], components: [row]});

        }

	},
};
