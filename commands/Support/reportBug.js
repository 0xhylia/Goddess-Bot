const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageCollector } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);
const bug = require("../../models/bugs.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reportbug")
    .setDescription("Report a bug to staff")
    .addStringOption((option) =>
      option
        .setName("bug")
        .setDescription("The bug you want to report")
        .setRequired(true)
    )
    .addStringOption((option) => 
      option
        .setName("recreate")
        .setDescription("How to recreate the bug")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Describe the bug")
        .setRequired(true)
    )
    .addAttachmentOption(option => option.setName('attachment').setDescription('Attach a file to your bug report')),
  async execute(interaction) {


    const bug2 = interaction.options.getString("bug");
    const recreate = interaction.options.getString("recreate");
    const attachment = interaction.options.getAttachment("attachment");

    if (attachment) {
     // Check if it is a mp4, mov, png, jpg
      if (!attachment.url.endsWith(".mp4") && !attachment.url.endsWith(".mov") && !attachment.url.endsWith(".png") && !attachment.url.endsWith(".jpg")) {
        return interaction.reply({ content: "Invalid attachment type (mp4, png, mov, jpg)", ephemeral: true });
      }
      if (attachment.size > 8388608) {
        return interaction.reply({
          content: "Your attachment cannot be larger than 8MB",
          ephemeral: true,
        });
      }
    }

    const bugReport = new bug({
      bug: bug2,
      attachment: attachment ? attachment.url : null,
      reCreate: recreate,
      description: interaction.options.getString("description"),
      priority: "LOW",
      status: "OPEN",
      user: {
        username: interaction.user.username,
        id: interaction.user.id,
        avatar: interaction.user.displayAvatarURL(),
      },
      date: new Date().toLocaleString(),
    })
      
    // Save the bug_.id to reportID
    await bugReport.save().then((bug) => {
      const bugEmbed = new MessageEmbed()
    .setTitle("<a:AUtilityPoint:1017782008908357632> Bug Report <a:AUtilityPoint:1017782008908357632>")
      .setDescription(`**Bug:** ${bug2}`)
      .addFields(
        { name: "User", value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: false },
        { name: "ID", value: `${interaction.user.id}`, inline: false },
        { name: "Date", value: `${new Date().toLocaleString()}`, inline: false },
        { name: "Attachment", value: `${attachment ? attachment.url : "None"}`, inline: false },
        { name: "Report ID", value: `${bug._id}`, inline: false },
        { name: "Priority", value: `${bug.priority}`, inline: false },
        { name: "Description", value: `${interaction.options.getString("description")}`, inline: false },
        { name: "How to recreate", value: `${recreate}`, inline: false },
        { name: "Status", value: `${bug.status}`, inline: false },
      )
      .setColor("RED")
      .setTimestamp()
      .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })

    if (attachment) {
      bugEmbed.setImage(attachment.url);
    }

    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setEmoji('🌐')
            .setLabel('Website')
            .setURL("https://akenodev.xyz")
            .setStyle('LINK'),
            new MessageButton()
            .setEmoji("<:EA_partnership:1014193886161281126>")
            .setLabel("Echo Anime")
            .setURL("https://echoanime.xyz")
            .setStyle("LINK"),
            
    );

        // Send the message to the staff channel
        const staffChannel = interaction.client.channels.cache.get("1014190512653209626");
        staffChannel.send({ embeds: [bugEmbed], components: [row] })

        interaction.reply({ content: "Bug report sent!", ephemeral: true });
    })

    

    





  

    

  },
};
