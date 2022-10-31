const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);

const ownerId = "547923574833545226";


module.exports = {
    data: new SlashCommandBuilder()
        .setName(`akeno-projects`)
        .setDescription('Get the latest projects from Akeno.'),
    async execute(interaction) {

        const options = {
            method: 'GET',
            url: 'https://akenodev.xyz/v1/projects',
        }
        //row.addComponents(
        //     new MessageButton()
        //         .setStyle('LINK')
        //         .setLabel(`${project.button.name}`)
        //         .setURL(`${project.button.url}`)
        //         .setEmoji(`<:blueutility4:1017782058321449072>`)
        // )

        axios.request(options).then(function (response) {
            const data = response.data;

            console.log(data);

            const projectArray = [];

            for (const project in data) {
                projectArray.push(data[project]);
            }

            const embed = new MessageEmbed()
                .setTitle(`Akeno Projects`)
                .setDescription(`Get the latest projects from Akeno.`)
                .setColor('PURPLE')
                .setTimestamp()
                .setFooter({
                    text: `Akeno Projects | \©️${new Date().getFullYear()}`,
                    iconURL: interaction.client.users.cache.get(ownerId).displayAvatarURL({ dynamic: true })
                })


            const row = new MessageActionRow()
                .addComponents()

            row.addComponents(
                new MessageSelectMenu()
                    .setCustomId(`projects`)
                    .setPlaceholder('Select an option')
                    .addOptions(
                        projectArray.map((project) => {
                            return {
                                label: project.name,
                                value: project.name,
                            }
                        })
                    )
                            

            )

            projectArray.forEach((project) => {
                const projectRole = project.role.replace(/ /g, " | ").toLowerCase();

                embed.addField(`${project.name}`, `**Role:** ${projectRole}`);


            })




            interaction.reply({ embeds: [embed], components: [row] });


            interaction.client.on('interactionCreate', async (interaction) => {
                if (!interaction.isSelectMenu()) return;

                if (interaction.customId === 'projects') {
                    const project = projectArray.find((project) => project.name === interaction.values[0]);

                    const projectRole = project.role.replace(/ /g, " | ").toLowerCase();

                    const image = project.image.replace('/assets/img/', '');
                    const projectEmbed = new MessageEmbed()
                        .setTitle(`${project.name}`)
                        .setColor('PURPLE')
                        .setTimestamp()
                        .setFooter({
                            text: `Akeno Projects | \©️${new Date().getFullYear()}`,
                            iconURL: interaction.client.users.cache.get(ownerId).displayAvatarURL({ dynamic: true })
                        })
                        .addField(`Role`, `${projectRole}`)
                        .addField(`Link`, `[Click Here](${project.button.url})`)
                        .setThumbnail(`https://akenodev.xyz/assets/img/${image}`)

                    interaction.update({ embeds: [projectEmbed] });
                }
            })




        })
    },
}
