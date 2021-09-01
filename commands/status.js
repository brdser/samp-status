const { SlashCommandBuilder } = require('@discordjs/builders');
const { getStatus } = require('../utils/getStatus');
const { getRoleColor } = require('../utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription(`Tells you live information about your favourite SA-MP community!`),
  usage: 'status',
  guildOnly: true,
  async execute(interaction) {
    let loading = await message.channel.send('Fetching server info...');
    const { server } = message.client.guildConfigs.get(message.guild.id);
    if (!server) {
      let msg = await loading.edit(`This guild doesn't have a SA:MP Server linked to it. Use ${prefix}setguildserver to do so.`);
    }
    
    const color = getRoleColor(message.guild);
    const status = await getStatus(server, color);
    await loading.delete();
    await message.channel.send({ embeds: [status] });
  }
}