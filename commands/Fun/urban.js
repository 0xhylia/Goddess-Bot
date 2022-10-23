const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageCollector,
} = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("urban")
    .setDescription("Search Urban Dictionary!")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Search Urban Dictionary!")
        .setRequired(true)
    ),
  async execute(interaction) {
    const options = {
      method: "GET",
      url: `https://api.urbandictionary.com/v0/define?term=${interaction.options.getString(
        "query"
      )}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios.request(options).then(function (response) {
      const data = response.data;
      const firstdef = data.list[0];
      const embed = new MessageEmbed()
        .setTitle(
          `Urban Dictionary Search Results For: ${interaction.options.getString(
            "query"
          )}`
        )
        .setColor("PURPLE")
        .setDescription(
          `Word: ${firstdef.word}\n Definition: ${firstdef.definition}\n Author: ${firstdef.author}\n Date: ${firstdef.written_on}\n Example: ${firstdef.example}`
        )
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });
      const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setEmoji("🌐")
        .setLabel("Website")
        .setURL("https://akenodev.xyz")
        .setStyle("LINK"),
      new MessageButton()
        .setEmoji("<:EA_partnership:1014193886161281126>")
        .setLabel("Echo Anime")
        .setURL("https://echoanime.xyz")
        .setStyle("LINK"),

        new MessageButton()
          .setEmoji("<:downvote:1015732395741290558>")
          .setLabel(`${firstdef.thumbs_down} Downvotes`)
          .setCustomId("downvote")
          .setStyle("PRIMARY"),

        new MessageButton()
          .setEmoji("<:upvote:1015732381426122765>")
          .setLabel(`${firstdef.thumbs_up} Upvotes`)
          .setCustomId("upvote")
          .setStyle("DANGER")
      );
      interaction.reply({
        embeds: [embed],
        components: [row],
      }); 
    });

    const filter = (i) => i.customId === "upvote" || i.customId === "downvote";

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 86400000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "upvote") {
        await interaction.followUp({
          content: `:warning: You Can Not Upvote: \"${interaction.options.getString(
            "query"
          )}\" :warning:`,
          ephemeral: true,
        });
      } else if (i.customId === "downvote") {
        await interaction.followUp({
          content: `:warning: You Can Not Downvote: \"${interaction.options.getString(
            "query"
          )}\" :warning:`,
          ephemeral: true,
        });
      }
    });
  },
};
