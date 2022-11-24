const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageCollector, MessageAttachment } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);
const vtuberProfile = require("../../models/vtuberProfile");
const Converter = require("../../utils/converter");
const converter = new Converter();

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

        const user = interaction.options.getUser("user") || interaction.user; // Get the user from the interaction options
        const profile = await vtuberProfile.findOne({ userId: user.id }); // Find the vtuber profile in the database

        function createErrorEmbed(errorDescription, errorTitle) {
            const errorEmbed = new MessageEmbed()
                .setColor("#FF0000")
                .setTitle(errorTitle)
                .setDescription(`${errorDescription}`)
                .setTimestamp();
            return errorEmbed;
        }


        if (!profile) {
            if (user.id === interaction.user.id) {
                const errorEmbed = createErrorEmbed("You don't have a profile yet! Use the \`/vtuber-profile-create\` command to create one!", "Error");
                return interaction.reply({ embeds: [errorEmbed] });
            }
            const errorEmbed = createErrorEmbed("This user doesn't have a profile yet!", "Error");
            return interaction.reply({ embeds: [errorEmbed] });
           
        }

        console.log(profile);
        const vtuberEmbed = new MessageEmbed()
            .setColor("#FF0000")
            .setImage(profile.banner)

            if (profile.youtube != "None") vtuberEmbed.addField(`<:youtube:1045085672958087299> Youtube`, `[${profile.youtube}](https://youtube.com/@${profile.youtube})`, true);
            if (profile.twitter != "None") vtuberEmbed.addField(`<:twitterlogo:1006573319522357289> Twitter`, `[${profile.twitter}](https://twitter.com/${profile.twitter})`, true);
            if (profile.twitch != "None") vtuberEmbed.addField(`<:twitch:1045085652343066674> Twitch`, `[${profile.twitch}](https://www.twitch.tv/${profile.twitch}/profile)`, true);
            if (profile.instagram != "None") vtuberEmbed.addField(`<:instagram:1045085194878730260> Instagram`, `[${profile.instagram}](https://www.instagram.com/${profile.instagram})`, true);
            if (profile.tiktok != "None") vtuberEmbed.addField(`<:tiktoklogo:1006573320684191745> Tiktok`, `[${profile.tiktok}](https://tiktok.com/@${profile.tiktok})`, true);
            if (profile.discord != "None") vtuberEmbed.addField(`<:discord:996939280205217862> Discord`, profile.discord, true);
            if (profile.description) vtuberEmbed.setDescription(profile.description);
            if (profile.isPremium) vtuberEmbed.addField(`<:verified:996939278485561424> Premium`, `Yes`, true);
            if (profile.isStaff) vtuberEmbed.addField(`<:moderator:996939276426162226> Staff`, `Yes`, true);
            if (profile.throne != "None") vtuberEmbed.addField(`🎁 Throne`, `[${profile.throne}](https://throne.me/u/${profile.throne})`, true);
            if (profile.vtuberModal != "None") vtuberEmbed.setThumbnail(profile.vtuberModal);
            if (profile.nickname != "None") {
                vtuberEmbed.addField(`<:ticketbadge:1020094894540337232> Nickname`, profile.nickname, true);
                vtuberEmbed.setTitle(`Vtuber Profile for ${user.username} (${profile.nickname})`);
            }
            else vtuberEmbed.setTitle(`Vtuber Profile for ${user.username}`);


        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("getXml")
                    .setLabel("Export to XML")
                    .setStyle("PRIMARY"),

            );

        interaction.reply({ embeds: [vtuberEmbed], components: [row] });

        const filter = (i) => i.customId === "getXml" && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on("collect", async (i) => {
            if (i.customId === "getXml") {
                const xml = converter.convertVtuberProfileToXml(profile)
                
                // Send the xml as a file
                const attachment = new MessageAttachment(Buffer.from(xml), "profile.xml");
            
                await i.deferUpdate();
                await i.followUp({ files: [attachment], ephemeral: true });

            }
        })

    },
};
