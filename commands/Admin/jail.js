const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);
const jailedRole = "1019982167239049216";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jail")
    .setDescription("Jail a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to jail")
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("choices")
        .setDescription("The url of the website")
        .setRequired(true)
        .addChoices(
          { name: "Jail User", value: "jail" },
          { name: "UnJail User", value: "unjail" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for jailing the user")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const choice = interaction.options.getString("choices");

    if (choice === "jail") {
      if (interaction.member.permissions.has("MANAGE_MESSAGES")) {
        await interaction.guild.members.cache
          .get(user.id)
          .roles.add(jailedRole);
        const embed = new MessageEmbed()
          .setTitle(`Jailed User ${user.username}`)
          .setDescription(`**User:** ${user}`)
          .setColor("RANDOM")
          .setTimestamp()
          .setFooter({
            text: "Powered By Akeno API",
            iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
          });
        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setEmoji("🌐")
            .setLabel("Website")
            .setURL("https://cafe.akenodev.tk")
            .setStyle("LINK"),
          new MessageButton()
            .setEmoji("<:EA_partnership:1014193886161281126>")
            .setLabel("Echo Anime")
            .setURL("https://echoanime.xyz")
            .setStyle("LINK")
        );

        if (reason) {
          embed.addFields({ name: "Reason", value: reason });
        }

        interaction.reply({ embeds: [embed], components: [row] });
      } else {
        interaction.reply({
          content: "You do not have permission to use this command",
          ephemeral: true,
        });
      }
    }

    if (choice === "unjail") {
        if (interaction.member.permissions.has("MANAGE_MESSAGES")) {
            await interaction.guild.members.cache
            .get(user.id)
            .roles.remove(jailedRole);
            const embed = new MessageEmbed()
            .setTitle(`UnJailed User ${user.username}`)
            .setDescription(`**User:** ${user}`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter({
                text: "Powered By Akeno API",
                iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
            });
            const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setEmoji("🌐")
                .setLabel("Website")
                .setURL("https://cafe.akenodev.tk")
                .setStyle("LINK"),
            new MessageButton()
                .setEmoji("<:EA_partnership:1014193886161281126>")
                .setLabel("Echo Anime")
                .setURL("https://echoanime.xyz")
                .setStyle("LINK")
            );
    
            if (reason) {
            embed.addFields({ name: "Reason", value: reason });
            }
    
            interaction.reply({ embeds: [embed], components: [row] });
        } else {
            interaction.reply({
            content: "You do not have permission to use this command",
            ephemeral: true,
            });
        }
    }
  },
};
