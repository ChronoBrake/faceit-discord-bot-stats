const Discord = require("discord.js");
const axios = require('axios');
exports.run = async (client, message, args, config) => {
    const statsEmbed = new Discord.MessageEmbed();
    let name = args[0];
    let url = `https://open.faceit.com/data/v4`;
    await axios.get(`${url}/players?nickname=${name}&game=csgo`, { 'headers': { 'Authorization': config["faceit-token"] } }).then(async data => {
        let urlStats = `https://open.faceit.com/data/v4/players/${data.data.player_id}/stats/csgo`
        await axios.get(urlStats, { 'headers': { 'Authorization': config["faceit-token"] } }).then(async dataStats => {
            const res = data.data;
            const resStats = dataStats.data;
            let results = [];

            for (let i = 0; i < resStats.lifetime["Recent Results"].length; i++) {
                if (resStats.lifetime["Recent Results"][i] == '1') {
                    results.push('W');
                } else {
                    results.push('L');
                }
            }

            //statsEmbed.setTitle(`FaceIt Profile: [${res.nickname}](https://www.faceit.com/en/players/${res.nickname}`);
            statsEmbed.setDescription(`FaceIt Profile: [${res.nickname}](https://www.faceit.com/en/players/${res.nickname})\n\nLVL: ${res.games.csgo.skill_level} & ELO: ${res.games.csgo.faceit_elo}`);
            statsEmbed.setColor('#f2a121');

            statsEmbed.addField('% WinRate', resStats.lifetime["Win Rate %"], true);
            statsEmbed.addField('Mayor Racha', resStats.lifetime["Longest Win Streak"], true);
            statsEmbed.addField('Wins/Matches', `${resStats.lifetime["Wins"]}/${resStats.lifetime["Matches"]}`, true);
            statsEmbed.addField('K/D Ratio', `${resStats.lifetime["Average K/D Ratio"]}`, true);
            statsEmbed.addField('HS Ratio', `${resStats.lifetime["Average Headshots %"]}%`, true);
            statsEmbed.addField('Resultados', `${results}`, true);

            statsEmbed.setFooter('Infracciones: ' + `AFK: ${res.infractions.afk}, Abandono: ${res.infractions.leaver}`)
            statsEmbed.setThumbnail(res.avatar);
            statsEmbed.setImage(res.cover_image);

            await message.channel.send(statsEmbed);
        })
    }).catch(e => {
        message.channel.send("Usuario no encontrado, compruebe mayúsculas minúsculas y/o caracteres especiales.");
    })
};
