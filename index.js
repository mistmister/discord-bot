const { channel } = require("diagnostics_channel");
const Discord = require("discord.js");
const fs = require('fs');
const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});
const guild = Client.guilds.cache.get("775808578098561074");

const lotterie = require('./lotterie.json');
const bdd = require('./bdd.json');
const winer = require('./gagnant.json');
const lots = require('./lots.json');
//const db = require('./db.json');


const { Z_NEED_DICT } = require("zlib");
const { ALL } = require("dns");
const perm = "Broot"

const prefix = "="; //PREFIX

Client.on("ready", async () => {
    console.log("bot OK");
    let statuts = bdd.stats
    setInterval(function(){
        let stats = statuts[Math.floor(Math.random()*statuts.length)];
        Client.user.setActivity(stats, {type: 'WATCHING'})
    },25000)
});




Client.on("messageCreate", message => {
    if(message.author.bot) return;
    
    //creer loterie //à modif avec le choix du nbrt de ticket
    if (message.content.startsWith(prefix+"cl")){
        message.delete()
        let arg = message.content.trim().split(/ +/g)
        nbrt=0
        tail_l = arg[1];
        bdd.l_tail=tail_l //met le nbrt choisi dans la bdd
        bdd.restant=tail_l
        Savebdd()
        if (!tail_l){
            return message.channel.send("❌ Vous devez choisir un nombre de ticket").then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            });

        }
        else{
            if (message.member.roles.cache.find(ro => ro.name == perm)){
                while(nbrt <tail_l){
                    lotterie[nbrt] = '...'
                    Saveloterie()
                    nbrt = nbrt+1; 
                }
            message.channel.send('✅ lotterie crée avec succé').then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000); 
            });
            }
            else{
                message.channel.send("❌ vous n'avez pas les perms").then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 5000); 
                }); 
                
            }
        }
          
    };



    //setup le channel win
    if (message.content.startsWith(prefix+"channsetup")){
        message.delete()
        let arg = message.content.trim().split(/ +/g)
        setup_chan= message.content.replace(/\D/g,'');
        if(message.member.roles.cache.find(ro => ro.name == perm)){
            bdd.chan_win=setup_chan;
            Savebdd();
            message.channel.send("✅ le channel a bien été defini").then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000); 
            }); 

        }
        else{
            message.channel.send("❌ vous n'avez pas les perms").then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000); 
            }); 
            
        } 
    } 


    //reset la lotterie
    if (message.content.startsWith(prefix+"rl")){ 
        message.delete()
        if (message.member.roles.cache.find(ro => ro.name == perm)){
            let lotterietab ={};
            console.log(lotterietab);
            let pos=1, n= bdd.l_tail
            let removedItems = lotterietab.splice(pos, n);            
            
            
            
            //Saveloterie()

        }
        else{
            message.channel.send("❌ vous n'avez pas les perms").then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000); 
            }); 
            
        }   


    };



    //affiche la liste des ticket,tickets restant
    if (message.content.startsWith(prefix+"trest")){
        message.delete()
        if (message.member.roles.cache.find(ro => ro.name == perm)){
            message.channel.send({ files: ['./lotterie.json'] });
            message.channel.send("il reste: "+bdd.restant +" ticket(s)!")
        }
        else{
            message.channel.send("❌ vous n'avez pas les perms").then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000); 
            }); 
            
        }
          
    };

    //assigne un ticket
    if (message.content.startsWith(prefix+"tgive")){
        message.delete()
        if (message.member.roles.cache.find(ro => ro.name == perm)){
        
            let arg = message.content.trim().split(/ +/g)

            utilisateur = message.mentions.members.first();
            num = arg[2];
            max= bdd.restant

            if(!utilisateur){
                return message.channel.send("Vous devez mentionner une personne").then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 5000);
                });
            }
            else{
                if(!num || isNaN(num)){
                    return message.channel.send('vous devez ajouter un numero').then(msg => {
                        setTimeout(() => {
                            msg.delete();
                        }, 5000); 
                    });
                }
                else{
                    if(num > max){
                        message.channel.send('pas assez de ticket disponible').then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 5000); 
                        });
                    }
                    else{
                        if(lotterie[num] == '...'){
                            lotterie[num] = utilisateur.displayName
                            Saveloterie()    
                            bdd.restant=bdd.restant-1;
                            Savebdd()
                            message.channel.send('✅ ticket loterie ajouté au n°'+num).then(msg => {
                                setTimeout(() => {
                                    msg.delete();
                                }, 5000); 
                            });
                        }
                        else{
                            message.channel.send('❌ ce ticket est deja pris ').then(msg => {
                                setTimeout(() => {
                                msg.delete();
                                }, 5000); 
                            });
                        }
                    }                  
                }
            }       
            
        
        }
        else{
            message.channel.send("❌ vous n'avez pas les perms").then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000); 
            }); 
            
        }            
        
    };

    //assigne un grand nbrt de ticket
    if(message.content.startsWith(prefix+"tbcp")){
        message.delete()
        if (message.member.roles.cache.find(ro => ro.name == perm)){
            let arg = message.content.trim().split(/ +/g)
            utilisateur = message.mentions.members.first();
            const nbr = parseInt(arg[2])
            max= bdd.restant
            console.log(nbr)
            console.log(bdd.l_tail)
            console.log(utilisateur.displayName)
            if(nbr > max){
                console.log('if vrai')
                message.channel.send("pas assez de ticket disponnible").then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 5000); 
                });              
            }
            else{
                nbr1 =0;
                while(nbr1 < nbr){
                    do{                             
                        num=Math.floor(Math.random()*Math.floor(bdd.l_tail))
                    }
                    while(lotterie[num] != '...'){
                        lotterie[num] = utilisateur.displayName;
                        Saveloterie();
                        message.channel.send('✅ ticket loterie ajouté au n°'+num).then(msg => {
                            setTimeout(() => {
                                msg.delete();
                            }, 2500); 
                        });
                        bdd.restant=bdd.restant-1;
                        Savebdd()
                    }
                    nbr1 = nbr1+1;
                }              
                             
            }
        }
    };


    //supprimer un ticket deja existant
    if (message.content.startsWith(prefix+"tsuppr")){
        message.delete()
        if (message.member.roles.cache.find(ro => ro.name == perm)){
            let arg = message.content.trim().split(/ +/g)
            num= arg[1];
            if(!num || isNaN(num)){
                return message.channel.send('vous devez ajouter un numero').then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 5000); 
                });
            }
            else{
                if(lotterie[num] != '...'){
                    lotterie[num] = '...'
                    Saveloterie()    
                    message.channel.send('✅ ticket loterie supprimé ').then(msg => {
                        setTimeout(() => {
                            msg.delete();
                        }, 5000); 
                    });
                    return;
                }
                else{
                    message.channel.send("❌ ce ticket n'est pas attribué").then(msg => {setTimeout(() => {msg.delete();}, 5000);});
                    return;
                }
            }
        }
        else{
            message.channel.send("❌ vous n'avez pas les perms").then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000); 
            }); 
            
        } 
    
    
    };


    //tirage au sort
    if (message.content.startsWith(prefix+"ts")){
        message.delete()
        let arg = message.content.trim().split(/ +/g)
        xfois = arg[1]
        const send_chan= Client.channels.cache.get(bdd.chan_win)
        console.log(send_chan);
        total = bdd.l_tail;
        rest = bdd.restant;
        if (message.member.roles.cache.find(ro => ro.name == perm)){
            if(bdd.restant >= bdd.l_tail) {
                message.channel.send("impossible de tirrer au sort, il n'y a pas de participant").then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 5000); 
                });               
            }
            else{
                if(xfois > 15){
                    message.channel.send("impossible de tirrer au sort plus de 15 participants").then(msg => {
                        setTimeout(() => {
                            msg.delete();
                        }, 5000); 
                    });                    

                }
                else{
                    xfois1 =0;
                    numwiner=1;
                    /*let values = [];
                    Object.keys(winer).forEach(el => {
                        values.push(winer[el]);
                      });*/
                    while(xfois1 < xfois){
                        
                        do{
                            numwin=Math.floor(Math.random()*Math.floor(bdd.l_tail))
                            winers=lotterie[numwin];
                            console.log("nbr de ticket: "+bdd.l_tail);
                            console.log("n° du gagnant: "+numwin);
                            console.log("nom du gagnant: "+winers);
                            //console.log("liste des gagnants:" +values.join(', '));
                            console.log("--------------------------------")
                        }
                        while(winers === '...'){
                            //probleme pour verif tous les element
                            if(send_chan !=''){
                                send_chan.send("🎉 le gagnant n° " +numwiner+ " désigné est: " + winers)
                                winer[numwiner]= winers;
                                Savewiner();
                                xfois1 = xfois1 +1;
                                numwiner = numwiner+1;                                
                                
                                
                            }
                            else{
                                message.channel.send("🎉 le gagnant n° " +numwiner+ " désigné est: " + winers)
                                xfois1 = xfois1 +1;        
                                winer[numwiner]= winers;
                                Savewiner(); 
                                numwiner = numwiner+1;                       
                                return;
            
                            }                               
                                                       
                        };

                        
                        
                    }
                }
                
            }
            

        }
        else{
            message.channel.send("❌ vous n'avez pas les perms").then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000); 
            }); 
            
        } 

    };


    //modif les tirages
    if(message.content.startsWith(prefix+"tmodif")){
        message.delete()
        let arg = message.content.trim().split(/ +/g)
        numplace = arg[1];
        if (message.member.roles.cache.find(ro => ro.name == perm)){
            if(!numplace || isNaN(numplace)){
                message.channel.send("il manque un n° de placement")
                
            }
            else{
                do{
                    numwin=Math.floor(Math.random()*Math.floor(bdd.l_tail))
                    replace=lotterie[numwin];
                    console.log("n° du gagnant: "+numwin);
                    console.log("nom du gagnant: "+replace);
                    console.log("---------------------------");

                }
                while(replace === winer[numplace] || replace === "..."){
                    winer[numplace]=replace;
                    Savewiner();
                    message.channel.send("l'emplacement n° "+numplace+" à bien été remplacé par: "+replace).then(msg => {
                        setTimeout(() => {
                            msg.delete();
                        }, 5000);
                    });
                }
                        
                
            }


        }

    };


    // setup des lot a gagner !!
    if(message.content.startsWith(prefix+"lsetup")){  
        message.delete();
        let arg = message.content.trim().split(/ +/g)
        numlot = arg[1]
        const nomlot = arg.slice(2).join(' ');
        if (message.member.roles.cache.find(ro => ro.name == perm)){
            if(!numlot || isNaN(numlot)){
                return message.channel.send('❌ vous devez ajouter un numero de placement du lot').then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 5000);
                });
            }
            else{
                if(!nomlot){
                    return message.channel.send('❌ vous devez ajouter un nom pour le lot').then(msg => {
                        setTimeout(() => {
                            msg.delete();
                        }, 5000); 
                    });
                }
                else{
                    lots[numlot] = nomlot
                    Savelots();
                    message.channel.send(nomlot +" a bien été ajouté à la position n°" + numlot)    
                }
            }
        }
        else{
            message.channel.send("❌ vous n'avez pas les perms").then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000); 
            }); 
            
        } 


    };



    // changements du logo serveur
    if(message.content.startsWith("!ouverture")){
        message.guild.setIcon("./ouvert.png")        
    };
    if(message.content.startsWith("!fermeture")){
        message.guild.setIcon("./fermer.png")
        
    };



    if (message.content.startsWith(prefix+"help")){
        message.delete()
        var embHelp = new Discord.MessageEmbed()
            .setColor("#EBBC0D")
            .setTitle("__**Commande de Luxury Bot**__")
            .addField(prefix+"cl (nbr)",'permet de creer tous les tickets de lotterie', true) //mettre une variable open/close pour arreter/continuer de mettre des tickets
            .addField(prefix+"channsetup","permet de definir un channel pour les resultats", true)  //mettre une variable open/close pour arreter/continuer de mettre des tickets
            .addField(prefix+"ts (nbr)",'permet de tirer au sort un nombre de gagnant', true)
            .addField(prefix+"tmodif (n° place)",'permet de modifier le nom du gagnant sur la place designée', true)
            .addField(prefix+"tgive [@nom_client] (n° du ticket)","permet d'assigner un ticket a une personne", true)
            .addField(prefix+"lsetup (n°) [nom du lot]",'permet de setup un lot', true)
            .addField(prefix+"tbcp [@nom_client] (nbr de ticket)","permet d'assigner Xticket, au hazzare à une personne", true)
            .addField(prefix+"tsuppr (n° du ticket)","permet de supprimer un ticket dejà assigné", true)
            .addField(prefix+"trest","permet d'avoir les n° des tickets restant", true)
            .setFooter({text:'mon prefix est:' + prefix})
        if (message.member.roles.cache.find(ro => ro.name == perm)){
            message.author.send({embeds : [embHelp]});
        }
        else{
            message.channel.send("❌ vous n'avez pas les perms").then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000); 
            });
            
        }
          
        
        
               
    };

    if(message.content.startsWith(prefix+'waffich')){
        message.delete();
        if (message.member.roles.cache.find(ro => ro.name == perm)){
            message.channel.send({embeds : [embWin]}); // marche pas completement
        }
        

    }
});

    


var embWin = new Discord.MessageEmbed()
            .setColor("#EBBC0D")
            .setTitle("__**Liste des gagnants de la loterie**__")
            .addField("gagnant n°1", winer[1]+' a gagné: ' +lots[1], false)
            .addField("gagnant n°2", winer[2]+' a gagné: ' +lots[2], false)
            .addField("gagnant n°3", winer[3]+' a gagné: ' +lots[3], false)
            .addField("gagnant n°4", winer[4]+' a gagné: ' +lots[4], false)
            .addField("gagnant n°5", winer[5]+' a gagné: ' +lots[5], false)
            .addField("gagnant n°6", winer[6]+' a gagné: ' +lots[6], false)
            .addField("gagnant n°7", winer[7]+' a gagné: ' +lots[7], false)
            .addField("gagnant n°8", winer[8]+' a gagné: ' +lots[8], false)
            .addField("gagnant n°9", winer[9]+' a gagné: ' +lots[9], false)
            .addField("gagnant n°10", winer[10]+' a gagné: ' +lots[10], false)
            .addField("gagnant n°11", winer[11]+' a gagné: ' +lots[11], false)
            .addField("gagnant n°12", winer[12]+' a gagné: ' +lots[12], false)
            .addField("gagnant n°13", winer[13]+' a gagné: ' +lots[13], false)
            .addField("gagnant n°14", winer[14]+' a gagné: ' +lots[14], false)
            .addField("gagnant n°15", winer[15]+' a gagné: ' +lots[15], false)
            .setFooter({text:'mon prefix est:' + prefix})
//[luxury]Billy Noopy/imaxs/BraZ

function Saveloterie(){
    fs.writeFile("./lotterie.json", JSON.stringify(lotterie, null, 4), (err) => {
        if (err) message.channel.send("une erreur c'est produite.");
    });
}
function Savebdd(){
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("une erreur c'est produite.");
    });
}
function Savelots(){
    fs.writeFile("./lots.json", JSON.stringify(lots, null, 4), (err) => {
        if (err) message.channel.send("une erreur c'est produite.");
    });
}
function Savewiner(){
    fs.writeFile("./gagnant.json", JSON.stringify(winer, null, 4), (err) => {
        if (err) message.channel.send("une erreur c'est produite.");
    });
}

/*function tirage(){
    numwin=Math.floor(Math.random()*Math.floor(bdd.l_tail))
    winer=lotterie[numwin];
}*/

Client.login(process.env.TOKEN); // token.token
