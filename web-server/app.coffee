express = require 'express'
async = require 'async'
fs = require 'fs'
path = require 'path'
zlib = require 'zlib'
Token = require '../shared/token'
secret = require('../shared/config/session').secret
app = express()
db = require 'mongoose'
everyauth = require './lib/oauth'
config = require './config/config.json'
resource = null
compressRes = null
db.connect 'mongodb://112.124.70.138:27017/liangshan'

User = db.model 'User',new require './schema/User'
Area = db.model 'Area',new require './schema/Area'
Resource = db.model 'Resource',new require './schema/Resource'
Resource.find().sort(date:-1).limit(1).exec (err,data)->resource = data

# 程序配置
app.configure ->
  app.use express.methodOverride()
  app.use express.bodyParser()
  app.use express.cookieParser()
#  app.use express.session ->secret: "hello liangshan"
  app.use everyauth.middleware()
  app.use app.router
  #app.set('basepath', publicPath);
  app.use(express.errorHandler())
  app.use express.errorHandler ->
    dumpExceptions: true
    showStack: true

# 账户验证
app.get '/auth_success', (req, res)->
  if req.session.userId
    token = Token.create req.session.userId, Date.now(), secret
    res.render 'auth', ->
      code: 200
      token: token
      uid: req.session.userId
  else res.render 'auth',-> code: 500

# 资源信息
app.post '/getResourceInfo',(req, res)->res.send compressRes:compressRes

# 资源更新信息
app.post '/updateResourceInfo',(req, res) ->
  if config.updateResPwd is req.body.pwd
    resource = JSON.parse req.body.files
    Resource.create res:resource,(err,data)->
      if err
        res.send err
        return
      zlib.deflate JSON.stringify(resource) , (err, buffer)->
        if err
          res.send "压缩resource信息失败: #{err}"
          return
        compressRes = buffer.toString 'base64'
        res.send '更新完成!'
  else res.send '密码错误,更新失败.'

# 生成唯一数字,要求只能有唯一服务端唯一主机
app.post '/getNumber',(req, res)->res.send id: new Date().getTime()

# 注册
app.post '/register',(req, res)->
  msg = req.body
  if !msg.name || !msg.password 
    res.send err:'用户名或密码不能为空!'
    return
  User.findOne name:msg.name,(err,user)->
    if err 
      res.send err:'连接服务器失败!'
      return
    if user 
      res.send err:'用户名已存在!'
      return
    User.create
      id: new Date().getTime()
      name: msg.name
      password: msg.password
      ,(err)->
        if err 
          res.send err:'注册失败,网络错误!'
          return
        res.send msg:'注册成功!'

# 登录
app.post '/login',(req, res)->
  msg = req.body
  console.log msg
  name = msg.name
  password = msg.password
  if !name || !password
    res.send err: '用户名或密码不能为空!'
    return
  User.findOne name:msg.name,(err,user)->
    if err 
      res.send err:'连接服务器失败!'
      return
    if not user 
      res.send err:'用户名不存在!'
      return
    if user.password isnt msg.password
      res.send err: '密码不正确,请重新输入!'
      return
    res.send
      token: Token.create user.id, Date.now(), secret
      id: user.id


# web路由
app.use '/', express.static __dirname+'/../client/script/web'
app.use '/shared', express.static __dirname+'/../client/script/shared'
app.use '/res', express.static __dirname+'/../client/res'
app.get '/../client/script/web',(req, res)->
  res.sendfile 'index.html'
  console.log 'Sent index.html'

# 监听
app.listen process.env.PORT || 3001
console.log "Web server has started.\n Please log on http://127.0.0.1:3001/"

# 异常
process.on 'uncaughtException', (err)->
  console.error ' Caught exception: ' + err.stack
