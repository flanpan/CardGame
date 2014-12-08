
extends Panel
var global

func _init():
	var pomelo  = load("res://gd/pomelo.gd").new()
	var userData = load('res://gd/userData.gd').new()
	Globals.set('pomelo',pomelo)
	Globals.set('userData',userData)

func _ready():
	global = get_node('/root/global')


func _on_entry_pressed():
	global.gotoScene('res://scn/main.scn')

