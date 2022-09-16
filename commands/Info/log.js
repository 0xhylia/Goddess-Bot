const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageCollector,
  MessageSelectMenu,
} = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("log")
    .setDescription("Check A User's Log")
    .addUserOption((option) =>
    option.setName("user").setDescription("The user to check").setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const embed = new MessageEmbed()
      .setTitle("User Log")
      .setDescription(`Here is ${user.username}'s log`)
      .setColor("RANDOM");
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Log")
        .setStyle("LINK")
        .setEmoji("📜")
        .setURL(`https://bot.akenodev.xyz/user/${user.id}`)
    );
    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
