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
    .setName("ping")
    .setDescription("Check the bot's ping"),
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setTitle("Pong!")
      .setDescription(`Pong! ${interaction.client.ws.ping}ms`)
      .setColor("RANDOM");
    await interaction.reply({ embeds: [embed] });

  },
};
