
extends Panel

var progressUpdate
var progressCopy
var isDone
var button

func _ready():
	progressUpdate = get_node('progressUpdate')
	progressCopy = get_node('progressCopy')
	button = get_node('Button')
	button.set_disabled(true)
	progressUpdate.hide()
	progressCopy.startCopy()
	set_process(true)

func _process(d):
	if progressCopy.isDone && progressUpdate.is_hidden():
		progressCopy.hide()
		progressUpdate.show()
		progressUpdate.startUpdate()
	if progressUpdate.isDone:
		isDone = true
		button.set_disabled(false)

func _on_Button_pressed():
	var global = get_node('/root/global')
	global.gotoScene('res://scn/login.scn')
