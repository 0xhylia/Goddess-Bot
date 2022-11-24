const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageCollector } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);
const vtuberProfile = require("../../models/vtuberProfile");
const { PermissionFlagsBits } = require("discord-api-types/v9");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vtuber-profile-delete")
        .setDescription("Delete your vtuber profile"),
    async execute(interaction) {

        const user = interaction.options.getUser("user") || interaction.user;




        const profile = await vtuberProfile.findOne({ user: user.id });

        if (profile) {
            const embed = new MessageEmbed()
                .setTitle(`Vtuber Profile`)
                .setDescription(`Are you sure you want to delete your profile? This action cannot be undone.`)
                .setColor("PURPLE")
                .setFooter({
                    text: `Vtuber Profile`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
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

                interaction.reply({ embeds: [embed], components: [row] });

                const filter = i => i.customId === 'yes' || i.customId === 'no' && i.user.id === interaction.user.id;

                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

                collector.on('collect', async i => {
                    if (i.customId === 'yes') {
                        await vtuberProfile.deleteOne({ user: user.id });
                        const embed = new MessageEmbed()
                            .setTitle(`Vtuber Profile`)
                            .setDescription(`Your profile has been deleted.`)
                            .setColor("PURPLE")
                            .setFooter({
                                text: `Vtuber Profile`,
                                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                            })
                        return i.update({ embeds: [embed], components: [] });
                    } else if (i.customId === 'no') {
                        const embed = new MessageEmbed()
                            .setTitle(`Vtuber Profile`)
                            .setDescription(`Your profile has not been deleted.`)
                            .setColor("PURPLE")
                            .setFooter({
                                text: `Vtuber Profile`,
                                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                            })
                        return i.update({ embeds: [embed], components: [] });
                    }
                })
        }

        else {
            const embed = new MessageEmbed()
                .setTitle(`Vtuber Profile`)
                .setDescription(`You don't have a profile to delete!`)
                .setColor("PURPLE")
                .setFooter({
                    text: `Vtuber Profile`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        








    },
};
