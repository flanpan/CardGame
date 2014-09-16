rl = require 'repl'
db = require 'mongoose'
db.connect 'mongodb://127.0.0.1:27017/test'
class Player

rl.start('>').context.i = new Player