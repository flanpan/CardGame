express = require 'express'
fs = require 'fs'
path = require 'path'
app = express()
db = require 'mongoose'
db.connect 'mongodb://112.124.70.138/liangshan'

#--------------------configure app----------------------
pub = __dirname + '/public'
view = __dirname + '/views'

app.configure ->
  app.set 'view engine', 'html'
  app.set 'views', view
  app.engine '.html', require('ejs').__express
  app.use(express.methodOverride())
  app.use(express.bodyParser())
  app.set('basepath', __dirname)

app.configure 'development', ->
  app.use express.static pub
  app.use express.errorHandler ->
    dumpExceptions: true
    showStack: true

app.configure 'production', ->
  oneYear = 31557600000
  app.use express.static pub,->maxAge: oneYear
  app.use express.errorHandler()

app.on 'error', (err)-> console.error "app on error:#{ err.stack }"

getJsonPath = (name) ->
  config = require './design/main'
  node = config['JSON管理']
  if node then path = node[name]
  if not path
    path = './design/' + name + '.json'
  return path

app.post '/getFileJson', (req, res)->
  file = getJsonPath req.body.json #'./design/' + req.body.json + '.json';
  resourceFullPath = path.resolve file
  delete require.cache[resourceFullPath]
  if fs.existsSync file
    json = require(file)
  res.send(json)

app.post '/saveFileJson',(req, res)->
  srcPath = getJsonPath req.body.json #'./design/' + req.body.json + '.json';
  desPath = "./design/bak/#{ req.body.json }_#{ new Date().getTime() }.json"
  if fs.existsSync srcPath
    fs.renameSync srcPath, desPath
  fs.writeFileSync srcPath, req.body.data
  res.send '保存成功!'

app.post '/getDBJson',(req,res)->
  data = req.body.json
  db.findOne()
  res.send data

app.post '/saveDBJson', (req,res)->
  data = db.connection.collection('cfg').findOne name: req.body.json
  res.send '保存成功!'

app.get '/',(req, resp)->
  config = require './design/main'
  resp.render 'index', config['登录管理']

# 不在主页面是为了防止修改配置不当导致主页面无法打开
app.get '/design/', (req, resp)->resp.render 'design.html'
app.get '/module/:mname',(req, resp)->resp.render req.params.mname
app.listen 7001
console.log '[AdminConsoleStart] visit http://localhost:7001'
