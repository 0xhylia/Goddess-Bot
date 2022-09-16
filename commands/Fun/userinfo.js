const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get info about a user")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to get info about")
    ),
  async execute(interaction) {
    const member = interaction.options.getMember("user") || interaction.member;

    const options = {
      avatar: member.user.displayAvatarURL({ dynamic: true, size: 512 }),
      username: member.user.username,
      discriminator: member.user.discriminator,
      id: member.user.id,
      bot: member.user.bot,
      createdAt: member.user.createdAt,
      joinedAt: member.joinedAt,
      roles: member.roles.cache.map((role) => role.toString()).join(" | "),
      permissions: member.permissions.toArray().join(" \n "),
      nickname: member.nickname,
      status: member.presence.status,
      activities: member.presence.activities,
    };

    const embed = new MessageEmbed()
      .setTitle(`User Info` + ` - ${options.username}`)
      .setThumbnail(`${options.avatar}`)
      .setAuthor({ name: `${options.username}`, iconURL: `${options.avatar}` })
      .addFields(
        {
          name: "Username",
          value: `${options.username}#${options.discriminator}`,
        },
        { name: "ID", value: `${options.id}` },
        { name: "Bot", value: `${options.bot}` },
        { name: "Created At", value: `${options.createdAt}` },
        { name: "Joined At", value: `${options.joinedAt}` },
        { name: "Roles", value: `${options.roles}` },
        { name: "Nickname", value: `${options.nickname}` }
      )
      .setColor("GREEN")
      .setFooter({
        text: "Powered By Akeno API",
        iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
      })
      .setTimestamp();


    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setEmoji("🌐")
        .setLabel("Website")
        .setURL("https://cafe.akenodev.tk")
        .setStyle("LINK"),
      new MessageButton()
        .setEmoji("<:EA_partnership:1014193886161281126>")
        .setLabel("Echo Anime")
        .setURL("https://echoanime.xyz")
        .setStyle("LINK")
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
