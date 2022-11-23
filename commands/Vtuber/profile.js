const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageCollector, Modal, TextInputComponent } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);
const vtuberProfile = require("../../models/vtuberProfile");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vtuber-profile")
        .setDescription("View or edit your vtuber profile")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user you want to view")
                .setRequired(false)
        ),
    async execute(interaction) {

        const user = interaction.options.getUser("user") || interaction.user;


            const profile = await vtuberProfile.findOne({ user: user.id });

            if (!profile) {
                const embed = new MessageEmbed()
                    .setTitle(`Vtuber Profile`)
                    .setDescription(`You don't have a profile yet! Use the \`/vtuber-profile-create\` command to create one!`)
                    .setColor("PURPLE")
                    .setFooter({
                        text: `Vtuber Profile`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                return interaction.reply({ embeds: [embed] });
            }

            const embed = new MessageEmbed()
                .setColor("PURPLE")
                .setImage(profile.banner)
                .setFooter({
                    text: `Vtuber Profile`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })

            if (profile.youtube != "None") embed.addField(`<:youtube:1045085672958087299> Youtube`, profile.youtube, true);
            if (profile.twitter != "None") embed.addField(`<:twitterlogo:1006573319522357289> Twitter`, profile.twitter, true);
            if (profile.twitch != "None") embed.addField(`<:twitch:1045085652343066674> Twitch`, profile.twitch, true);
            if (profile.instagram != "None") embed.addField(`<:instagram:1045085194878730260> Instagram`, profile.instagram, true);
            if (profile.tiktok != "None") embed.addField(`<:tiktoklogo:1006573320684191745> Tiktok`, profile.tiktok, true);
            if (profile.discord != "None") embed.addField(`<:discord:996939280205217862> Discord`, profile.discord, true);
            if (profile.description) embed.setDescription(profile.description);
            if (profile.isPremium) embed.addField(`<:verified:996939278485561424> Premium`, `Yes`, true);
             if (profile.throne != "None") embed.addField(`🎁 Throne`, profile.throne, true);
            if (profile.nickname != "None") {
                embed.addField(`<:ticketbadge:1020094894540337232> Nickname`, profile.nickname, true);
                embed.setTitle(`Vtuber Profile for ${user.username} (${profile.nickname})`);
            }
            else embed.setTitle(`Vtuber Profile for ${user.username}`);

            


            return interaction.reply({ embeds: [embed] });
                  
        

    },
};
