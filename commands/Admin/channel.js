const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel')
		.setDescription('Channel Options')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('The option you want to use')
                .setRequired(true)
                .addChoices(
                    { name: 'Lock Channel', value: 'lock' },
                    { name: 'Unlock Channel', value: 'unlock' },

                )),
	async execute(interaction) {

        const option = interaction.options.getString('option');
        const channel = interaction.channel;
        const user = interaction.user;

        if (interaction.member.permissions.has('MANAGE_CHANNELS')) 
        {
            const embed = new MessageEmbed()
            .setColor('RED')
            .setTitle(`Choice`)
            .setDescription(`Are you sure you want to ${option} this channel?`)
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('yes')
                .setLabel('Yes')
                .setStyle('SUCCESS'),
                new MessageButton()
                .setCustomId('no')
                .setLabel('No')
                .setStyle('DANGER'),
            );

            interaction.reply({ embeds: [embed], components: [row], ephemeral: false });

            const filter = i => i.customId === 'yes' || i.customId === 'no' && i.user.id === user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'yes') {
                    if (option === 'lock') {
                        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SEND_MESSAGES: false });
                        const embed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle(`Channel Locked`)
                        .setDescription(`This channel has been locked by ${user.tag}`)
                        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp();
                        await i.update({ embeds: [embed], components: [] });
                    } else if (option === 'unlock') {
                        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SEND_MESSAGES: true });
                        const embed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle(`Channel Unlocked`)
                        .setDescription(`This channel has been unlocked by ${user.tag}`)
                        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp();
                        await i.update({ embeds: [embed], components: [] });
                    }
                } else if (i.customId === 'no') {
                    const embed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(`Cancelled`)
                    .setDescription(`The command has been cancelled`)
                    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();
                    await i.update({ embeds: [embed], components: [] });
                }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                const embed = new MessageEmbed()
                .setColor('RED')
                .setTitle(`Cancelled`)
                .setDescription(`The command has been cancelled`)
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();
                interaction.editReply({ embeds: [embed], components: [] });
            }
        })

    }
    else {
        const embed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`Error`)
        .setDescription(`You do not have permission to use this command`)
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

	},
};
