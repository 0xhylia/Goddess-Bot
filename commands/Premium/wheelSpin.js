const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);
const premiumRole = "1006952317679046723";
const prizes = require("../../prizes.json").prizes;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("wheelspin")
		.setDescription('Spin the wheel for a chance to win a prize!'),
	async execute(interaction) {
        if (!interaction.member.roles.cache.has(premiumRole)) {
            const embed = new MessageEmbed()
            .setTitle(`Premium Required`)
            .setDescription(`You need to have premium to use this command!`)
            .setColor("RED")
            .setFooter({
                text: "Powered By Akeno API",
                iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
            })
            .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed2 = new MessageEmbed()
        .setTitle(`🔰 Wheel Spin 🔰`)
        .setDescription(`Spin the wheel for a chance to win a prize!`)
        .setColor("RANDOM")
        .setFooter({
            text: "Powered By Akeno API",
            iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
        })
        .setTimestamp();

        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setEmoji('🎰')
                    .setLabel('Spin')
                    .setCustomId('spin')
                    .setStyle('PRIMARY'),
            );


        interaction.reply({ embeds: [embed2], components: [row2] }).then(() => {

            const filter = i => i.customId === 'spin' && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'spin') {
                    const embed3 = new MessageEmbed()
                    .setTitle(`🔰 Wheel Spin 🔰`)
                    .setDescription(`Spinning...`)
                    .setImage("https://gifimage.net/wp-content/uploads/2018/05/spinning-wheel-gif-12.gif")
                    .setColor("RANDOM")
                    .setFooter({
                        text: "Powered By Akeno API",
                        iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
                    })
                    .setTimestamp();
                    i.update({ embeds: [embed3], components: [] })
                    await wait(5000);
                    const prize = prizes[Object.keys(prizes)[Math.floor(Math.random() * Object.keys(prizes).length)]];

                    const embed4 = new MessageEmbed()
                    .setTitle(`🔰 Wheel Spin 🔰`)
                    .setFooter({
                        text: "Powered By Akeno API",
                        iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
                    })
                    .setTimestamp();
                   
                    if (prize === "You Don't Win Anything") {
                        embed4.setDescription(`You don't win anything! Better luck next time!`)
                        embed4.setColor("RED")
                    }
                    else {
                        embed4.setDescription(`:confetti_ball: You won \"${prize}\"! :confetti_ball:`)
                        embed4.setColor("GREEN")
                    }

                    interaction.editReply({ embeds: [embed4], ephemeral: true });
                    


                    

                }
            });

            collector.on('end', (collected) => {
                if (collected.size === 0){
                const embed5 = new MessageEmbed()
                .setTitle(`🔰 Wheel Spin 🔰`)
                .setDescription(`You didn't spin in time!`)
                .setColor("RANDOM")
                .setFooter({
                    text: "Powered By Akeno API",
                    iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless`,
                })
                .setTimestamp();
                interaction.editReply({ embeds: [embed5], components: [] });
            }
            });
        });
	},
};
