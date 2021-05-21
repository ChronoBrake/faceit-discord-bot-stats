const Discord = require("discord.js");
exports.run = async (client, message, args) => {
    let eleccion = args[0];
    if (eleccion == "crear") {
        // Crea la lobby
        let salaCreador = message.member.voice;
        let creador = message.author.id;
        let nombreLobbyCreate = args.slice(1).join(" ");
        let salas = [];
        if (salaCreador.channelID != "838029902955282493") {
            message.channel.send("No estas en la sala de espera.");
        } else {
            message.guild.channels.create("Lobby: " + `${nombreLobbyCreate}`,
                {
                    type: "voice",
                    userLimit: 5,
                    parent: "838029902455636010",
                    reason: "Lobby de Faceit: " + nombreLobbyCreate + " creada por: " + message.author.username
                })
                .then(c => {
                    c.createInvite().then((invite) => {
                        client.users.cache.get(creador).send(`Envía este link a los miembros de tu sala de Faceit: discord.gg/${invite.code}`);
                    })
                    salas.push({
                        channel: c.id,
                        channelOwner: creador,
                        fecha: new Date()
                    })
                })
                console.log(salas)

        }
    } else if (eleccion == "entrar") {
        // Entra a una lobby
        let nombreLobbyJoin = args.slice(1).join(" ");
        if (salaCreador.channelID != "838029902955282493") {
            message.channel.send("No estas en la sala de espera.");
        } else {};
    }
};