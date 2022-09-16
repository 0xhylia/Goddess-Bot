const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);

const ownerId = "547923574833545226";

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`botinfo`)
		.setDescription('Get info about the bot'),
	async execute(interaction) {

        const owner = interaction.client.users.cache.get(ownerId);
        const bot = interaction.client.user;

        const ownerOptions = {
            name: owner.username,
            id: owner.id,
            tag: owner.tag,
            iconURL: owner.displayAvatarURL({ dynamic: true }),
            url: `https://discord.com/users/${ownerId}`,
            createdAt: owner.createdAt
        }

        const botOptions = {
            name: bot.username,
            id: bot.id,
            tag: bot.tag,
            iconURL: bot.displayAvatarURL({ dynamic: true }),
            url: `https://discord.com/users/${bot.id}`,
            createdAt: bot.createdAt
        }

        const botEmbed = new MessageEmbed()
            .setTitle(`${botOptions.name} Info`)
            .setColor('RANDOM')
            .setThumbnail(botOptions.iconURL)
            .setDescription(`**Bot Name:** ${botOptions.name}\n**Bot ID:** ${botOptions.id}\n**Bot Tag:** ${botOptions.tag}\n**Bot Created At:** ${botOptions.createdAt}\n**Bot Owner:** ${ownerOptions.name}\n**Bot Owner ID:** ${ownerOptions.id}\n**Bot Owner Tag:** ${ownerOptions.tag}\n**Bot Owner Created At:** ${ownerOptions.createdAt}`)
            .setTimestamp()
            .setFooter({ text: 'Powered By Akeno API', iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless` })

        const ownerEmbed = new MessageEmbed()
            .setTitle(`${ownerOptions.name} Info`)
            .setColor('RANDOM')
            .setThumbnail(ownerOptions.iconURL)
            .setDescription(`**Owner Name:** ${ownerOptions.name}\n**Owner ID:** ${ownerOptions.id}\n**Owner Tag:** ${ownerOptions.tag}\n**Owner Created At:** ${ownerOptions.createdAt}`)
            .setTimestamp()
            .setFooter({ text: 'Powered By Akeno API', iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless` })

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

        interaction.reply({ embeds: [botEmbed, ownerEmbed], components: [row] });
	},
};
