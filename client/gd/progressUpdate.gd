
extends ProgressBar

var http
var state = 0
var label
var lblProgress
var isUpdate
var txtHost
var txtUpdateHost
var cancalUpdate
var dir = Directory.new()
var needUpdateFiles = []
var curFiles = {}
var needUpdateSize = 0
var updatedSize = 0
var updateFileIdx = 0
var updateFileCount = 0
var isDone = false
var isUpdateStop = true
var isFileUpdating = false
var updateHost
var updatePort
var global
var userData = ConfigFile.new()

func _ready():
	pass
	

func startUpdate():
	dir.open('.')
	global = get_node("/root/global")
	#print(global)
	http = get_node('/root/http')
	print(Globals.get('user/userDataPath'))
	userData.load(Globals.get('user/userDataPath'))
	curFiles.parse_json(userData.get_value('user','res'))
	set_process(true)
	label = get_node('Label')
	lblProgress = get_node('lblProgress')
	txtHost = get_node('host')
	txtUpdateHost = get_node('updateHost')
	if not userData.has_section_key('user','updateHost'):
		userData.set_value('user','updateHost',Globals.get('user/updateHost'))
	if not userData.has_section_key('user','host'):
		userData.set_value('user','host',Globals.get('user/host'))
	updateHost = userData.get_value('user','updateHost')
	updatePort = Globals.get('user/updatePort')
	txtUpdateHost.set_text(updateHost)
	txtHost.set_text(userData.get_value('user','host'))
	isUpdate = get_node('isUpdate')
	cancalUpdate = isUpdate.get_cancel()
	cancalUpdate.connect('pressed',self,'onCancelUpdate')
	#progress = get_node('ProgressBar')
	http.post(updateHost,updatePort,'/'+Globals.get('user/fileInfoName'),{},{instance=self,f='onGetResourceInfo'})
	label.set_text('check update...')

func _process(d):
	if isUpdateStop:
		return
	if isDone:
		return
	if updateFileIdx < updateFileCount and not isFileUpdating:
		var file = needUpdateFiles[updateFileIdx]
		print(file.path)
		http.post(updateHost,updatePort,'/'+file.path,{},{instance=self,f='onGetFileData'},true)
		isFileUpdating = true
		label.set_text(file.path)
	
func _on_Button_pressed():
	#if isUpdateStop:
	#	onUpdateContinue()
	#else:
	#	onUpdateStop()
	global.gotoScene('res://scn/login.scn')

func onGetResourceInfo(err,msg):
	print(err,msg)
	if err:
		return label.set_text('get res info err.'+str(err))
	var json = {}
	err = json.parse_json(msg)
	if err:
		return label.set_text('parse res info err.'+str(err))
	msg = json
	for path in msg:
		var stat = msg[path]
		if curFiles.has(path) and curFiles[path][0] == stat[0] and curFiles[path][1] == stat[1]:
			pass
		else:
			print('need update:',path)
			var obj = {}
			obj.path = path
			obj.stat = stat
			needUpdateFiles.push_back(obj)
			needUpdateSize += stat[0]
			updateFileCount += 1
	if needUpdateFiles.size():
		isUpdate.show()
	else:
		label.set_text('resource is newest.')
		isDone = true

func onGetFileData(err,data):
	if err:
		label.set_text('get res info err.'+str(err))
		return onUpdateStop()
	var f = File.new()
	var file = needUpdateFiles[updateFileIdx]
	var path = 'res://'+file.path

	if not dir.dir_exists(path.get_base_dir()):
		print('mkdir:',dir.make_dir_recursive(path.get_base_dir()))
		#if err:
		#	return onUpdateStop()
	err = f.open(path,File.WRITE)
	
	if err:
		return onUpdateStop()
	f.store_buffer(data)
	f.close()
	updateFileIdx += 1
	isFileUpdating = false
	updatedSize += file.stat[0]
	var val = updatedSize/needUpdateSize*100
	set_val(val)
	lblProgress.set_text(str(updatedSize/1024/1024)+'M/'+str(needUpdateSize/1024/1024)+'M')
	print(file.path,'|',updateFileIdx,'|',updateFileCount)
	curFiles[file.path] = file.stat
	if updateFileIdx == updateFileCount:
		onUpdateDone()

func onUpdateDone():
	print('hot update done')
	userData.set_value('user','res',curFiles.to_json())
	userData.save(Globals.get('user/userDataPath'))
	isDone = true
	
func onUpdateStop():
	userData.set_value('user','res',curFiles.to_json())
	userData.save(Globals.get('user/userDataPath'))
	isUpdateStop = true

func onUpdateContinue():
	isUpdateStop = false

func _on_isUpdate_confirmed():
	isUpdateStop = false

func onCancelUpdate():
	get_tree().quit()


func _on_save_pressed():
	updateHost = txtUpdateHost.get_text()
	userData.set_value('user','updateHost',updateHost)
	userData.set_value('user','host',txtHost.get_text())
	var res = userData.save(Globals.get('user/userDataPath'))
	get_node('save').set_text(str(res))

