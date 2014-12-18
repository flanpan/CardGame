extends Node

var isNeedCopy = false

# bug Directory.dir_exists
# bug Directory.copy at android
# bug Globals.set_resource_path can not use at _init()

var global
func _init():
	pass
	
func _ready():
	var file = File.new()
	if isPlatformNeedCopy():
		if not file.file_exists('user://'+Globals.get('user/fileInfoName')):
			isNeedCopy = true
		else:
			Globals.set_resource_path(OS.get_data_dir())
	pass

func isPlatformNeedCopy():
	var platform = OS.get_name()
	print('cur platform is ',platform)
	var platforms = [
		#'Windows',
		'Android',
		'ios'
	]
	for p in platforms:
		if p == platform:
			return true
	return false
