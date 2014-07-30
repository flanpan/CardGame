bearcat = require 'bearcat'
pomelo = require 'pomelo'
routeUtil = require './app/util/routeUtil'
dataPlugin = require 'pomelo-data-plugin'
db = require 'mongoose'
db.connect 'mongodb://127.0.0.1:27017/liangshan'
#Chr = db.model 'Chr',new require './schema/Chr'

app = pomelo.createApp()
configure = ->
  app.set 'name','CardGame'
  #app.loadConfig 'mysql',"#{app.getBase()}/../shared/config/mysql.json"
  #dbclient = require './app/dao/mysql/mysql'
  #dbclient.init app
  #app.set 'dbclient', dbclient
  #app.set 'db',require '../shared/models'

  app.configure 'production|development','gate',->
    app.set 'connectorConfig',
      connector: pomelo.connectors.hybridconnector
      useProtobuf: true

  app.configure 'production|development','connector',->
    app.set 'connectorConfig',->
      connector: pomelo.connectors.hybridconnector
      heartbeat: 3
      useDict: true
      useProtobuf: true

  app.configure 'production|development',->
    app.route 'game',routeUtil.game
    app.filter pomelo.timeout()
    # 热更新
    # 每3秒扫描配置
    ###
    app.use dataPlugin,
      watcher:
        dir: __dirname + '/config/data',
        idx: 'id',
        interval: 3000
    ###
###
# 每5秒更新读取配置
setInterval ->
    #npcTalkConf = app.get('dataService').get('npc_talk')
    #teamConf = app.get('dataService').get('team')
    5000
###
contextPath = require.resolve './context.json'
bearcat.createApp [contextPath]
bearcat.start ->
  configure()
  app.set 'bearcat',bearcat
  app.start()

process.on 'uncaughtException',(err)->
    console.error " Caught exception: #{err.stack}"
