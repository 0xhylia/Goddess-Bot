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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("log")
    .setDescription("Check A User's Log")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to check").setRequired(false)
    ),
  async execute(interaction) {

    const user = interaction.options.getUser("user") || interaction.user;

    const options = {
      method: "GET",
      url: `http://localhost:8080/user/${user.id}?log=true`,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "DiscordBot (https://discord.com, 0.0.1)",
      },
    }
  
    try {
      const response = await axios(options);
      const log = response.data.data.split("\n").slice(-10).join("\n");

      const embed = new MessageEmbed()
        .setTitle(`Log for ${user.tag}`)
        .setDescription(`\`\`\`yaml\n${log}\n\`\`\``)
        .setColor("PURPLE")
        .setTimestamp()

        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Log")
            .setStyle("LINK")
            .setEmoji("📜")
            .setURL(`https://bot.akenodev.xyz/user/${user.id}?log=true`)
        );

      interaction.reply({ embeds: [embed], components: [row] });
    }
    catch (err) {
      return interaction.reply({ content: `That User has no logs.` });
    }

  },
};
