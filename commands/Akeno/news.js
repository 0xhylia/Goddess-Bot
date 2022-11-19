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
            url: 'https://akenodev.xyz/api/v1/news',
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
                        .setStyle('PRIMARY')
                        .setLabel(`${newsArray.indexOf(news) + 1}`)
                        .setCustomId(`news-${newsArray.indexOf(news) + 1}`)
                        .setEmoji('<:discordshop:1020094830451359795>')
                )
            })




            interaction.reply({ embeds: [embed], components: [row] });


            interaction.client.on('interactionCreate', async interaction => {
                if (!interaction.isButton()) return;
                if (interaction.customId.startsWith('news-')) {
                    const newsNumber = interaction.customId.split('-')[1];
                    const news = newsArray[newsNumber - 1];
                    const newsEmbed = new MessageEmbed()
                        .setTitle(`${news.title}`)
                        .setDescription(`${news.description}`)
                        .setColor('PURPLE')
                        .setTimestamp()
                        .setFooter({
                            text: `Akeno News | \©️${new Date().getFullYear()}`,
                            iconURL: interaction.client.users.cache.get(ownerId).displayAvatarURL({ dynamic: true })
                        })

                    
                    const newsImage = news.image.replace('./assets/img/', '');

                    newsEmbed.setImage(`https://akenodev.xyz/assets/img/${newsImage}`);

                    const row2 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle('LINK')
                            .setLabel(`Go to Link`)
                            .setURL(`${news.link}`)
                            .setEmoji('🔗')
                            
                    )

                    interaction.update({ embeds: [newsEmbed], components: [row2, row] });

                }
            })


        })
    },
}
