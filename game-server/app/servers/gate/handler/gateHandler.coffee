dispatcher = require '../../../util/dispatcher'
module.exports = (app)->new Handler app

class Handler
    constructor:(@app)->
    queryEntry: (msg, session, next)->
        uid = msg.uid;
        if not uid
            next null,code: 500 # 失败,帐号为空
            return
        # get all connectors
        connectors = this.app.getServersByType 'connector'
        if !connectors or connectors.length is 0 
            next null,code: 500 # 失败,找不到连接器
            return
        # select connector
        res = dispatcher.dispatch uid, connectors
        next null,
            code: 200, # 成功
            host: res.host,
            port: res.clientPort