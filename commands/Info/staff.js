const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageCollector } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("staff")
    .setDescription("Get the staff of the server"),
  async execute(interaction) {

    // console.log(staffRole)
    await interaction.guild.members.fetch() //cache all members in the server
    const role = interaction.guild.roles.cache.find(role => role.id === "981632156809981952") //the role to check
    const totalStaff = role.members.map(m => m.id) // array of user IDs who have the role
    const totalMembers = totalStaff.length // how many users have the role

    const embed = new MessageEmbed()
        .setTitle(`Staff` + ` - ${interaction.user.username}`)
        .addFields(
            { name: 'Total Staff', value: `${totalMembers}` },
        )
        .setColor("PURPLE")
        .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setEmoji('🌐')
                .setLabel('Website')
                .setURL("https://akenodev.xyz")
                .setStyle('LINK'),
               
        );
        for (const member of totalStaff) {
            const user = await interaction.guild.members.fetch(member)
            embed.addFields(
                { name: '**Staff: **', value: `<@!${user.user.id}>`, inline: true },
            )
        }
    interaction.reply({ embeds: [embed], components: [row] });
  },
};
