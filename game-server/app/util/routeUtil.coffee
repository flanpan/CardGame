dispatcher = require './dispatcher'

module.exports.game = (session, msg, app, cb)->
  gameServers = app.getServersByType 'game'

  if not gameServers or gameServers.length is 0
    cb new Error 'can not find game servers.'
    return;
  res = dispatcher.dispatch session.get 'uid', gameServers
  cb null, res.id