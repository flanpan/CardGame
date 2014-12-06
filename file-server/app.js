var http = require('http')
var url = require('url')
var path = require('path')
var fs = require('fs')
var mime = require('mime')
var useMem = true
//var isWatch = true 添加删除文件无法监控
var filesDir = '../client'
var port = 30002
var files = {}
var filterList = ['.fscache','data/user','.filesinfo']
var filesInfo = {};
// 深度优先遍历方式
var getFilesInfo = function(dir) {
    var arr = fs.readdirSync(dir);
    arr.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            getFilesInfo(dir + '/' + file);
        } else {
            var p = dir + '/' + file;
            var t = (new Date(fs.statSync(p).mtime)).getTime();
            var size = fs.statSync(p).size
            p = p.substring(filesDir.length + 1, p.length);

            var file = [size,t];
            filesInfo[p] = file
        }
    });
};
getFilesInfo(filesDir);
// 过滤一些特殊文件
filterList.forEach(function(filePath){
    if(filesInfo[filePath]) {
        delete filesInfo[filePath]
    }
});
fs.writeFileSync(path.join(filesDir,'.filesinfo'),JSON.stringify(filesInfo))


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
                            console.warn(filePath,err)
                            return cb()
                        }
                        files[filePath] = data
                        /*
                        if(isWatch)
                            watch(filePath)
                            */
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
                        console.warn(filePath,err)
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

/*
var watch = function(p) {
    fs.watchFile(p, { persistent: true, interval: 3000 }, function(){
        fs.exists(p,function(exists) {
            if(exists) {
                fs.readFile(p,'binary',function(err,data){
                    if(err) {
                        console.warn(p,err)
                        console.log('delete file '+p);
                        delete files[p];
                    } else {
                        console.log('Reload file '+p);
                        files[p] = data
                    }
                });
            } else {
                console.log('delete file '+p);
                return delete files[p];
            }
        })
    });
};*/
