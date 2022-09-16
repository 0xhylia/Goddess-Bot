const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a user from the server!')
        .addUserOption(option => option.setName('user').setDescription('The user to kick').setRequired(true)),
	async execute(interaction) {
        const user = interaction.options.getUser('user');

        if (interaction.member.permissions.has('BAN_MEMBERS')) 
        {
            interaction.guild.members.kick(user);
            const embed = new MessageEmbed()
                .setTitle(`User Kicked`)
                .setDescription(`**User:** ${user}`)
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
        }
        else
        {
            interaction.reply({ content: `You do not have permission to **KICK** members!`, ephemeral: true });
        }
	},
};
