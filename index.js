var concat = require('concat-stream')
  , request = require('hyperquest')

catFacts.help = '!catfacts - get some cat facts'

module.exports = catFacts

function catFacts(ziggy) {
  var users = []
  var currentFact = ''

  ziggy.on('message', parseMessage)

  getFact()

  function parseMessage(user, channel, text) {
    if(/^\!catfacts/.test(text)) {
      sayCurrent(user.nick)
      users.push(user.nick)
    }
  }

  function sayCurrent(nickname) {
    if(!currentFact || users.indexOf(nickname) > -1) return

    ziggy.say(nickname, 'You are now subscribed to catfacts!')
    ziggy.say(nickname, currentFact)
  }

  function getFact() {
    request.get('http://catfacts-api.appspot.com/api/facts')
      .pipe(concat(sayFact))
  }

  function sayFact(data) {
    data = '' + data

    try {
      data = JSON.parse(data)
    } catch(e) {
      return console.error(e)
    }

    currentFact = data.facts[0]

    users.forEach(function(user) {
      ziggy.say(user, currentFact)
    })

    setTimeout(getFact, 10000)
  }
}
