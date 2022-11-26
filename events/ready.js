let fs = require('fs');
const mongoose = require("mongoose");
const Logger = require('../utils/Logger');
const logger = new Logger({ debug: true });
const axios = require('axios').default;
const { MessageEmbed } = require('discord.js');
const versionControl = require('../utils/templates/versionControl');
const { version } = require('../package.json');
const updateChannel = "1024042956069535797";

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

    if (versionControl[version].updateNumber = version) {
      let lastMessage = await client.channels.cache.get(updateChannel).messages.fetch({ limit: 1 });
      let lastMessageContent = lastMessage.first().content;
      let updateNumber = versionControl[version].updateNumber;

      if (lastMessageContent.includes(updateNumber)) {
        logger.warn("The last message in the update channel is the same as the current update, skipping...");

      }
      else {

        const updateEmbed = new MessageEmbed()
            .setColor("#00FF00")
            .setTitle(`Update ${versionControl[version].updateNumber}`)
            .setDescription(versionControl[version].description)
            .setAuthor(versionControl[version].updateAuthor.name, versionControl[version].updateAuthor.avatar, `https://discord.com/users/${versionControl[version].updateAuthor.id}`)
            .setTimestamp()

            versionControl[version].features.forEach(feature => {
                updateEmbed.addField("Feature", feature)
            })
        client.channels.cache.get(updateChannel).send({ embeds: [updateEmbed], content: `New Update! ${versionControl[version].updateNumber}` });
        }
    }

    else {
        throw new Error("The version number in the versionControl.js file does not match the version number in the package.json file.")
    }

	},
};
