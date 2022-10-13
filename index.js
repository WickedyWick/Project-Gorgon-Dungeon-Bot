import { ActivityType, Client, GatewayIntentBits, SlashCommandBuilder } from 'discord.js'
import { suggestDungeon, registerVote, checkDungeon } from './commands.js'
import * as dotenv from 'dotenv'
dotenv.config()

export const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

const cmdPrefix = process.env.CMD_PREFIX
const commands = new Set(['vote'])

client.once('ready', () => {
    client.user.setActivity(String(process.env.ACTIVITY), { type: ActivityType.Watching })
    console.log('ready')
})


/*
client.on('messageCreate', (message) => {
    if (message.author.bot) return

    if (message.content.startsWith(cmdPrefix)){
        const splitMessage = message.content.split('')
    }
   
})*/

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return
    const voterId = interaction.user.id
    if ( interaction.commandName === 'suggest') {
        const { value: name} = interaction.options.get('dungeon')
        const response = await suggestDungeon(name, voterId)
        await interaction.reply({ content: response, ephemeral: true })
    } else if ( interaction.commandName === 'vote' ) {
        const { value: name } = interaction.options.get('choice')
        const response = await registerVote(name, voterId)
        await interaction.reply({ content: response, ephemeral: true })
    } else if ( interaction.commandName === 'dungeon' ) {
        const response = await checkDungeon()
        await interaction.reply({ content: response, ephemeral: true })
    }
})


client.login(process.env.TOKEN)