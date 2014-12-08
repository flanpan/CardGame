extends ConfigFile

var path
func _init():
	path = Globals.get('user/userDataPath')
	load(path)

func saveData():
	save(path)