
extends Panel

var progressUpdate
var progressCopy
var isDone

func _ready():
	progressUpdate = get_node('progressUpdate')
	progressCopy = get_node('progressCopy')
	var isNeedCopy = get_node('/root/first').isNeedCopy
	if isNeedCopy:
		progressUpdate.hide()
		progressCopy.startCopy()
	else:
		progressCopy.hide()
		progressUpdate.startUpdate()
	set_process(true)

func _process(d):
	if progressCopy.isDone && progressUpdate.is_hidden():
		progressCopy.hide()
		progressUpdate.show()
		progressUpdate.startUpdate()
	if progressUpdate.isDone:
		isDone = true