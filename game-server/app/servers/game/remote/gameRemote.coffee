module.exports = (app)->new GameRemote(app)

class GameRemote
    constructor:(@app)->@channelService = app.get 'channelService'
    add: (uid, sid, name, flag, cb)->
        channel = this.channelService.getChannel name, flag
        username = uid.split('*')[0]
        param = 
            route: 'onAdd'
            user: username
        channel.pushMessage param
        if channel
            channel.add uid, sid
        cb this.get name, flag
    get: (name, flag)->
        users = []
        channel = this.channelService.getChannel name, flag
        if channel
            users = channel.getMembers()
        user = user.split('*')[0] for user in users

    kick: (uid, sid, name, cb)->
        channel = this.channelService.getChannel name, false
        # leave channel
        if channel
            channel.leave uid, sid
        username = uid.split('*')[0]
        param = 
            route: 'onLeave'
            user: username
        channel.pushMessage param
        cb();