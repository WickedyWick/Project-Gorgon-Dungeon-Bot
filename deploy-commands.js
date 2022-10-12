import { REST, SlashCommandBuilder, Routes } from 'discord.js'
import * as dotenv from 'dotenv'
dotenv.config()

const commands = [
    new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Suggests dungeon that other can vote for!')
        .addStringOption(option => option
            .setName('dungeon')
            .addChoices(
                { name: 'GK', value: 'GK' },
                { name: 'WT', value: 'WT' },
                { name: 'FF', value: 'FF' }
            )
            .setRequired(true)
            .setDescription('Which dungeon')
        ),
    new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Votes YES or NO for suggested dungeon run!')
        .addStringOption(option => option
            .setName('choice')
            .addChoices(
                { name: 'YES', value: 'YES' },
                { name: 'NO', value: 'NO' }
            )
            .setDescription('Yes or No')
            .setRequired(true)
        )
].map(command => command.toJSON())

const rest = new REST({ vesrion: '10' }).setToken(process.env.TOKEN)

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
    .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
    .catch(console.error)