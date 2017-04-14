const Config = require('../config.json')

const Dash = require('rethinkdbdash')
let r = new Dash({
  user: Config.database.user,
  password: Config.database.pass,
  silent: true,
  servers: [{
    host: Config.database.host,
    port: Config.database.port
  }]
})

import { getMinutes, getHours } from '../engine/timeutils'

let minutes = getMinutes()
minutes < 10 ? minutes = `0${getMinutes()}` : minutes = getMinutes()
let hours = getHours()
hours < 10 ? hours = `0${getHours()}` : hours = getHours()

function voiceJoin (v, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': v.guildId
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    logChannel.sendMessage(`📞 [\`${getHours()}:${minutes}\`] User \`${v.user.username}#${v.user.discriminator}\` has joined voice channel *${v.channel.name}*.`)
  })
}

function voiceLeave (v, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': v.guildId
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    if (!v.newChannelId) {
      logChannel.sendMessage(`📞 [\`${getHours()}:${minutes}\`] User \`${v.user.username}#${v.user.discriminator}\` has left voice channel *${v.channel.name}*.`)
    } else {
      let newVoiceChannel = bot.Channels.get(`${v.newChannelId}`)
      logChannel.sendMessage(`📞 [\`${getHours()}:${minutes}\`] User \`${v.user.username}#${v.user.discriminator}\` has changed voice channels from *${v.channel.name}* to *${newVoiceChannel.name}*.`)
    }
  })
}

export {
  voiceJoin,
  voiceLeave
}
