const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);

const ownerId = "547923574833545226";


module.exports = {
    data: new SlashCommandBuilder()
        .setName(`akeno-clients`)
        .setDescription("Get a list of Clients Akeno has Worked For."),
    async execute(interaction) {

        const options = {
            method: 'GET',
            url: 'https://akenodev.me/api/v1/clients',
        }

        axios.request(options).then(function (response) {
            const data = response.data;

            const clientsArray = [];

            for (const client in data) {
                clientsArray.push(data[client]);
            }

            const row = new MessageActionRow()
            .addComponents()

            const embed = new MessageEmbed()
                .setTitle(`Akeno Clients List | ${clientsArray.length}`)
                .setDescription(`Here is a list of clients Akeno has worked for!`)
                .setColor('PURPLE')
                .setTimestamp()
                .setFooter({
                    text: `Akeno Clients | \©️${new Date().getFullYear()}`,
                    iconURL: interaction.client.users.cache.get(ownerId).displayAvatarURL({ dynamic: true })
                })

            clientsArray.forEach((client) => {
                embed.addField(`${client.name}`, `⭐ ${client.rating}`);

                row.addComponents(
                    new MessageButton()
                        .setStyle('SECONDARY')
                        .setLabel(`${clientsArray.indexOf(client) + 1}`)
                        .setCustomId(`client-${clientsArray.indexOf(client) + 1}`)
                        .setEmoji('<:stagelogo:1006573321686626354>')
                )
            })




            interaction.reply({ embeds: [embed], components: [row] });



            interaction.client.on('interactionCreate', async interaction => {
                if (!interaction.isButton()) return;

                const client = clientsArray[interaction.customId.split('-')[1] - 1];

                if (!client) return;


                const image = client.image.replace('/assets/img/', '');
                const clientEmbed = new MessageEmbed()
                    .setTitle(`⭐ ${client.rating}`)
                    .setDescription(`${client.discription}`)
                    .setAuthor(`${client.name}`, `https://akenodev.me/assets/img/${image}`, `${client.whois.url}`)
                    .addField(`Is Member in Server`, `${client.isInServer}`)
                    .addField(`Did Member Contribute to Github Repo?`, `${client.didContributeToRepo}`)
                    .addField(`Who is ${client.name}?`, `[${client.whois.name}](${client.whois.url})`)
                    .setColor('PURPLE')
                    .setTimestamp()
                    .setFooter({
                        text: `Akeno Clients | \©️${new Date().getFullYear()}`,
                        iconURL: interaction.client.users.cache.get(ownerId).displayAvatarURL({ dynamic: true })
                    })

                   

                interaction.update({ embeds: [clientEmbed] });
            })


          
          

        })
    },
}
