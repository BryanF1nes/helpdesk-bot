const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('This tells the user their current clan rank.'),
    async execute(interaction) {
        try {
            const discordUsername = interaction.user.username;

            // Fetch the user's points from the API
            const response = await fetch(`http://localhost:3000/user/${discordUsername}`);

            // Check if the user was found
            if (response.ok) {
                const data = await response.json();
                // Respond with the user's points
                await interaction.reply(`Your current clan rank is: ${data.rank}`);
            } else if (response.status === 404) {
                await interaction.reply('You are not registered in the clan system.');
            } else {
                throw new Error('Failed to fetch rank');
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while retrieving your rank.');
        }
    }
};
