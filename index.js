const Discord = require('discord.js');
const cheerio = require("cheerio"); 
const request = require("request");
const {
	prefix,
	token,
} = require('./config.json');

const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
   });
   client.once('reconnecting', () => {
    console.log('Reconnecting!');
   });
   client.once('disconnect', () => {
    console.log('Disconnect!');
   });

   client.on(`message`, message => {
    if(!message.content.startsWith(prefix+"cmds")) return;
      let help = new Discord.MessageEmbed()
                .setColor("#00c115")
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setTitle(`Here's your commands, ${message.author.tag}!`)
                .addField(`\`+cmds\``, `Shows this command list.\nAliases: None`)
                .addField('\`+avatar (mention)\`', 'Shows mentioned user\'s avatar.\nAliases: None')
                .addField('\`+photosearch [query]\`', 'Searches for photos on Dogpile\nAliases: None', true)
                .setFooter(`[] are the required args, () are the optional.`);
                message.channel.send(help);
  
    });
  
    client.on(`message`, message => {
    if (message.content.startsWith(prefix + 'avatar')) {
        let user = message.mentions.users.first();
        if(!user) user = message.author;
        let color = message.member.displayHexColor;
        if (color == '#000000') color = message.member.hoistRole != null ? message.member.hoistRole.hexColor : '#000000';
        const embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.avatarURL())
                        .setImage(user.avatarURL({dynamic: true}))
                        .setColor("#00c115")
                        .setTitle(`Avatar of \`${user.tag}\``);
         message.channel.send({embed});
      }
  });

  client.on("message", function(message) { 
    var parts = message.content.split(" ");
    if (parts[0] === "+photosearch") { 
        image(message, parts);
    }
  });
  
  function image(message, parts) {
    var search = parts.slice(1).join(" ");
    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + search,
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    };
    request(options, function(error, response, responseBody) {
        if (error) {
            return;
        }
        $ = cheerio.load(responseBody);
        var links = $(".image a.link");
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
        if (!urls.length) {
            return;
        }
  
        let serverembed = new Discord.MessageEmbed()
        .setTitle(`Here\'s your photo, ${message.author.tag}!`)
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setColor("#00c115")
        .setImage( urls[0] );
  
        message.channel.send(serverembed);
  
    });
  }
client.login(token);
