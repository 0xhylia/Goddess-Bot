const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageCollector } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vtuber-supported")
    .setDescription("Get the vtubers that we support"),
  async execute(interaction) {
    const users = {
        "Truck-Chan": "https://www.twitch.tv/truckchanvtuber",
        "CottonTailVa": "https://www.twitch.tv/cottontailva",
        "HextraSpectra": "https://www.twitch.tv/hextraspectra",
        "Minx_Milk": "https://www.twitch.tv/minx_milk",
        "FurdoxYT": "https://www.twitch.tv/furdoxyt",
        "Meow Moonified": "https://www.twitch.tv/meowmoonified",
    }

    const embed = new MessageEmbed()
        .setTitle(`Supported Vtubers` + ` - ${interaction.user.username}`)
        .setDescription("Please Note: We are not Partnered with any of these content creators!")
        .setColor("PURPLE")
        .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })

    for (const [key, value] of Object.entries(users)) {
        embed.addFields(
            { name: `**${key}: **`, value: `[${key}'s Twitch](${value})`, inline: true },
        )
    }

    interaction.reply({ embeds: [embed] });
  },
};
