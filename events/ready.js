let fs = require('fs');
const mongoose = require("mongoose");
const Logger = require('../utils/Logger');
const logger = new Logger({ debug: true });
const axios = require('axios').default;



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
    `https://akenodev.xyz`,
    `https://github.com/akenolol/Goddess-Bot`,
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
		
		 setInterval(() => {

    const options = {
      method: 'GET',
      url: 'https://akenodev.xyz',
    }

    axios.request(options).then(function (response) {
      const status = response.status;

      if (status === 200) {
        client.channels.cache.get('1033922333099970650').setName(`🟢 | akenodev.xyz`);
        logger.info(`akenodev.xyz is online!`);
      }
      if (status === 500) {
        client.channels.cache.get('1033922333099970650').setName(`🟡 | akenodev.xyz`);
        logger.info(`akenodev.xyz is offline!`);
      }
      if (status === 503) {
        client.channels.cache.get('1033922333099970650').setName(`🟠 | akenodev.xyz`);
        logger.info(`akenodev.xyz is temporarily down!`);
      }
    })

  }, 20000);
	},
};
