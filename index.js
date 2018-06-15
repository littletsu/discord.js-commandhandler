// Definitions

const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.events = new Discord.Collection();

// Utils & config requiring

const utils = require("./utils/utils")
const config = require("./utils/config.json");

// Handlers

fs.readdir("./src/events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./src/events/${file}`);
    let eventStart = eventFunction.run.bind(null, client);
    let eventName = file.split(".")[0];
    client.events.set(eventName, eventStart)
    client.on(eventName, (...args) => eventFunction.run(client, utils, ...args));
  });
});

fs.readdir('./src/commands/', (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./src/commands/${ f }`);
        props.fileName = f;
        client.commands.set(props.help.name, props);
        props.help.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});

// Message Event (here because something could happen with event handler.)

client.on("message", message => {
  if (message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();

  if(client.aliases.has(command)) command = client.commands.get(client.aliases.get(command)).help.name

  if(client.commands.get(command).config.restricted == true) {
    if(message.author.id !== config.ownerID) return utils.errorEmbed(message, ':warning: This command is restricted only to bot owners. :warning:')
  }

  if(client.commands.get(command).config.args == true) {
    if(!args[0]) return utils.errorEmbed(message, `Invalid arguments. Use: ${config.prefix + 'help ' + client.commands.get(command).help.name}`)
  }

  try {
    let commandFile = require(`./src/commands/${command}.js`);
    commandFile.run(client, message, args, utils);
  } catch (err) {
    console.error(err);
  }
});


client.login(config.token /* If your token is stored in envorniment values use "process.env.TOKEN" */ );
