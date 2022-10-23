const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageCollector,
    MessageSelectMenu,
    Modal,
    TextInputComponent
} = require("discord.js");
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);
const staffChannelId = "1014190512653209622"

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`staff-applications`)
        .setDescription('Apply to become a staff member!'),
    async execute(interaction) {

        const modal = new Modal()
        .setCustomId('myModal')
        .setTitle('Staff Application');
    const memberFor = new TextInputComponent()
    .setCustomId('memberfor')
        .setLabel("How long have you been in this server?")
        .setStyle('SHORT');
    const reason = new TextInputComponent()
        .setCustomId('reason')
        .setLabel("Why do you want to become a staff member?")
        .setStyle('PARAGRAPH');

    const question1 = new TextInputComponent()
        .setCustomId('question1')
        .setLabel("What would you do to improve the server?")
        .setStyle('PARAGRAPH');
    
    const question2 = new TextInputComponent()
        .setCustomId('question2')
        .setLabel("What is teamwork to you?")
        .setStyle('SHORT');

    const modEX = new TextInputComponent()
        .setCustomId('modEX')
        .setLabel("Do you have any moderating experience?")
        .setStyle('SHORT');

    const firstActionRow = new MessageActionRow().addComponents(memberFor);
 
    const secondActionRow = new MessageActionRow().addComponents(reason);

    const thirdActionRow = new MessageActionRow().addComponents(question1);

    const fourthActionRow = new MessageActionRow().addComponents(question2);

    const fifthActionRow = new MessageActionRow().addComponents(modEX);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

    await interaction.showModal(modal);




    interaction.client.on('interactionCreate', async interaction => {
        if (interaction.customId === 'myModal') {


            // const favoriteColor = interaction.components[0].components[0];
            // const hobbies = interaction.components[1].components[1];

            const memberFor = interaction.fields.getTextInputValue('memberfor');
            const reason = interaction.fields.getTextInputValue('reason');
            const question1 = interaction.fields.getTextInputValue('question1');
            const question2 = interaction.fields.getTextInputValue('question2');
            const modex = interaction.fields.getTextInputValue('modEX');

            console.log({
                memberFor,
                reason,
                question1,
                question2,
                modex
            });

            const embed = new MessageEmbed()
                .setTitle('Staff Application')
                .setDescription("We have received your application! We will get back to you as soon as possible!")
                .setColor('RANDOM')
                .setTimestamp()
                .setFooter({
                    text: `Application by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .addFields(
                    { name: '>> ``Member for``', value: `**${memberFor}**`, inline: false},
                    { name: '>> ``Reason``', value: `**${reason}**`, inline: false},
                    { name: '>> ``Question 1``', value: `**${question1}**`, inline: false},
                    { name: '>> ``Question 2``', value: `**${question2}**`, inline: false},
                    { name: '>> ``Moderating Experience``', value: `**${modex}**`, inline: false},
                )

            
                interaction.reply({ embeds: [embed], ephemeral: true });

                const staffChannel = interaction.client.channels.cache.get(staffChannelId);
                const staffEmbed = new MessageEmbed()
                    .setTitle('Staff Application')
                    .setColor('RANDOM')
                    .setTimestamp()
                    .setFooter({
                        text: `Application by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    })
                    .addFields(
                        { name: '>> ``Member for``', value: `**${memberFor}**`, inline: false},
                        { name: '>> ``Reason``', value: `**${reason}**`, inline: false},
                        { name: '>> ``Question 1``', value: `**${question1}**`, inline: false},
                        { name: '>> ``Question 2``', value: `**${question2}**`, inline: false},
                        { name: '>> ``Moderating Experience``', value: `**${modex}**`, inline: false},
                    )
                staffChannel.send({ embeds: [staffEmbed] });


        }

    })


},
};
