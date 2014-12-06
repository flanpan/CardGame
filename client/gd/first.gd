extends Node

var fileInfoName = '.filesinfo'
var isNeedCopy = false
var userDataPath = 'res://data/user'

func _init():
	var file = File.new()
	if isPlatformNeedCopy():
		if not file.file_exists('user://'+fileInfoName):
			isNeedCopy = true
		else:
			Globals.set_resource_path(OS.get_data_dir())
			
			var global = load('res://gd/global.gd')
			print(global)
			global = global.new()
			global.set_name('global')
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
	