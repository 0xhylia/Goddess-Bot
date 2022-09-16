const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buildportal")
    .setDescription("Build a portal to another dimension!"),
  async execute(interaction) {
    // Build a portal to another dimension!

    const images = [
      "https://st.depositphotos.com/1722785/4227/i/600/depositphotos_42276667-stock-photo-time-tunnel.jpg",
      "https://geekestateblog.com/wp-content/uploads/2020/04/portal.jpg",
      "https://i.ytimg.com/vi/160GmnKOeps/maxresdefault.jpg",
      "https://web.magellantv.com/A_503_wormhole_illustration_black_hole.jpg.653x0_q80_crop-smart.jpg",
    ];

    const portalGo = ["You Died, When you went through the portal!", "The portal closed on you.", "You got lost in the portal.", "You got sucked into a black hole, when you went through the portal.", "You Arrived at a alien planet.", "You Arrived at a planet with cat girls, and you are a adventurer."];

    const randomParts = portalGo[Math.floor(Math.random() * portalGo.length)]
    const randomPortal = images[Math.floor(Math.random() * images.length)];
    const embed = new MessageEmbed().setTitle(
      `Building a portal to another dimension...`
    );

    interaction.reply({ embeds: [embed] });

    await wait(3000);

    const embed2 = new MessageEmbed()
      .setTitle(`Built a portal to another dimension!`)
      .setImage(randomPortal)
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter({
        text: "Powered By Akeno API",
        iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
      });

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setEmoji("🌐")
        .setLabel("Website")
        .setURL("https://cafe.akenodev.tk")
        .setStyle("LINK"),

      new MessageButton()
        .setCustomId("goThroughPortal")
        .setEmoji("🚪")
        .setLabel("Go Through Portal")
        .setStyle("PRIMARY"),

      new MessageButton()
        .setEmoji("<:EA_partnership:1014193886161281126>")
        .setLabel("Echo Anime")
        .setURL("https://echoanime.xyz")
        .setStyle("LINK")
    );

    interaction.followUp({ embeds: [embed2], components: [row] });

    const filter = (i) => i.customId === "goThroughPortal";

    const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 15000,
        });

    collector.on("collect", async (i) => {
        if (i.customId === "goThroughPortal") {
            await i.update({ components: [] });
            await i.followUp({ content: "Going through portal..." });
            await wait(3000);
            i.followUp({ content: randomParts });
      }
    })

    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        const embed3 = new MessageEmbed()
          .setTitle(`Portal Closed!`)
          .setImage(randomPortal)
          .setColor("RANDOM")
          .setTimestamp()
          .setFooter({
            text: "Powered By Akeno API",
            iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
          });

        interaction.followUp({ embeds: [embed3] });
      } else
      {
        return;
      }

    })
  },
};
