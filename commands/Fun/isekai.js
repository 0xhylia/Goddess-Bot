const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('isekai')
		.setDescription("Get isekai'ed!"),
	async execute(interaction) {

        var tchanServer = "https://discord.gg/VnFeafcxCA";


        const embed = new MessageEmbed()
            .setTitle("Get isekai'ed nerd!")
            .setDescription("Join the [Tchan Server](" + tchanServer + ") to meet who isekai'ed you!")
            .setColor('RANDOM')
            .setTimestamp()
            .setImage("https://wallpaperaccess.com/full/4794720.jpg")
            .setFooter({ text: `Requested by ${interaction.user.tag} || We are not Affiliated with Truck-Chan!`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

            interaction.reply({ embeds: [embed] });

	},
};
