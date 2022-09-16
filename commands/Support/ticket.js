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
const staffRole = "1006948553844850778"

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Create a ticket for support"),
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setTitle("Create a Ticket " + interaction.user.username)
      .setDescription(
        "Please select the type of ticket you would like to create"
      )
      .setColor("RANDOM");


    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("ticketResource")
        .setPlaceholder("Nothing selected")
        .addOptions([
          {
            label: "Echo Anime",
            description: "Report a bug or request a feature for Echo Anime",
            value: "echoanime_option",
          },
          {
            label: "Discord Bot",
            description:
              "Report a bug or request a feature for the Discord Bot",
            value: "discordbot_option",
          },
          {
            label: "Donations",
            description: "Report a bug for Donations",
            value: "donations_option",

          }
        ])
    );

    await interaction.reply({ embeds:[embed], components: [row], ephemeral: true });

    const filter = (i) =>
      i.customId === "ticketResource" && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "ticketResource") {
        if (i.values[0] === "echoanime_option") {
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
              .setColor("RANDOM")
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
                ],
              },
            )
            const embed = new MessageEmbed()
            .setTitle("Ticket")
            .setDescription("Thank you for creating a ticket. Please wait for a staff member to respond.")
            .addFields(
              { name: "Ticket Type", value: "Echo Anime", inline: true },
            )
            .setColor("RANDOM")
            .setTimestamp();
  
          
          await channel.send(`<@&${staffRole}>`).then((msg) => {
            msg.delete();
          })
          await channel.send({ embeds: [embed] }).then(async (msg) => {
            i.reply({ content: `Ticket created! <#${msg.channelId}>`, ephemeral: true });
          })
          }

        }
        if (i.values[0] === "discordbot_option") {
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
              .setColor("RANDOM")
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
                ],
              },
            )
            const embed = new MessageEmbed()
            .setTitle("Ticket")
            .setDescription("Thank you for creating a ticket. Please wait for a staff member to respond.")
            .addFields(
              { name: "Ticket Type", value: "Echo Anime", inline: true },
            )
            .setColor("RANDOM")
            .setTimestamp();
  
          
  
            await channel.send(`<@&${staffRole}>`).then((msg) => {
              msg.delete();
            })
            await channel.send({ embeds: [embed] }).then(async (msg) => {
              i.reply({ content: `Ticket created! <#${msg.channelId}>`, ephemeral: true });
            })
            }





        }
        if (i.values[0] === "donations_option") {
          // Check if a channel with the name 🎟️-${interaction.user.username}-dontations exists
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
              .setColor("RANDOM")
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
                ],
              },
            )
            const embed = new MessageEmbed()
            .setTitle("Ticket")
            .setDescription("Thank you for creating a ticket. Please wait for a staff member to respond.")
            .addFields(
              { name: "Ticket Type", value: "Echo Anime", inline: true },
            )
            .setColor("RANDOM")
            .setTimestamp();
  
          
  
            await channel.send(`<@&${staffRole}>`).then((msg) => {
              msg.delete();
            })
            await channel.send({ embeds: [embed] }).then(async (msg) => {
              i.reply({ content: `Ticket created! <#${msg.channelId}>`, ephemeral: true });
            })
            }

          


        }
      }
    });
  },
};
