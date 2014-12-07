
extends Panel

var progressUpdate
var progressCopy
var isDone
var init = false
func _ready():
	progressUpdate = get_node('progressUpdate')
	progressCopy = get_node('progressCopy')
	
	set_process(true)

func _process(d):
	if not init:
		var isNeedCopy = get_node('/root/first').isNeedCopy
		if isNeedCopy:
			progressUpdate.hide()
			progressCopy.startCopy()
		else:
			progressCopy.hide()
			progressUpdate.startUpdate()
		init = true
	
	if progressCopy.isDone && progressUpdate.is_hidden():
		progressCopy.hide()
		progressUpdate.show()
		progressUpdate.startUpdate()
	if progressUpdate.isDone:
		isDone = true