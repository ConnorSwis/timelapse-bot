const { Client, Events, Collection } = require('discord.js');
const { loadCommands } = require('./utils/load-commands');
require('dotenv').config();


const client = new Client({ intents: [32767] });
client.commands = new Collection();

loadCommands(client);

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.username}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(process.env.TOKEN);