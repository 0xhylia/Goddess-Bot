const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription("Get the bot's stats!"),
	async execute(interaction) {

        const channels = await interaction.client.channels.cache.size;
        const uptime = await interaction.client.uptime;
        const ping = await interaction.client.ws.ping;
        const memory = await process.memoryUsage().heapUsed / 1024 / 1024;
        const cpuUsage = await process.cpuUsage().system / 1024 / 1024;
        const cpuUsage2 = await process.cpuUsage().user / 1024 / 1024;

        const embed = new MessageEmbed()
            .setTitle("Bot Stats")
            .setDescription("Here are the bot's stats!")
            .setColor('RANDOM')
            .setTimestamp()
            .addFields(
                { name: 'Channels', value: `${channels}`, inline: true },
                { name: 'Uptime', value: `${uptime}`, inline: true },
                { name: 'Ping', value: `${ping}`, inline: true },
                { name: 'Memory Usage', value: `${memory}`, inline: true },
                { name: 'CPU Usage', value: `${cpuUsage}`, inline: true },
                { name: 'CPU Usage 2', value: `${cpuUsage2}`, inline: true },
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

            interaction.reply({ embeds: [embed] });
	},
};
