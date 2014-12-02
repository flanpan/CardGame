
extends Panel

var http 
var state = 0
var label
var lblProgress
var progress
var isUpdate
var text
var cancalUpdate
var global
var needUpdateFiles = []
var curFiles = {}
var needUpdateSize = 0
var updatedSize = 0
var updateFileIdx = 0
var updateFileCount = 0
var isUpdateDone = false
var isUpdateStop = true
var isFileUpdating = false
var updateHost

func _ready():
	global = get_node("/root/global")
	curFiles.parse_json(global.userData.get_value('user','res'))
	set_process(true)
	http = get_node("/root/global").httpClient
	label = get_node('Label')
	lblProgress = get_node('lblProgress')
	text = get_node('TextEdit')
	updateHost = global.userData.get_value('user','updateHost')
	text.set_text(updateHost)
	isUpdate = get_node('isUpdate')
	cancalUpdate = isUpdate.get_cancel()
	cancalUpdate.connect('pressed',self,'onCancelUpdate')
	progress = get_node('ProgressBar')
	http.post(updateHost,30002,'/.filesinfo',{},{instance=self,f='onGetResourceInfo'})
	label.set_text('check update...')
	
func _process(d):
	if isUpdateStop:
		return
	if isUpdateDone:
		return
	if updateFileIdx < updateFileCount and not isFileUpdating:
		var file = needUpdateFiles[updateFileIdx]
		print(file.path)
		http.post('127.0.0.1',30002,'/'+file.path,{},{instance=self,f='onGetFileData'},true)
		isFileUpdating = true
		label.set_text(file.path)
	
func _on_Button_pressed():
	if isUpdateStop:
		onUpdateContinue()
	else:
		onUpdateStop()


func onGetResourceInfo(err,msg):
	print(err,msg)
	if err:
		return label.set_text('get res info err.'+err)
	var json = {}
	err = json.parse_json(msg)
	if err:
		return label.set_text('parse res info err.'+err)
	msg = json
	for path in msg:
		var stat = msg[path]
		if curFiles.has(path) and curFiles[path][0] == stat[0] and curFiles[path][1] == stat[1]:
			pass
		else:
			var obj = {}
			obj.path = path
			obj.stat = stat
			needUpdateFiles.push_back(obj)
			needUpdateSize += stat[0]
			updateFileCount += 1
	if needUpdateFiles.size():
		isUpdate.show()

func onGetFileData(err,data):
	if err != null:
		label.set_text('get res info err.'+err)
		return onUpdateStop()
	var f = File.new()
	var file = needUpdateFiles[updateFileIdx]
	err = f.open('res://'+file.path,File.WRITE)
	
	if err:
		return onUpdateStop()
	f.store_buffer(data)
	f.close()
	updateFileIdx += 1
	isFileUpdating = false
	updatedSize += file.stat[0]
	var val = updatedSize/needUpdateSize*100
	progress.set_val(val)
	lblProgress.set_text(str(updatedSize/1024/1024)+'M/'+str(needUpdateSize/1024/1024)+'M')
	print(file.path,'|',updateFileIdx,'|',updateFileCount)
	curFiles[file.path] = file.stat
	if updateFileIdx == updateFileCount:
		onUpdateDone()

func onUpdateDone():
	print('hot update done')
	global.userData.set_value('user','res',curFiles.to_json())
	global.saveUserData()
	isUpdateDone = true
	#global.gotoScene('res://scn/login.scn')
	

func onUpdateStop():
	global.userData.set_value('user','res',curFiles.to_json())
	global.saveUserData()
	isUpdateStop = true

func onUpdateContinue():
	isUpdateStop = false

func _on_isUpdate_confirmed():
	isUpdateStop = false

func onCancelUpdate():
	get_tree().quit()



func _on_save_pressed():
	updateHost = text.get_text()
	global.userData.set_value('user','updateHost',updateHost)
	global.saveUserData()
	pass # replace with function body
