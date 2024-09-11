const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription('This tells the user their current clan points.'),
    async execute(interaction) {
        await interaction.reply('Your current points is: ')
    }
}