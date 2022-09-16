const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageCollector } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("staff")
    .setDescription("Get the staff of the server"),
  async execute(interaction) {

    // const staffRole = interaction.guild.roles.cache.find(role => role.name === "tech");
    // console.log(staffRole)
    await interaction.guild.members.fetch() //cache all members in the server
    const role = interaction.guild.roles.cache.find(role => role.name === "tech") //the role to check
    const totalStaff = role.members.map(m => m.id) // array of user IDs who have the role
    const totalMembers = totalStaff.length // how many users have the role

    const embed = new MessageEmbed()
        .setTitle(`Staff` + ` - ${interaction.user.username}`)
        .addFields(
            { name: 'Total Staff', value: `${totalMembers}` },
        )
        .setColor("RANDOM")
        .setFooter({
            text: "Powered By Akeno API",
            iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
        })
        .setTimestamp();
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setEmoji('🌐')
                .setLabel('Website')
                .setURL("https://cafe.akenodev.tk")
                .setStyle('LINK'),
                new MessageButton()
                .setEmoji("<:EA_partnership:1014193886161281126>")
                .setLabel("Echo Anime")
                .setURL("https://echoanime.xyz")
                .setStyle("LINK"),
        );
        for (const member of totalStaff) {
            const user = await interaction.guild.members.fetch(member)
            embed.addFields(
                { name: '**Staff: **', value: `<a:eray:1017782114873249834>: <@!${user.user.id}>`, inline: true },
            )
        }
    interaction.reply({ embeds: [embed], components: [row] });
  },
};
