var http = require('http')
var url = require('url')
var path = require('path')
var fs = require('fs')
var mime = require('mime')
var useMem = true
var filesDir = '../client'
var port = 30002
var files = {}

http.createServer(function(req,res){
    var urlInfo = url.parse(req.url);
    var filePath = path.join(__dirname,filesDir,urlInfo.pathname)
    response(filePath,res)
}).listen(port);

var getFileBuffer = function(filePath,cb) {
    if(useMem) {
        if(files[filePath])
            return cb(files[filePath]);
        else {
            fs.exists(filePath,function(exists) {
                if(exists) {
                    fs.readFile(filePath,'binary',function(err,data){
                        if(err) {
                            console.log(err)
                            return cb()
                        }
                        files[filePath] = data
                        return cb(data)
                    });
                }
                else
                    return cb();
            })
        }
    }else {
        fs.exists(filePath,function(exists) {
            if(exists) {
                fs.readFile(filePath,'binary',function(err,data){
                    if(err) {
                        console.log(err)
                        return cb()
                    }
                    else
                        return cb(data)
                });
            }
            else
                return cb();
        })
    }
};

var response = function(filePath,res) {
    getFileBuffer(filePath,function(buffer) {
        if(buffer) {
            console.log(filePath,mime.lookup(filePath))
            res.writeHead(200,{
                "Content-Type":mime.lookup(filePath),
                "Content-Length":Buffer.byteLength(buffer,'binary')
            });
            res.end(buffer,'binary')
        } else {
            var txt = 'Can not found file.'
            res.writeHead(404,{
                "Content-Type":"text/html;charset=utf-8",
                "Content-Length":Buffer.byteLength(txt,'utf8')
            })
            res.end(txt)
        }
    })
};