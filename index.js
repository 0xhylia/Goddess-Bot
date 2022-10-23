const {
  Client,
  Intents,
  Collection,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageCollector,
} = require("discord.js");

const { ownerID, logFolder } = require("./config.json");
const dotenv = require("dotenv");

dotenv.config();
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
    `[${time}] ${message.author.tag} - ${message.content}\n`
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
        .setDescription(`${question}`)
        .setAuthor({
          name: `Poll By: ${message.author.username}`,
          iconURL: `${message.author.avatarURL()}`,
        })
        .setColor("GREEN")
        .setFooter({
          text: "Powered By Akeno's Blood Sweat and Tears",
          iconURL: `https://cdn.discordapp.com/emojis/996939279429288027.webp?size=96&quality=lossless`,
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
            text: "Powered By Akeno's Blood Sweat and Tears",
            iconURL: `https://cdn.discordapp.com/emojis/996939279429288027.webp?size=96&quality=lossless`,
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
            text: "Powered By Akeno's Blood Sweat and Tears",
            iconURL: `https://cdn.discordapp.com/emojis/996939279429288027.webp?size=96&quality=lossless`,
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
        if (status !== "OPEN" && status !== "CLOSED" && status !== "IN-PROGRESS" && status !== "PENDING" && status !== "RESOLVED") {
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
          text: "Powered By Akeno's Blood Sweat and Tears",
          iconURL: `https://cdn.discordapp.com/emojis/996939279429288027.webp?size=96&quality=lossless`,
        })
        .setTimestamp();

      return message.reply({
        embeds: [embed],
      });
    }
  }
  if (command === "**join") {
    client.emit("guildMemberAdd", message.member);
  }
});


client.on("guildMemberAdd", (member) => {
  const welcomeGifs = [
    "https://c.tenor.com/QQcZT_psSywAAAAC/welcome-banner.gif",
    "https://c.tenor.com/wZW05QUURk4AAAAC/welcome-anime.gif",
    "https://c.tenor.com/1UoqmMhmm3AAAAAC/welcome-anime.gif",
    "https://c.tenor.com/S4Z-gA1k3UEAAAAC/welcome-anime.gif",
    "https://c.tenor.com/HNcG3X-Og7wAAAAC/welcome-anime.gif",
    "https://c.tenor.com/9KSO758KczwAAAAC/anime-welcome.gif",
    "https://c.tenor.com/AwMCvyYjPgAAAAAC/anime-welcome.gif",
    "https://c.tenor.com/ze-1ghpnDd4AAAAC/welcome-anime.gif",
    "https://c.tenor.com/L9frOQ90sU8AAAAC/welcome-home-anime.gif",
    "https://c.tenor.com/wXVVHRPokVYAAAAd/welcome-welcome-back.gif",
    "https://c.tenor.com/HCCXdEb9s3wAAAAC/anime.gif",
    "https://c.tenor.com/6TkRi7pddF8AAAAC/anime-welcome.gif",
    "https://c.tenor.com/Y-zoXlaaw8wAAAAC/1001k-anime.gif"
  ]
  const welcomeGif = welcomeGifs[Math.floor(Math.random() * welcomeGifs.length)];
  const welcomeEmbed = new MessageEmbed()
    .setTitle(
      "<:hibadge:1015736756387188736> Welcome! <:hibadge:1015736756387188736>"
    )
    .setAuthor({
      name: `${member.user.username}`,
      iconURL: `${member.user.avatarURL()}`,
    })
    .addFields(
      {
        name: "Premium:",
        value: "If you would like to get Premium go to <#1014198915060482089>",
      },
      { 
        name: "Shoob:", 
        value: "To Interact with Shoob go to <#1014761533001175060>" 
      },
      {
        name: "Rules:",
        value: "To View Our Rules go to <#1014190511915012151>",
      },
      {
        name: "Roles:",
        value: "To View Our Roles go to <#1014190511915012153>",
      }
    )
    .setColor("GREEN")
    .setImage(`${welcomeGif}`)
    .setFooter({
      text: "Powered By Akeno's Blood Sweat and Tears",
      iconURL: `https://cdn.discordapp.com/emojis/996939279429288027.webp?size=96&quality=lossless`,
    })
    .setTimestamp();

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setEmoji("🌐")
      .setLabel("Website")
      .setURL("https://akenodev.xyz")
      .setStyle("LINK"),
  );

  member.guild.channels.cache.get("1014190511915012148").send({
    embeds: [welcomeEmbed],
    components: [row],
    content: `<a:eray:1017782114873249834> **Welcome <@${member.user.id}>** <a:eray:1017782114873249834>`,
  });
})


app.get("/", (req, res) => {
  res.json({
    status: "200",
    message: "Use /user/ID to access user data",
    example: "https://bot.akenodev.xyz/user/1010732299966484531?log=true",
    note: "This is a public API, so please don't abuse it!",
  });
})

app.get("/user/:id", (req, res) => {
  const id = req.params.id;
  const user = client.users.cache.get(id);
  const log = req.query.log;
  const botHeader = req.headers["User-Agent"];
  if (botHeader === "DiscordBot (https://discord.com, 0.0.1)") {
    res.json({
      status: "200",
      message: "You are a bot, so you cannot access this API.",
    });
  }
  else {

    if (!user) {
      res.json({
        status: "404",
        message: "User not found!",
      });
    }
  }

  const userData = {
    UserManager: {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatarURL({ dynamic: true }),
      bot: user.bot,
      created: user.createdAt,
      system: user.system,
      flags: user.flags,
      tag: `${user.username}#${user.discriminator}`,
      
    },

  }

  if (log === "true") {
    // Check if /logs/${id}.log exists
    if (fs.existsSync(`./logs/${id}.log`)) {}
    fs.readFile("./logs/" + id + ".log", "utf8", (err, data) => {
      if (err) {
        res.json({
          status: "404",
          message: "File not found!",
        });
      }
      else {
        res.json({
          status: "200",
          message: "User data found!",
          data: data,
        });
      }
    })
  }

  else {

    res.json(userData);
  }
});



app.listen(process.env.PORT || 8080, () => {
  console.log("Server is now online!")
})


client.login(process.env.token);
