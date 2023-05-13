module.exports.config = {
    name: "masoi",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "D-Jukie convert Kb2aBot",
    description: "Một chiếc ma sói trên mirai",
    commandCategory: "Game",
    usages: "",
    cooldowns: 0
};
 
module.exports.onLoad = async () => {
    const fs = require('fs-extra');
    if (!fs.existsSync(__dirname + "/masoi")) {
        console.log("Creating folder masoi...")
        fs.mkdirSync(__dirname + "/masoi", { recursive: true });
    }
    try {
        if (!fs.existsSync(__dirname + "/masoi/index.js")) {
            console.log("Downloading game...")
            await global.utils.downloadFile("https://drive.google.com/uc?export=download&id=14-Lp7SLqxmNx0BNCdFCRz5JJV-5JJnol", __dirname + '/masoi/masoi.zip');
            const unZip = require('adm-zip');
            const zip = new unZip(__dirname + '/masoi/masoi.zip');
            await zip.extractAllTo(__dirname + '/masoi', true);
            fs.unlinkSync(__dirname + '/masoi/masoi.zip');
        } 
        const GameManager = require('./masoi/GameManager')
        const loader = () => {
            var exportData = {};
            exportData['masoi'] = require('./masoi/index');
            return exportData;
        };
        var gameManager = new GameManager(loader());
        global.gameManager = gameManager
    }
    catch(e) {
        console.log(e)
    }
}

module.exports.handleEvent = async function({ api, event }) {
    const reply = function(message) {
        return api.sendMessage(message, event.threadID, event.messageID);
    }
    if(!global.gameManager || !global.gameManager.items.some(i => i.name == "Ma Sói")) return
        for (const game of global.gameManager.items) {
            if(!game.participants) continue
            if ((game.participants.includes(event.senderID) && !event.isGroup) || game.threadID == event.threadID) {
                game.onMessage(event, reply);
            }
        }
}
module.exports.run = async ({ event, args, Users }) => {
    global.Users = Users
    global.gameManager.run(this.config.name, {
        masterID: event.senderID,
        threadID: event.threadID,
        param: args,
        isGroup: event.isGroup
    })
}