extends Node

var fileInfoName = '.filesinfo'
var isNeedCopy = false
var userDataPath = 'res://data/user'
var global
func _init():
	#print((ResourcePreloader.new()).get_resource_list())
	
	var a = load('res://test.gd')
	a.set_source_code('')
	OS.print_resources_in_use()

	var file = File.new()
	if isPlatformNeedCopy():
		if not file.file_exists('user://'+fileInfoName):
			isNeedCopy = true
		else:
			Globals.set_resource_path(OS.get_data_dir())
			
			var globalClass = load('res://gd/global.gd')
			global = globalClass.new(userDataPath)
			global.set_name('global')
			print(get_node('/root'))
			
	
func _ready():
	get_node('/root').add_child(global)

func isPlatformNeedCopy():
	var platform = OS.get_name()
	print('cur platform is ',platform)
	var platforms = [
		'Android',
		'ios',
		'Windows'
	]
	for p in platforms:
		if p == platform:
			return true
	return false
	