const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a user from the server!')
        .addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the ban').setRequired(true)),
	async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        if (interaction.member.permissions.has('BAN_MEMBERS')) 
        {
            interaction.guild.members.ban(user, { reason: reason });
            const embed = new MessageEmbed()
                .setTitle(`User Banned`)
                .setTitle(`<a:EA_animeban:1021815781945786408> User Banned <a:EA_animeban:1021815781945786408>`)
                .setColor('RANDOM')
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setEmoji('🌐')
                        .setLabel('Website')
                        .setURL("https://akenodev.xyz")
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
            interaction.reply({ content: `You do not have permission to **BAN** members!`, ephemeral: true });
        }
	},
};
