
extends ProgressBar

var label
var first
var fileList = {}
var isDone
var needCopyFiles = []
var needCopySize = 0
var copiedSize = 0
var copyFileIdx = 0
var isFileCopying = false
var isStartCopy = false
var dirRes = Directory.new()
var dirUser = Directory.new()
var isFailed = false
var fileInfoName

func _ready():
	fileInfoName = Globals.get('user/fileInfoName')
	first = get_node('/root/first')
	label = get_node('Label')
	label.set_text('copy')
	if first.isNeedCopy:
		var file = File.new()
		print(file.open('res://'+fileInfoName,File.READ))
		var txt = file.get_buffer(file.get_len()).get_string_from_utf8()
		print('aaa',txt)
		fileList.parse_json(txt)
		print('res',dirRes.open('res://'))
		print(OS.get_data_dir(),'||||user',dirUser.open(OS.get_data_dir()))
		for filePath in fileList:
			var fileSize = fileList[filePath][0]
			needCopyFiles.push_back(filePath)
			needCopySize += fileSize
		set_process(true)
		file.close()
	else:
		onDone()

func initGame():
	print('init game.')
	var fileList = {}
	var file = File.new()
	print(file.open('res://'+Globals.get('user/fileInfoName'),File.READ))
	var txt = file.get_buffer(file.get_len()).get_string_from_utf8()
	fileList.parse_json(txt)
	file.close()
	var cfg = ConfigFile.new()
	cfg.set_value('pomelo','protos',"{}")
	cfg.set_value('user','res',fileList.to_json())
	var userDataPath = Globals.get('user/userDataPath')#get_node('/root/first').userDataPath
	var baseDir = userDataPath.substr('user://'.length(),userDataPath.length()-'user://'.length()).get_base_dir()
	
	if not dirUser.dir_exists(baseDir):
		print('makedir:',dirUser.make_dir_recursive(baseDir))
	if not file.file_exists(userDataPath):
		print('save user data. res:',cfg.save(userDataPath))
	Globals.set_resource_path(OS.get_data_dir())
	return true

func _process(d):
	if isFailed or isDone:
		return
	if isStartCopy:
		print(copyFileIdx,'|',needCopyFiles.size())
		if copyFileIdx < needCopyFiles.size():
			var filePath = needCopyFiles[copyFileIdx]
			print(filePath)
			var fileSize = fileList[filePath][0]
			#var path = 'user://'+filePath
			if not dirUser.dir_exists(filePath.get_base_dir()):
				if dirUser.make_dir_recursive(filePath.get_base_dir()):
					print(filePath.get_base_dir())
					isFailed = true
					label.set_text('init failed when makedir.')
					return

			if not dirRes.copy(filePath,'user://'+filePath):
				copiedSize += fileSize
				copyFileIdx += 1
				set_val(copiedSize/needCopySize*100)
			else:
				isFailed = true
				label.set_text('init failed.')
				return
		else:
			if not dirRes.copy('res://'+fileInfoName,'user://'+fileInfoName):
				isStartCopy = false
				label.set_text('init done.')
				onDone()

func startCopy():
	isStartCopy = true
	
func onDone():
	if not initGame():
		get_tree().quit()
	isDone = true
	
