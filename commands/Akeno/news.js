const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);

const ownerId = "547923574833545226";


module.exports = {
    data: new SlashCommandBuilder()
        .setName(`akeno-news`)
        .setDescription('Get the latest news from Akeno.'),
    async execute(interaction) {

        const options = {
            method: 'GET',
            url: 'https://akenodev.xyz/api/news',
        }

        axios.request(options).then(function (response) {
            const data = response.data;

            const newsArray = [];

            for (const news in data) {
                newsArray.push(data[news]);
            }

            const embed = new MessageEmbed()
               .setTitle(`Akeno News`)
                .setDescription(`Here is the latest news from Akeno!`)
                .setColor('PURPLE')
                .setTimestamp() 
                .setFooter({
                    text: `Akeno News | \©️${new Date().getFullYear()}`,
                    iconURL: interaction.client.users.cache.get(ownerId).displayAvatarURL({ dynamic: true })
                })

                newsArray.forEach((news) => {
                    embed.addField(`${news.title} || ${news.date}`, `${news.description}`);
                })

                const row = new MessageActionRow()
                .addComponents()

                newsArray.forEach((news) => {
                    row.addComponents(
                        new MessageButton()
                            .setStyle('LINK')
                            // Set the label to the number of the news
                            .setLabel(`${newsArray.indexOf(news) + 1}`)
                            .setURL(`${news.link}`)
                            //.setEmoji('🔗')
                            .setEmoji('<:discordshop:1020094830451359795>')
                    )
                })

            
                interaction.reply({ embeds: [embed], components: [row]});


        })
    },
}