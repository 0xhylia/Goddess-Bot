let fs = require('fs');
const mongoose = require("mongoose");
const Logger = require('../utils/Logger');
const logger = new Logger({ debug: true });
const axios = require('axios').default;
const { MessageEmbed } = require('discord.js');
const versionControl = require('../utils/templates/versionControl');
const { version } = require('../package.json');
const updateChannel = process.env.updateChannel;

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        console.clear();
        logger.info(`Logged in as ${client.user.tag}!`);

  // Get the amount of commands the bot has
  let commands = client.commands.size;

  const activitiesList = [
    `${commands} Commands`,
    `with ${client.users.cache.size} users`,
    `https://akenodev.me`,
    `https://github.com/akenolol/Goddess-Bot`,
    `/help`
  ];

  setInterval(() => {
    const index = Math.floor(Math.random() * (activitiesList.length - 1) + 1);
    const activity = activitiesList[index];
    client.user.setActivity(`${activity}`, {
      type: "STREAMING",
      url: "https://twitch.tv/akenodevlol",
    });
  }, 5000);


  // Connect to the database
  mongoose.connect(process.env.mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));

  db.once("open", () => {
    logger.info("Connected to the database!");
  });

    // Check if updateChannel contains versionControl.updateNumber
    const channel = client.channels.cache.get(updateChannel);
    const messages = await channel.messages.fetch();
    const message = messages.find((m) => m.content.includes(versionControl.updateNumber));
    if (!message) {
        // If it doesn't, send a new message
        const embed = new MessageEmbed()
            .setTitle(versionControl.title)
            .setDescription(versionControl.description)
            .setAuthor(versionControl.updateAuthor.name, versionControl.updateAuthor.avatar, `https://discord.com/users/${versionControl.updateAuthor.id}`)
            .setFooter(`Update ${versionControl.updateNumber} | ${versionControl._date}`)
            

        versionControl.features.forEach((feature) => {
            embed.addField("Feature", `<:9919discordinfo:1047563078029541386> ${feature}`);
        })
        channel.send({
            embeds: [embed],
            content: `New Update! ${versionControl.updateNumber}`,
        })
    }
    else {
        logger.warn(`Update ${versionControl.updateNumber} already exists in ${channel.name}!`)
    }

	},
};
