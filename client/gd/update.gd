
extends Panel

var http 
var state = 0
var label
var progress
var global
var needUpdateFiles = []
var curFiles
var needUpdateSize = 0
var updateFileIdx = 0
var updateFileCount = 0
var isSavedUserdata = false
var curFileUpdated = false

func _ready():
	# Initalization here
	global = get_node("/root/global")
	print(global,global.userData)
	curFiles = {}.parse_json(global.userData.get_value('user','res'))
	#set_process(true)
	http = get_node("/root/global").httpClient
	label = get_node('Label')
	progress = get_node('ProgressBar')
	#http.post(global.host,global.port,'/getResourceInfo',{},{instance=self,f='onGetResourceInfo'})
	label.set_text('check update...')
	var f1 = File.new()
	var f2 = File.new()
	var err = f1.open('res://icon.png',File.READ)
	print(err)
	print(f1.get_len())
	f1.seek_end()
	print(f1.get_pos())
	var buf = f1.get_buffer(f1.get_len())
	print(typeof(buf))
	err = f2.open('res://icon1.png',File.WRITE)
	print(err)
	f2.store_var(buf)
	f1.close()
	f2.close()
	pass
	
func _process(d):
	if isSavedUserdata:
		return
	if updateFileIdx < updateFileCount and curFileUpdated:
		var file = needUpdateFiles[updateFileIdx]
		http.post('https://raw.githubusercontent.com',80,'/flanpan/CardGame/master/client/'+file.path,{},{instance=self,f='onGetFileData'},true)
		curFileUpdated = false
	
func _on_Button_pressed():
	label.set_text('hot update.')
	pass # replace with function body

func onGetResourceInfo(err,msg):
	var msg = {}.parse_json(msg)
	for path in msg:
		var stat = msg[path]
		if curFiles.has(path) and curFiles[path][1] == stat[1]:
			pass
		else:
			var obj = {}
			obj.path = path
			obj.stat = stat
			needUpdateFiles.push_back(obj)
			needUpdateSize += stat[0]
			updateFileCount += 1

func onGetFileData(err,data):
	if err != null:
		return updateDone()
	var f = File.new()
	var file = needUpdateFiles[updateFileIdx]
	var err = f.open('res://'+file.path,File.WRITE)
	print(err)
	f.store_buffer(data)
	f.close()
	updateFileIdx += 1
	curFileUpdated = true
	if updateFileIdx == updateFileCount-1:
		updateDone()

func updateDone():
	print('hot update done')
	global.userdata.set_value('user','res',curFiles.to_json())
	global.saveUserData()
	isSavedUserdata = true