import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import gamedig from 'gamedig';
import Keyv from 'keyv';
const servers = new Keyv(process.env.servers);

export default {
  data: new SlashCommandBuilder()
    .setName('setguildserver')
    .setDescription(`Sets a per guild SA:MP server to receive updates on.`)
    .addStringOption((option) => option
      .setName('ip')
      .setDescription('The IP of a SA:MP server.')
      .setRequired(true)
    )
    .addStringOption((option) => option
      .setName('port')
      .setDescription('The port of a SA:MP server.')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  execute: async (interaction) => {
    await interaction.deferReply();
    const args = interaction.options.data.map((option) => option.value);
    try {
      await gamedig.query({
        type: 'samp',
        host: args[0],
        port: args[1]
      });
    } catch {
      return await interaction.editReply({ content: `Couldn't find ${args[0]}:${args[1]}`, ephemeral: true });
    }
    let Server = {};
    Server.ip = args[0];
    Server.port = args[1];
    await servers.set(interaction.guildId, Server);
    const config = interaction.client.guildConfigs.get(interaction.guildId);
    config.server = Server;
    interaction.client.guildConfigs.set(interaction.guildId, config);
    await interaction.editReply({ content: `You can now use /status to view information about ${args[0]}:${args[1]}`, ephemeral: true });
  }
}