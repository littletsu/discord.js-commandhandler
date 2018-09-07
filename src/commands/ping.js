// This is a template.

module.exports.run = (client, message, args, utils) => {

    // Command starts here. You can use the variables: "client", "message", "args" and "utils" (Which I think is all you need.)

    // Example of code
    message.channel.send('pong, wow i am a smart bot.')


}

// Aliases, name, description and usage

module.exports.help = {
    aliases: ['peng', 'pepo', 'saymepinguselessbot'],
    name: 'ping',
    description: 'pong wow!',
    usage: 'PREFIXping'
}

// Configuration

module.exports.config = {
    args: false, /* The command requires arguments? Could be false or true. */
    restricted: false, /* Can only owner use the command? Could be false or true. */
    category: 'Utils' /* You can make a category help command with this. */
}
