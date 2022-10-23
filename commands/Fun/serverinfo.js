const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);


module.exports = {
	data: new SlashCommandBuilder()
		.setName(`serverinfo`)
		.setDescription('Get info about the server'),
	async execute(interaction) {
        const guild = interaction.guild;

        const options = {
            name: guild.name,
            id: guild.id,
            icon: guild.iconURL({ dynamic: true, size: 512 }),
            createdAt: guild.createdAt,
            owner: guild.ownerId,
            region: guild.region,
            members: guild.memberCount,
            locale: guild.preferredLocale,
            channels: guild.channels.cache.size,
            roles: guild.roles.cache.size,
            emojis: guild.emojis.cache.size,
            boost: guild.premiumSubscriptionCount,
            boostLevel: guild.premiumTier,
            banner: guild.bannerURL({ dynamic: true, size: 512 }),
            description: guild.description,
            verification: guild.verificationLevel,
            features: guild.features,
            rules: guild.rulesChannelId,

        }

        const embed = new MessageEmbed()
            .setTitle(`Server Info` + ` - ${options.name}`)
            .setThumbnail(`${options.icon}`)
            .setAuthor({ name: `${options.name}`, iconURL: `${options.icon}` })
            .addFields(
                { name: 'Name', value: `${options.name}` },
                { name: 'ID', value: `${options.id}` },
                { name: 'Created At', value: `${options.createdAt}` },
                { name: 'Owner', value: `${options.owner}` },
                { name: 'Members', value: `${options.members}` },
                { name: 'Channels', value: `${options.channels}` },
                { name: 'Roles', value: `${options.roles}` },
                { name: 'Emojis', value: `${options.emojis}` },
                { name: 'Boost', value: `${options.boost}` },
                { name: 'Boost Level', value: `${options.boostLevel}` },
                { name: 'Banner', value: `${options.banner}` },
                { name: 'Description', value: `${options.description}` },
                { name: 'Verification', value: `${options.verification}` },
                { name: 'Features', value: `${options.features}` },
                { name: 'Locale', value: `${options.locale}` },
                { name: 'Rules', value: `<#${options.rules}>` },
            )
            .setColor("GREEN")
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setEmoji('🌐')
                    .setLabel('Website')
                    .setURL("https://akenodev.xyz")
                    .setStyle('LINK'),
                   
            );

        interaction.reply({ embeds: [embed], components: [row] });
       


	},
};
