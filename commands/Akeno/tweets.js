const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageCollector } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);
const env = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("akeno-tweets")
    .setDescription("Get the latest tweets from Akeno"),
  async execute(interaction) {

    if (!env.twitterToken) throw new Error("No Twitter Token Provided");

    const options = {
        method: "GET",
        url: "https://api.twitter.com/2/users/1500825027553415169/tweets",
        headers: {
            'Authorization': `Bearer ${env.twitterToken}`, 
        }
    }

    axios.request(options).then(function (response) {
        const data = response.data;

        const embed = new MessageEmbed()
            .setTitle(`Akeno's Tweets` + ` - ${interaction.user.username}`)
            .setDescription(`Latest Tweets from Akeno - ${data.meta.result_count} Tweets`)

        
        data.data.forEach(tweet => {
            if (tweet.text.includes("@")) {
                const regex = /(@\w+)/g;
                const matches = tweet.text.match(regex);
                matches.forEach(match => {
                    const username = match.replace("@", "");
                    tweet.text = tweet.text.replace(match, `[${match}](https://twitter.com/${username})`);
                });
            }


            embed.addField(`Tweet by @akeno_dev`, tweet.text);
        })

        const lastTweetID = data.meta.newest_id;

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setURL(`https://twitter.com/akeno_dev/status/${lastTweetID}`)
                .setLabel("View Tweet")
                .setStyle("LINK")
                .setEmoji("🐦")
            )

        interaction.reply({ embeds: [embed], components: [row] });
    })
  },
};
