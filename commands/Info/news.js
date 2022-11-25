const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageCollector, MessageSelectMenu } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);
const news = require("../../utils/templates/news.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("news")
    .setDescription("Get the latest news for anything!")
    .addStringOption((option) =>
        option
            .setName("query")
            .setDescription("The query to search for")
            .setRequired(true)
    ),
  async execute(interaction) {
  
    const query = interaction.options.getString("query");

    let newsItems = [];

    for (const item in news) {
        if (news[item]._dataQuery.includes(query)) {
            newsItems.push(news[item]);
        }
    }

    if (newsItems.length === 0) {
        const embed = new MessageEmbed()
            .setTitle("<:Red:1024702464362020945> No results found! <:Red:1024702464362020945>")
            .setDescription("Sorry, but we couldn't find any results for your query.")
            .setColor("RED");
        return interaction.reply({ embeds: [embed], ephemeral: true });

    }


    const embeds = [];


    for (const item in newsItems) {
        const embed = new MessageEmbed()
        .setTitle(newsItems[item].title) 
        .setDescription(newsItems[item].description)
        .setURL(newsItems[item].url)
        .setImage(newsItems[item].image)
        .setFooter(`Posted on ${newsItems[item]._date}`)
        .setColor("RANDOM");

        embeds.push(embed);
    }

    const normalEmbed = new MessageEmbed()
    .setTitle("News")
    .setDescription("Select a news item to view")
    .setColor("RANDOM");



    const row = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
        .setCustomId("news")
        .setPlaceholder("Select a news item")
        .addOptions(
            embeds.map((embed, index) => {
                return {
                    label: embed.title,
                    description: "Select this to view the news item",
                    value: index.toString(),
                };
            })
        )
    );

    await interaction.reply({ embeds: [normalEmbed], components: [row] });


    const filter = (i) => i.customId === "news" && i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({ filter, time
    : 60000 });

    collector.on("collect", async (i) => {
        await i.deferUpdate();

        await interaction.editReply({ embeds: [embeds[parseInt(i.values[0])]], ephemeral: true });
    });

    collector.on("end", async (i) => {
        await interaction.editReply({ components: [] });
    }
    );
    
   

  },
};
