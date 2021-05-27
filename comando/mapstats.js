const Discord = require("discord.js");
const axios = require('axios');
exports.run = async (client, message, args, config) => {
    const statsEmbed = new Discord.MessageEmbed();
    let name = args[0];
    let url = `https://open.faceit.com/data/v4`;
    await axios.get(`${url}/players?nickname=${name}&game=csgo`, { 'headers': { 'Authorization': config["faceit-token"] } }).then(async data => {
        const res = data.data;
        let urlStats = `https://open.faceit.com/data/v4/players/${res.player_id}/stats/csgo`
        await axios.get(urlStats, { 'headers': { 'Authorization': config["faceit-token"] } }).then(async dataMap => {
            //console.log(dataMap)
            console.log(data)
            const resMap = dataMap.data.segments;
            let map = "de_" + args[1];
            map = map.toLowerCase();
            let mapas = ["de_inferno", "de_dust2", "de_mirage", "de_ancient", "de_train", "de_nuke", "de_overpass", "de_vertigo"];
            if (mapas.includes(map)) {

                for (let i = 0; i < resMap.length; i++) {
                    if (resMap[i].mode == "5v5") {
                        if (resMap[i].label == map) {
                            let mapStats = resMap[i].stats;

                            statsEmbed.setTitle(`Mapa: ${resMap[i].label}`);
                            statsEmbed.setDescription(`FaceIt Profile: [${res.nickname}](https://www.faceit.com/en/players/${res.nickname})\n\nLVL: ${res.games.csgo.skill_level} & ELO: ${res.games.csgo.faceit_elo}`);
                            statsEmbed.setThumbnail(resMap[i].img_regular);
                            statsEmbed.setColor('#f2a121');

                            statsEmbed.addField(`Multiple Kills en: ${map}`, `3K: ${mapStats["Triple Kills"]},\n4K: ${mapStats["Quadro Kills"]},\n5K/ACE: ${mapStats["Penta Kills"]}`, true);
                            statsEmbed.addField(`Average K/D en: ${map}`, `${mapStats["Average K/D Ratio"]}`, true);
                            statsEmbed.addField(`Rondas en: ${map}`, `${mapStats["Rounds"]}`, true);
                            statsEmbed.addField(`MVPs en: ${map}`, `${mapStats["MVPs"]}`, true);
                            statsEmbed.addField(`Partidas en: ${map}`, `${mapStats["Matches"]}`, true);
                            statsEmbed.addField(`Wins en: ${map}`, `${mapStats["Wins"]}`, true);

                            message.channel.send(statsEmbed);
                        }
                    }
                }
            } else {
                message.channel.send("El mapa, no pertence al map pool oficial, estos son los mapas: (" + mapas + ")");
            }
        })
    }).catch((e) => {
        message.channel.send("Usuario no encontrado, compruebe mayúsculas minúsculas y/o caracteres especiales.");
    })
};
