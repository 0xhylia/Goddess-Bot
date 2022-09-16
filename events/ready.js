let fs = require('fs');
const mongoose = require("mongoose");
const { clientId, token, mongo, stripeKey } = require("../config.json");
const Logger = require('../utils/Logger');
const logger = new Logger({ debug: true });


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
    `red cafe server members`,
    `anime with akeno`,
    `https://cafe.akenodev.tk`,
    `reddit.com/r/echoanimeofficial`,
    `https://cafe.akenodev.tk/invite`,
    `https://cafe.akenodev.tk/mod`,
    `https://cafe.akenodev.tk/partner`,
  ];

  setInterval(() => {
    const index = Math.floor(Math.random() * (activitiesList.length - 1) + 1);
    const activity = activitiesList[index];
    client.user.setActivity(`${activity}`, {
      type: "STREAMING",
      url: "https://twitch.tv/monstercat",
    });
  }, 5000);


  // Connect to the database
  mongoose.connect(mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));

  db.once("open", () => {
    logger.info("Connected to the database!");
  });
 

	},
};