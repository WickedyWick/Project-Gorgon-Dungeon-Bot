import { client } from './index.js'
import * as dotenv from 'dotenv'
dotenv.config()
let cache = new Map()
const totalVoters = Number(process.env.TOTAL_VOTERS)
const voteLengthS = Number(process.env.VOTE_TIME) * 1000
let timeoutId

export const suggestDungeon = async(dungeon, voterId) => {
    if (!cache.has('voteInProgress')) {
        cache.set('voteInProgress', 1)
        cache.set('votesFor', 1)
        cache.set('votesAgainst', 0)
        cache.set('totalVotes', 1)
        cache.set('dungeon', dungeon)
        cache.set(voterId, 1)
        timeoutId = setTimeout(async() => {
            await endVoting()
        }, voteLengthS)
        await startVoting(dungeon)
        return 'Voting started!'

    } 
    return 'Voting already in progress!'
}

export const registerVote = async(choice, voterId) => {
    const totalVotes = cache.get('totalVotes')
    if (cache.has('voteInProgress')) {
        if (!cache.has(voterId)) {
            const totalVotes = cache.get('totalVotes')
            cache.set('totalVotes', totalVotes + 1)
            if (choice == 'YES') {
                const votesFor = cache.get('votesFor')
                cache.set('votesFor', votesFor + 1)
            } else if(choice == 'NO') {
                const votesAgainst = cache.get('votesAgainst')
                cache.set('votesAgainst', votesAgainst + 1)
            }

            if (totalVoters <= totalVotes + 1) {
                clearTimeout(timeoutId)
                
                await endVoting()
                return
            }
            return 'Successfully voted!'
        }

        return 'You have already voted!'
    } 
    return 'Voting isn\'t in progress'
    
}

export const checkDungeon = async() => {
    if (cache.has('voteInProgress')) {
        const dung = cache.get('dungeon')
        return `Current dungeon that is being voted for is ${dung}`
    }
    return 'Voting isn\'t in progress'
    
}
const sendMessage = async(message) => {
    const channel = client.channels.cache.get(process.env.CHANNEL_ID)
    await channel.send(message)
}

const endVoting = async() => {
    const votesFor = cache.get('votesFor') || 0
    const votesAgainst = cache.get('votesAgainst') || 0
    const dungeon = cache.get('dungeon')
    await sendMessage(`Voting for ${dungeon} ended.\nVotes FOR : ${votesFor}\nVotes AGAINST : ${votesAgainst}\nNot coming: ${totalVoters - votesFor - votesAgainst}`)
    cache.clear()
    return
}

const startVoting = async(dungeon) => {
    await sendMessage(`Voting starting for ${dungeon}. Vote with /vote. Voting ends 5 minutes or when everyone votes`)
}