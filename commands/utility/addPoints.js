const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-points')
        .setDescription('This will add a user-defined amount of points to the given user.')
        .addIntegerOption(option => 
            option.setName('points')
                .setDescription('The amount of points to add')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('discordid')
                .setDescription('The Discord ID of the user receiving the points')
                .setRequired(true)
        ),
    async execute(interaction) {
        const requiredRole = 'Admin'; // Role name or ID for required permission

        // Check if the user has the required role
        const memberRoles = interaction.member.roles.cache;
        const hasRole = memberRoles.some(role => role.name === requiredRole);

        if (!hasRole) {
            // If the user doesn't have the required role, deny access
            return await interaction.reply({
                content: 'You do not have the required role to use this command.',
                ephemeral: true // Makes the message visible only to the user
            });
        }

        try {
            // Retrieve options entered by the user
            const points = interaction.options.getInteger('points');
            const discordID = interaction.options.getString('discordid');

            // Send a request to your API to update the user's points
            const response = await fetch(`http://localhost:3000/user/${discordID}/add-points`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ points })
            });

            if (response.ok) {
                const data = await response.json();
                await interaction.reply(`Successfully added ${points} points to user with Discord ID ${discordID}.`);
            } else if (response.status === 404) {
                await interaction.reply('User not found.');
            } else {
                throw new Error('Failed to update points.');
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while updating the points.');
        }
    }
};
