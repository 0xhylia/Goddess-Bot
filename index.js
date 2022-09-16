const {
  Client,
  Intents,
  Collection,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageCollector,
} = require("discord.js");

const axios = require("axios").default;

const { token, ownerID, mongo, logFolder } = require("./config.json");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  allowedMentions: { parse: ["users", "roles"], repliedUser: true },
});
const mongoose = require("mongoose");
const bug = require("./models/bugs.js");

const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

const commandFolders = fs.readdirSync('./commands');
client.commands = new Collection();


for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
        

    }
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const errorEmbed = new MessageEmbed()
      .setTitle(`Command Error - ${interaction.commandName}`)
      .setDescription(`\`\`\`${error}\`\`\``)
      .setColor("RED")
      .setTimestamp();
    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
});

client.on("messageCreate", async (message) => {
  const date = new Date()
  const time = date.toLocaleString("en-US", {
    timeZone: "America/New_York",
  });

  if (message.author.bot) return;
  if (message.channel.type === "DM") return;

  // If the dir logFolder doesn't exist, create it
  if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder);
  }

  // Check if the file message.author.id.log exists
  if (!fs.existsSync(`${logFolder}/${message.author.id}.log`)) {
    // If not, create it
    fs.writeFileSync(`${logFolder}/${message.author.id}.log`, "");
  }

  // Append the message to the file
  fs.appendFileSync(
    `${logFolder}/${message.author.id}.log`,
    `[${time}] ${message.author.tag} (${message.author.id}) - ${message.content}\n`
  );
  
  const command = message.content.toLowerCase().split(" ")[0];

  if (command == "$poll") {
    if (message.author.id === ownerID) {
      const args = message.content.split(" ").slice(1);
      const question = args.join(" ");
      if (!question)
        return message.channel.send("Please provide a question for the poll!");
      const embed = new MessageEmbed()
        .setTitle("Poll")
        .setDescription(`\`\`\`${question}\`\`\``)
        .setAuthor({
          name: `Poll By: ${message.author.username}`,
          iconURL: `${message.author.avatarURL()}`,
        })
        .setColor("GREEN")
        .setFooter({
          text: "Powered By Akeno API",
          iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
        })
        .setTimestamp();

      const msg = await message.channel.send({
        embeds: [embed],
        content: `<@&1015438056368648284>`,
      });
      await msg.react("<:upvote:1015732381426122765>");
      await msg.react("<:downvote:1015732395741290558>");

      message.delete();
    } else {
      return;
    }
  }
  if (command === "$bug") {
    if (!message.member.roles.cache.has("1014531229212737626")) return message.channel.send("You do not have permission to use this command!");
    const args = message.content.split(" ").slice(1);
    const flags = args[0];
    const bugId = args[1];

    if (flags === "-r") {
      if (!bugId)
        return message.channel.send("Please provide a bug ID to remove!");
      bug.findById(bugId, (err, bug) => {
        if (err)
          return message.channel.send(
            "An error occurred while trying to find that bug!"
          );
        if (!bug) return message.channel.send("That bug does not exist!");
        bug.deleteOne();

        message.channel.send("Successfully removed that bug!");
      });
    }
    if (flags === "-f") {
      if (!bugId)
        return message.channel.send("Please provide a bug ID to find!");
      bug.findById(bugId, (err, bug) => {
        if (err)
          return message.channel.send(
            "An error occurred while trying to find that bug!"
          );
        if (!bug) return message.channel.send("That bug does not exist!");
        const bugEmbed = new MessageEmbed()
          .setTitle("Bug")
          .setDescription(
            `Bug ID: ${bug.id} | Bug Reporter: <@!${bug.user.id}> | Bug Status: ${bug.status} | Bug Priority: ${bug.priority}`
          )
          .setColor("GREEN")
          .setFooter({
            text: "Powered By Akeno API",
            iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
          })
          .setTimestamp();
        message.channel.send({ embeds: [bugEmbed] });
      });
    }
    if (flags === "-a") {
      if (!bugId)
        return message.channel.send("Please provide a bug ID to approve!");
      bug.findById(bugId, (err, bug) => {
        if (err)
          return message.channel.send(
            "An error occurred while trying to find that bug!"
          );
        if (!bug) return message.channel.send("That bug does not exist!");
        // Send a Message to the Bug Reporter
        const bugReporter = bug.user.id;
        const bugEmbed = new MessageEmbed()
          .setTitle("Bug Approved")
          .setDescription(`Your bug has been approved!`)
          .setColor("GREEN")
          .setFooter({
            text: "Powered By Akeno API",
            iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
          })
          .setTimestamp();

        const genChannel = client.channels.cache.get("1016400222458482789");
        genChannel.send({ embeds: [bugEmbed] });
        genChannel.send(`<@!${bugReporter}>`);

        message.channel.send("Successfully approved that bug!");

        const bugRole = message.guild.roles.cache.get("1006952358665797642");
        const bugUser = message.guild.members.cache.get(bugReporter);
        bugUser.roles.add(bugRole);
      });
    }
    if (flags === "-s") {
      const status = args[2];
      if (!bugId)
        return message.channel.send("Please provide a bug ID to approve!");
      bug.findById(bugId, (err, bug) => {
        if (err)
          return message.channel.send(
            "An error occurred while trying to find that bug!"
          );
        if (!bug) return message.channel.send("That bug does not exist!");

        // Check if the status is either OPEN, CLOSED, IN PROGRESS, PENDING, or RESOLVED
        if (status !== "OPEN" && status !== "CLOSED" && status !== "IN-PROGRESS" &&  status !== "PENDING" &&  status !== "RESOLVED") {
          return message.channel.send(
            "Please provide a valid status! (OPEN, CLOSED, IN-PROGRESS, PENDING, or RESOLVED)"
          );
        }
        bug.status = status;
        bug.save();

        message.channel.send("Successfully updated that bug's status!");
        {
        }
      });
    }
    if (flags === "-p") {
      const priority = args[2];
      if (!bugId)
        return message.channel.send("Please provide a bug ID to approve!");
      bug.findById(bugId, (err, bug) => {
        if (err)
          return message.channel.send(
            "An error occurred while trying to find that bug!"
          );
        if (!bug) return message.channel.send("That bug does not exist!");

        // Check if the priority is either LOW, MEDIUM, or HIGH
        if (priority !== "LOW" && priority !== "MEDIUM" && priority !== "HIGH") {
          return message.channel.send(
            "Please provide a valid priority! (LOW, MEDIUM, or HIGH)"
          );
        }
        bug.priority = priority;
        bug.save();

        message.channel.send("Successfully updated that bug's priority!");
      });
    }
    if (!flags) {
      const embed = new MessageEmbed()
        .setTitle("Error")
        .setDescription("Please provide a flag, from this list:")
        .addFields(
          { name: "-r", value: "Remove a bug", inline: false },
          { name: "-f", value: "Find a bug", inline: false },
          { name: "-a", value: "Approve a bug", inline: false },
          {
            name: "-p",
            value: "Change the priority of the bug (DEFAULT: LOW)",
            inline: false,
          },
          { name: "-s", value: "Change the status of the bug", inline: false }
        )
        .setColor("RED")
        .setFooter({
          text: "Powered By Akeno API",
          iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
        })
        .setTimestamp();

      return message.reply({
        embeds: [embed],
      });
    }
  }
  if (command === "&*(donate")
  {
    // Check if the message author has the permission MANAGE_MESSAGES
    if (!message.member.permissions.has("MANAGE_MESSAGES")) return;

    const embed = new MessageEmbed()
      .setTitle("How to get \"Premium\".")
      .addFields(
        { name: "What do you get?", value: "You get access to the premium commands.", inline: false },
        { name: "How do I get it?", value: "You can get it by Server Boosting.", inline: false },
        { name: "How do i view premium commands.", value: "You can view it by typing `/premium`.", inline: false },
        { name: "How do I get the role?", value: "You get the role by Server Boosting.", inline: false },
      )
      .setColor("GREEN")
      .setFooter({
        text: "Powered By Akeno API",
        iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
      })
      .setTimestamp();

      const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setEmoji("<:booster:996939275465670726>")
          .setStyle("LINK")
          .setLabel("Server Boost")
          .setURL("https://discord.gg/d9fd8CHWP3")
      )

    return message.channel.send({ embeds: [embed], components: [row]});
  }
});

client.on("guildMemberAdd", async (member) => {
  const welcomeEmbed = new MessageEmbed()
    .setTitle(
      "<:hibadge:1015736756387188736> Welcome! <:hibadge:1015736756387188736>"
    )
    .setAuthor({
      name: `${member.user.username}`,
      iconURL: `${member.user.avatarURL()}`,
    })
    .addFields(
      { name: "Links:", value: "To View Our Links go to #«🎀»┆links" },
      {
        name: "Donate:",
        value: "If you would like to Donate to Support us go to #«💵»┆donate",
      },
      { name: "Shoob:", value: "To Interact with Shoob go to #«✉»┆shoob" }
    )
    .setColor("GREEN")
    .setImage("https://c.tenor.com/QQcZT_psSywAAAAC/welcome-banner.gif")
    .setFooter({
      text: "Powered By Akeno API",
      iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
    })
    .setTimestamp();

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setEmoji("🌐")
      .setLabel("Website")
      .setURL("https://cafe.akenodev.tk")
      .setStyle("LINK"),

    new MessageButton()
      .setEmoji("<:EA_partnership:1014193886161281126>")
      .setLabel("Echo Anime")
      .setURL("https://echoanime.xyz")
      .setStyle("LINK"),

    new MessageButton()
      .setEmoji("<:ownerlogo:996939277390852146>")
      .setLabel("Akeno API")
      .setURL(`https://akenodev.tk`)
      .setStyle("LINK")
  );

  member.guild.channels.cache.get("1014190511915012148").send({
    embeds: [welcomeEmbed],
    components: [row],
    content: `Welcome <@${member.user.id}>`,
  });
});


app.get("/", (req, res) => {
  res.json({
    status: "200",
    note: "This is a public API, so please don't abuse it!",
  });
});



app.listen(process.env.PORT || 6700, () => {
  console.log("Server is now online!")
})


client.login(token);
