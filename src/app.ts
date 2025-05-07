import * as dotenv from 'dotenv'

import { Telegraf } from 'telegraf'

dotenv.config()

const tekon = process.env.BOT_TOKEN // token bot 
const groupId = process.env.GROUP_ID // grup id 

if (typeof tekon !== "string") throw new Error("Need a token").message
if (typeof groupId !== "string") throw new Error("Need a group id").message

const welcomeMessage = 'Доброго дня, раді вам допомогти.' // welcomeMessage 
const messageAfter = "Ми відповімо вам найближчим часом." // Messege after client message

const bot = new Telegraf(tekon)

const sendMessageInGroup = (message: string) => bot.telegram.sendMessage(groupId, message)
const onMessage = (ctx: any) => {
    if (ctx.message.reply_to_message) {
        ctx.telegram.sendMessage(
            ctx.message.reply_to_message.text.split('<')[1].split('>')[0], 
            ctx.message.text)
    } else {
        const from = ctx.message.from
        const username = from.username ? `@${from.username}` : `${from.first_name || 'Користувач'}`
        const message = `Повідомлення від ${username} <${ctx.message.chat.id}>:\n\n${ctx.message.text}`

        ctx.telegram.sendMessage(
            ctx.message.chat.id, 
            messageAfter)
        sendMessageInGroup(message)
    }
}

bot.start((ctx) => ctx.reply(welcomeMessage))
bot.on('text', onMessage)
bot.launch()
