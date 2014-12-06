
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


func _ready():
	first = get_node('/root/first')
	label = get_node('Label')
	label.set_text('copy')
	if first.isNeedCopy:
		var file = File.new()
		print(file.open('res://'+first.fileInfoName,File.READ))
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

			if not dirRes.copy(filePath,'user://'+filePath):
				copiedSize += fileSize
				copyFileIdx += 1
				set_val(copiedSize/needCopySize*100)
			else:
				isFailed = true
			if isFailed:
				label.set_text('init failed.')
		else:
			if not dirRes.copy(first.fileInfoName,'user://'+first.fileInfoName):
				if initGame():
					isStartCopy = false
					isDone = true
					label.set_text('init done.')
		if isFailed:
			label.set_text('init failed.')

func initGame():
	var cfg = ConfigFile.new()
	cfg.set_value('pomelo','protos',{})
	cfg.set_value('user','res',fileList)
	var userDataPath = get_node('/root/first').userDataPath
	if not dirUser.dir_exists(userDataPath.get_base_dir()):
		if dirUser.make_dir_recursive(userDataPath.get_base_dir()):
			isFailed = true
		else:
			Globals.set_resource_path(OS.get_data_dir())
			var global = load('res://gd/global.gd')
			global = global.new()
			global.set_name('global')
			get_node('/root').add_child(global)
			cfg.save(userDataPath)
	if isFailed:
		return false
	else:
		return true

func startCopy():
	isStartCopy = true

