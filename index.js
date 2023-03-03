import { Telegraf } from 'telegraf'
import { config } from 'dotenv'

config()

const bot = new Telegraf(process.env.TOKEN)

bot.command(['start', 'help'], ctx => {
    const msg = `
yangi rasm - rasm generatsya qilish
yangi rasmlar - 5 ta generatsya qilish
/qayer - manzilni olish
    `

    ctx.reply(msg)
})

bot.hears('yangi rasm', (ctx) => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo")
    ctx.replyWithPhoto(`https://source.unsplash.com/random?sig=${Math.floor(Math.random() * 100)}`, {
        reply_to_message_id: ctx.message.message_id
    })
})


bot.hears('yangi rasmlar', (ctx) => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo")
    let album = [];
    Array.from({length: 5}).fill(1).map(() => {
        album.push({
            type: 'photo',
            media: `https://source.unsplash.com/random?sig=${Math.floor(Math.random() * 999)}`
        })
    })
    ctx.replyWithMediaGroup(album)
})

const getMessageType = (message) => {
    let keys = Object.keys(message);
    let messageType = keys.pop();
    
    return messageType === 'document'
};

bot.command('/qayer', (ctx) => {
    bot.telegram.sendLocation(ctx.chat.id, 40.866368587512106, 71.9790977820209);
})


bot.on('message', async (ctx) => {
    if (getMessageType(ctx.message)) {
        try {
            const link = await bot.telegram.getFileLink(ctx.message.document.file_id)
            ctx.reply(`Your download link: ${link.href}`)
        } catch ({response}) {
            console.log(response)
            ctx.reply(response.description)
        }
    }
})


bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));