const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageCollector } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);
const vtuberProfile = require("../../models/vtuberProfile");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vtuber-profile-create")
        .setDescription("Create a vtuber profile")
        .addStringOption((option) =>
            option
                .setName("youtube")
                .setDescription("Your youtube channel")
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("twitter")
                .setDescription("Your twitter account")
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("twitch")
                .setDescription("Your twitch account")
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("instagram")
                .setDescription("Your instagram account")
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("tiktok")
                .setDescription("Your tiktok account")
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("discord")
                .setDescription("Your discord account")
                .setRequired(false)
        )
        .addStringOption((option) =>
        option
            .setName("throne")
            .setDescription("Your throne account")
            .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("description")
                .setDescription("Your description")
                .setRequired(false)
        )
        .addAttachmentOption((option) =>
            option
                .setName("banner")
                .setDescription("Your banner")
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("nickname")
                .setDescription("Your nickname")
                .setRequired(false)
        ),
    async execute(interaction) {

        const user = interaction.options.getUser("user") || interaction.user;




        const profile = await vtuberProfile.findOne({ user: user.id });

        if (profile) {
            const embed = new MessageEmbed()
                .setTitle(`Vtuber Profile`)
                .setDescription(`You already have a profile! Use the \`/vtuber-profile\` command to view it!`)
                .setColor("PURPLE")
                .setFooter({
                    text: `Vtuber Profile`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
            return interaction.reply({ embeds: [embed] });
        }


        const youtube = interaction.options.getString("youtube");
        const twitter = interaction.options.getString("twitter");
        const twitch = interaction.options.getString("twitch");
        const instagram = interaction.options.getString("instagram");
        const tiktok = interaction.options.getString("tiktok");
        const discord = interaction.options.getString("discord");
        const description = interaction.options.getString("description");
        const banner = interaction.options.getAttachment("banner");
        const nickname = interaction.options.getString("nickname");
        const throne = interaction.options.getString("throne");




        const data = {
            youtube: youtube || null,
            twitter: twitter || null,
            twitch: twitch || null,
            instagram: instagram || null,
            tiktok: tiktok || null,
            discord: discord || null,
            description: description || null,
            banner: banner || null,
            nickname: nickname || null,
            throne: throne || null,
        }


           

            function checkForPremium() {
                if (interaction.member.roles.cache.has("1014212532715667487")) {
                    return true;
                } else {
                    return false;
                }
            }

            const isPremium = checkForPremium();

            if (!isPremium) {
                if (banner != null) {
                    const embed = new MessageEmbed()
                        .setTitle(`Vtuber Profile`)
                        .setDescription(`You cannot have a banner without being a premium member!`)
                        .setColor("PURPLE")
                        .setFooter({
                            text: `Vtuber Profile`,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                        })
                    return interaction.reply({ embeds: [embed] });
                }

                if (nickname != null) {
                    const embed = new MessageEmbed()
                        .setTitle(`Vtuber Profile`)
                        .setDescription(`You cannot have a nickname without being a premium member!`)
                        .setColor("PURPLE")
                        .setFooter({
                            text: `Vtuber Profile`,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                        })
                    return interaction.reply({ embeds: [embed] });
                }
            }


            const embed = new MessageEmbed()
                .setTitle(`Vtuber Profile`)
                .setDescription(`Does this look correct?`)
                .setColor("PURPLE")
                .setImage(banner ? banner.url : "https://cdn.discordapp.com/attachments/1024095343794720798/1045089019341586500/unknown.png")
                .setFooter({
                    text: `Vtuber Profile`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })

            for (const [key, value] of Object.entries(data)) {
                if (value) {
                    embed.addField(key, value);
                }
            }

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("confirm")
                        .setLabel("Confirm")
                        .setStyle("SUCCESS"),
                    new MessageButton()
                        .setCustomId("cancel")
                        .setLabel("Cancel")
                        .setStyle("DANGER")
                );





            function getCurrentDateInEst() {
                const date = new Date();
                const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "America/New_York" }));
                

            
                return `${utcDate.getMonth() + 1}/${utcDate.getDate()}/${utcDate.getFullYear()}`;


            }

            interaction.reply({ embeds: [embed], components: [row], ephemeral: true });


            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({
                filter,
                time: 15000,
            });


            collector.on("collect", async (i) => {
                if (i.customId === "confirm") {
                    await vtuberProfile.create({
                        userId: user.id,
                        youtube: youtube ? youtube : "None",
                        twitter: twitter ? twitter : "None",
                        twitch: twitch ? twitch : "None",
                        instagram: instagram ? instagram : "None",
                        tiktok: tiktok ? tiktok : "None",
                        discord: discord ? discord : "None",
                        description: description ? description : "Hello, I'm a new Vtuber!",
                        isPremium: checkForPremium(),
                        dateCreated: getCurrentDateInEst(),
                        banner: banner ? banner.url : "https://cdn.discordapp.com/attachments/1024095343794720798/1045089019341586500/unknown.png",
                        nickname: nickname ? nickname : "None",
                        throne: throne ? throne : "None",
                    });

                    const embed = new MessageEmbed()
                        .setTitle(`Vtuber Profile`)
                        .setDescription(`Your profile has been created! Use the \`/vtuber-profile\` command to view it!`)
                        .setColor("PURPLE")
                        .setFooter({
                            text: `Vtuber Profile`,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                        })
                    return i.update({ embeds: [embed], components: [] });
                } else if (i.customId === "cancel") {
                    const embed = new MessageEmbed()
                        .setTitle(`Vtuber Profile`)
                        .setDescription(`Your profile has been cancelled!`)
                        .setColor("PURPLE")
                        .setFooter({
                            text: `Vtuber Profile`,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                        })
                    return i.update({ embeds: [embed], components: [] });
                }

            }
            );
        








    },
};
