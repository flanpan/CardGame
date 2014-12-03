
extends Panel

var global

func _ready():
	global = get_node('/root/global')




func _on_entry_pressed():
	global.gotoScene('res://scn/main.scn')
