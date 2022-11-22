const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageCollector } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("support")
        .setDescription("Support us!"),

    async execute(interaction) {


        const embed = new MessageEmbed()
            .setTitle(`Support Us!` + ` - ${interaction.user.username}`)
            .setColor("PURPLE")
            .addFields(
                { name: `**Patreon:**`, value: `[Patreon](https://www.patreon.com/akenodev)`, inline: true },
                { name: `**Ko-Fi:**`, value: `[Ko-Fi](https://ko-fi.com/akenodev)`, inline: true },
                { name: `**Bitcoin:**`, value: "```bc1qdge6g43jj4ku3sz9qj0sdhq9zw6xaxt54xt9d3```", inline: false },
                { name: `**Ethereum:**`, value: "```0x1a56A63Fe9F6F7b800d8a26274fa92F3eb243Ba5```", inline: false },
            )

            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        

        interaction.reply({ embeds: [embed], ephemeral: true });


    },
};
