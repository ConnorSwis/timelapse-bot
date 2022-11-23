const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const cmd = require('node-cmd');
const { unlink } = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('timelapse')
        .setDescription('Creates a timelapse.'),
    execute: async (interaction) => {
        const message = await interaction.reply({ content: 'Working on it...', fetchReply: true });
        const name = uuidv4();
        cmd.run(`python scripts/videoize.py -f 60 ${name}`,
            async (data, err, _) => {
                if (!err) {
                    const path = `./${name}.mp4`;
                    const attachment = new AttachmentBuilder(path);
                    await message.edit({ content: 'Here you go, pal.', files: [attachment] });
                    unlink(path, function callback(err) {
                        if (err) {
                            console.error('Could not delete temporary timelapse file.');
                        }
                    });
                } else {
                    console.error('python script cmd error: ' + err);
                }
            },
        );

    },
};