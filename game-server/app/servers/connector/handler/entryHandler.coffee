module.exports = (app)->new Hander app;
class Hander
	constructor: (@app)->
	enter: (msg, session, next)->
		self = @
		rid = msg.rid
		uid = "#{msg.username}*#{rid}"
		sessionService = self.app.get 'sessionService'
		if sessionService.getByUid(uid) 
			next null,
				code: 500,
				error: true
			return
		session.bind uid 
		session.set 'rid', rid
		session.push 'rid', (err)->
			if err then console.error "set rid for session service failed! error is : #{err.stack} "
		session.on 'closed', onUserLeave.bind null, self.app
		self.app.rpc.game.gameRemote.add session, uid, self.app.get 'serverId', rid, true, (users)->
			next null,users: users

onUserLeave = (app, session)->
    if !session || !session.uid then return
    app.rpc.game.gameRemote.kick session, session.uid, app.get 'serverId' , session.get 'rid' , null