const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageCollector } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);
const pollRoll = "1020799539172605972";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wouldyourather")
    .setDescription("Create a would you rather poll")
    .addStringOption((option) =>
        option
            .setName("question_1")
            .setDescription("The first question for the poll")
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName("question_2")
            .setDescription("The second question for the poll")
            .setRequired(true)
    ),
  async execute(interaction) {
    const question1 = interaction.options.getString("question_1");
    const question2 = interaction.options.getString("question_2");
    const embed = new MessageEmbed()
      .setTitle(`Would you rather...`)
      .setDescription(`${question1} or ${question2}`)
      .setColor("PURPLE")
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

      // If the user doesn't have the rollPoll role, return an ephemeral message
        if (!interaction.member.roles.cache.has(pollRoll)) {
            const errorEmbed = new MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`You do not have permission to use this command!`)
                .setColor("RED")
                .addFields(
                    { name: "Required Role", value: `<@&${pollRoll}>` }
                )
                .setTimestamp()
                .setFooter({
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

    interaction.reply({ embeds: [embed], ephemeral: false });
    const message = await interaction.fetchReply();
    message.react("1️⃣");
    message.react("2️⃣");
    

  },
};
