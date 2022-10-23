const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageCollector,
  MessageSelectMenu,
} = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);
const bug = require("../../models/bugs.js");
const staffRole = "1014531229212737626"

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Create a ticket for support"),
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setTitle("<:ticketbadge:1020094894540337232> Create a Ticket <:ticketbadge:1020094894540337232>")
      .setDescription(
        "Please select the type of ticket you would like to create"
      )
      .setColor("PURPLE");


    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("ticketResource")
        .setPlaceholder("Nothing selected")
        .addOptions([
          {
            label: "Echo Anime",
            description: "Report a bug or request a feature for Echo Anime",
            value: "echoanime_option",
            emoji: "📺",
          },
          {
            label: "Discord Bot",
            description:
              "Report a bug or request a feature for the Discord Bot",
            value: "discordbot_option",
            emoji: "🤖",
          },
          {
            label: "Website",
            description: "Report a bug or request a feature for the Website",
            value: "website_option",
            emoji: "🌐",
          },
          {
            label: "Premium",
            description: "Report a bug or request a feature for Premium",
            value: "premium_option",
            emoji: "<:diamond:1024009055729102919>",
          },
          {
            label: "Other", 
            description: "Report a bug or request a feature for something else",
            value: "other_option",
            emoji: "❓", 
          }
        ])
    );

    await interaction.reply({ embeds:[embed], components: [row], ephemeral: true });


    const filter = (i) =>
      i.customId === "ticketResource";
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "ticketResource") {
        let ticketType = i.values[0];
        let ticketTypeLabel = i.values[0].split("_")[0];

        const userTicketChannel = interaction.guild.channels.cache.find(
          (channel) =>
            channel.name ===
            `🎟️-${interaction.user.username}`,
        );


        if (userTicketChannel) {
             const embed = new MessageEmbed()
            .setTitle("Ticket")
            .setDescription(
              "You already have a ticket open. Please wait for a staff member to respond."
            )
            .setColor("PURPLE")
            .setTimestamp();

          await i.reply({ embeds: [embed], ephemeral: true });
        }

        else {
          const channel = await interaction.guild.channels.create(
            `🎟️-${interaction.user.username}`,
            {
              type: "GUILD_TEXT",
              permissionOverwrites: [
                {
                  id: interaction.guild.roles.everyone,
                  deny: ["VIEW_CHANNEL"],
                },
                {
                  id: interaction.user.id,
                  allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                },
                {
                  id: staffRole,
                  allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                },
              ],

            },
          )
          const embed = new MessageEmbed()
          .setTitle("Ticket")
          .setDescription("Thank you for creating a ticket. Please wait for a staff member to respond.")
          .addFields(
            { name: "Ticket Type", value: `${ticketTypeLabel}`, inline: true },
          )
          .setColor("PURPLE")
          .setTimestamp();

        
        await channel.send(`<@&${staffRole}>`).then((msg) => {
          msg.delete();
        })
        await channel.send({ embeds: [embed] }).then(async (msg) => {
          i.reply({ content: `Ticket created! <#${msg.channelId}>`, ephemeral: true });
        })
        }
      }
    });
  },
};



