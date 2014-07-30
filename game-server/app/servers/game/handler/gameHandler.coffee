module.exports = (app)->new Handler app

class Handler
    constructor:(@app)->
    send: (msg, session, next)->
        rid = session.get 'rid'
        username = session.uid.split('*')[0]
        channelService = this.app.get 'channelService'
        param=
            msg: msg.content,
            from: username,
            target: msg.target
        channel = channelService.getChannel rid, false
        if msg.target == '*'
            channel.pushMessage('onChat', param)
        else
            tuid = msg.target + '*' + rid
            tsid = channel.getMember(tuid)['sid']
        channelService.pushMessageByUids('onChat', param, [
            uid: tuid,
            sid: tsid
            ])
        next null,route: msg.route