extends Node

var isNeedCopy = false

# bug Directory.dir_exists

var global
func _init():
	var file = File.new()
	if isPlatformNeedCopy():
		if not file.file_exists('user://'+Globals.get('user/fileInfoName')):
			isNeedCopy = true
		else:
			Globals.set_resource_path(OS.get_data_dir())
	
func _ready():
	pass

func isPlatformNeedCopy():
	var platform = OS.get_name()
	print('cur platform is ',platform)
	var platforms = [
		'Windows',
		'Android',
		'ios'
		
	]
	for p in platforms:
		if p == platform:
			return true
	return false
	