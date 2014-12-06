extends Node

var host = "127.0.0.1"
var port = 30001

var current_scene = null
var pomelo  = load("res://gd/pomelo.gd").new()
var httpClient = load('res://gd/httpClient.gd').new()
var userData = ConfigFile.new()
var userDataPath

func gotoScene(scene):
	#load new scene
	var s = ResourceLoader.load(scene)
	#queue erasing old (don't use free because that scene is calling this method)
	current_scene.queue_free()
	#instance the new scene
	current_scene = s.instance()
	#add it to the active scene, as child of root
	get_tree().get_root().add_child(current_scene)


func _ready():
	print(get_tree().get_root().get_node('first'))
	userDataPath = get_tree().get_root().get_node('first').userDataPath
	set_process(true)
	add_child(pomelo)
	add_child(httpClient)
	userData.load(userDataPath)
	
	var root = get_tree().get_root()
	current_scene = root.get_child( root.get_child_count() -1 )
	#current_scene.add_child(pomelo)
	#for i in range(root.get_child_count()):
	#	print(root.get_child(i).get_type())
	
func saveUserData():
	return userData.save(userDataPath)