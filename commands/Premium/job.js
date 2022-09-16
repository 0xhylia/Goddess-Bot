const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios').default;
const wait = require("util").promisify(setTimeout);
const premiumRole = "1006952317679046723";


module.exports = {
	data: new SlashCommandBuilder()
		.setName('job')
		.setDescription('Get a job')
        .addStringOption(option =>
            option.setName('job')
                .setDescription('The job you want to get')
                .setRequired(true)
                .addChoices(
                    { name: 'KNIGHT', value: 'knight' },
                    { name: 'GUILD MASTER', value: 'guildmaster' },
                    { name: 'ADVENTURER', value: 'adventurer' },
                    { name: 'MERCHANT', value: 'merchant' },
                    { name: 'FARMER', value: 'farmer' },
                    { name: 'MINER', value: 'miner' },
                    { name: 'FISHERMAN', value: 'fisher' },
                    { name: 'BUILDER', value: 'builder' },

                )),
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

        const job = interaction.options.getString('job');
        const user = interaction.user;

        
        const jobRole = interaction.guild.roles.cache.find(role => role.name === job);



        wait(2000)

        const embed = new MessageEmbed()
            .setTitle(`${user.tag} is now a ${job}`)
            .setColor('RANDOM')
            .setTimestamp()
            .setFooter({ text: 'Powered By Akeno API', iconURL: `https://cdn.discordapp.com/emojis/1010732299966484531.gif?size=96&quality=lossless` });


        interaction.reply({ embeds:[embed], ephemeral: false });


        interaction.guild.members.cache.get(user.id).roles.add(jobRole);
       


	},
};
