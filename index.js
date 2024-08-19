// index.js
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, ActivityType } = require('discord.js');
const EpicBots = require('epicbots-prevnames');
const config = require('./config.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`EpicBots API Request Client By MrCat !`)
  console.log(`[BOT] -> Logged in as ${client.user.tag} !`);
  console.log(`[BOT] -> Actual Bot Version: 1.1.0`)
  const activities = [
    { name: `EpicBots API Client By MrCat !`, type: ActivityType.Custom },
];

let activityIndex = 0;

setInterval(() => {

        const currentActivity = activities[activityIndex];
        client.user.setPresence({
            activities: [currentActivity],
            status: 'dnd',
        });

        activityIndex = (activityIndex + 1) % activities.length;

    
}, 5000);

  const commands = [
    new SlashCommandBuilder()
      .setName('prevnames')
      .setDescription('Fetch Prevnames of a user.')
      .addStringOption(option =>
        option.setName('user_id')
          .setDescription('The ID of the user to look up')
          .setRequired(true)),
  ].map(command => command.toJSON());

  const rest = new REST({ version: '10' }).setToken(config.token);

  try {
   

    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );

    
  } catch (error) {
    console.error(error);
  }
});
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
const { commandName } = interaction;

if (commandName === 'prevnames') {
  const userId = interaction.options.getString('user_id');
  
  if (!userId) {
    interaction.reply('Please provide a user ID.');
    return;
  }

  try {
    const data = await EpicBots.prevnames(userId);
    const embed = new EmbedBuilder()
      .setTitle(`EpicBots API Request Client By MrCat !`)
      .setTimestamp();

      if (data && data.Names && Array.isArray(data.Names) && data.Names.length > 0) {
        data.Names.forEach(entry => {
          if (entry.name && entry.timestamp) {
            embed.addFields({
              name: entry.name, 
              value: new Date(entry.timestamp).toLocaleString(), 
              inline: false 
            });
          } else {
            console.warn('Invalid entry:', entry);
          }
        });
      } else {
        embed.setDescription('No prevnames found for this user.');
      }

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply('There was an error fetching the prevnames.');
    }
  }
});
client.login(config.token);