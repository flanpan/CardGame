extends Node

var socket = StreamPeerTCP.new()
var _connected = false
var protobuf = load("res://pomelo_protobuf.gd").new() 
var protocol = load("res://pomelo_protocol.gd").new()
var package = protocol.package
var message = protocol.message
var heartbeatInterval = 0
var heartbeatTimeout = 0
var protoVersion
var clientProtos
var abbrs = {}
var serverProtos = {}
var _dict = {}
var nextHeartbeatTimeout
var reqId = 0

const ST_HEAD = 1
const ST_BODY = 2
const ST_CLOSED = 3
const headSize = 4

var headOffset = 0
var packageOffset = 0
var packageSize = 0
var packageBuffer = RawArray()
var state = ST_HEAD
var headBuffer = RawArray()

var routeMap = {}
var handshakeBuffer = {
	    sys= {
	      type="js-websocket",
	      version= "0.0.1",
	      rsa={}
	    },
	    user={}
	}
var rsa #window.rsa
var localStorage = ConfigFile.new()
var useCrypto
var routes = {}

const ERR = 1
var data

var _reqId = 0

func _ready():
	var err = localStorage.load("res://user_config.cfg")
	print("load user config",err)
	if err:
		return print(err)
	add_user_signal("error")
	set_process(true)
	
func request111(route,msg,obj,method):
	if(not _connected):
		print("pomelo have not connect.")
	else:
		if(routes[route]):
			var robj = routes[route].obj
			var rmethod = routes[route].method
			if(robj == obj):
				if(rmethod == method):
					socket.put_partial_data(_string_to_raw_array(msg))
		else:
			routes[route] = {}
			routes[route].obj = obj
			routes[route].method = method
			add_user_signal(route)
			socket.put_partial_data(_string_to_raw_array(msg))

func _string_to_raw_array(string):
	var msg = string + data.HEAD_STR
	var raw = RawArray()
	var len = msg.length()
	var i=0
	while(i<len):
		raw.push_back(msg.ord_at(i))
		i=i+1
	return raw


# 循环
func _process(delta):
	var connected = socket.is_connected()
	if(not connected):
		return
	var output = socket.get_partial_data(1024)
	var errCode = output[0]
	var outputData = output[1]
	if(errCode != 0):
		return print( "receive ErrCode:" + str(errCode), ERR)
	#var outStr = outputData.get_string_from_utf8()
	#if(outStr == ""):
	if(not outputData.size()):
		return
	var chunk = outputData
	var offset = 0
	var end=chunk.size()
	if state==ST_HEAD and packageBuffer == null and not _checkTypeData(chunk[0]):
		print("invalid head message")
		return
	while offset<end:
		if state == ST_HEAD:
			offset = _readHead(chunk,offset)
		if state==ST_BODY:
			offset = _readBody(chunk,offset)

func _checkTypeDate(data):
	return data== package.TYPE_HANDSHAKE || data == package.TYPE_HANDSHAKE_ACK || data == package.TYPE_HEARTBEAT || data==package.TYPE_DATA || data==package.TYPE_KICK

func _getBodySize(headBuffer):
	var len = 0
	for i in [1,2,3]:
		if i>1:
			len <<= 8
		len += headBuffer.get(i)#headBuffer.readUInt8(i)
	return len

func _readHead(data,offset):
	var hlen = headSize - headOffset
	var dlen = data.size() - offset
	var len = min(hlen,dlen)
	var dend = offset + len
	#data.copy(headBuffer,headOffset,offset,dend)
	for i in range(len):
		headBuffer.set(headOffset+i,data.get(offset+i))
	headOffset += len
	if headOffset == headSize:
		var size = _getBodySize(headBuffer)
		if size < 0:
			return print("invalid body size.%d",size)
		packageSize = size+headSize
		#packageBuffer = Buffer.new(packageSize)
		#headBuffer.copy(packageBuffer,0,0,headSize)
		packageBuffer.resize(packageSize)
		for i in range(headSize):
			packageBuffer.set(i,headBuffer.get(i))
		state = ST_BODY
	return dend

func _readBody(data,offset):
	var blen = packageSize - packageOffset
	var dlen = data.size() - offset
	var len = min(blen,dlen)
	var dend = offset + len
	#data.copy(packageBuffer,packageOffset,offset,dend)
	for i in range(len):
		packageBuffer.set(packageOffset+i,data.get(offset+i))
	packageOffset += len
	if packageOffset == packageSize:
		var buffer = packageBuffer
		_onData(buffer)
		_reset()
	return dend

func _reset():
	headOffset = 0
	packageOffset = 0
	packageSize = 0
	packageBuffer = null
	state = ST_HEAD

func _str2raw(string):
	var len = string.length()
	var raw = RawArray()
	var i = 0
	while(i<len):
		raw.push_back(string.ord_at(i))
		i = i + 1
	return raw

func _decode(data):
	var msg = message.decode(data)
	if msg.id >0:
		msg.route = routeMap[msg.id]
		routeMap.erase(msg.id)
		if not msg.route:
			return
	msg.body = _deCompose(msg)
	return msg

func _encode(reqId,route,msg):
	var type
	if reqId:
		type = message.TYPE_REQUEST
	else:
		type = message.TYPE_NOTIFY
	var compressRoute = 0
	if _dict and _dict[route]:
		route = _dict[route]
		compressRoute = 1
	return message.encode(reqId,type,compressRoute,route,msg)

func _heartbeat():
	pass


func _onopen():
	var obj = package.encode(package.TYPE_HANDSHAKE,protocol.strencode(handshakeBuffer.to_json()))
	_send(obj)

func _onmessage(data):
	_processPackage(package.decode(data))
	if heartbeatTimeout:
		nextHeartbeatTimeout = OS.get_ticks_msec() + heartbeatTimeout
	
func _onerror():
	emit_signal("io-error")
	print("socket error.")
	
func _onclose():
	emit_signal("close")
	emit_signal("disconnect")
	print("socket close.")


func _initSocket(host,port):
	print("connect to %s:%d",host,port)
	if(localStorage.get_value("pomelo","protos") and protoVersion==0):
		var protos = {}.parse_json(localStorage.get_value("pomelo","protos") )
		if not protoVersion:
			protoVersion = 0
		if protos.server:
			serverProtos = protos.server
		else:
			serverProtos = {}
		if protos.client:
			clientProtos = protos.client
		else:
			clientProtos = {}
		if protobuf:
			protobuf.init({encoderProtos=clientProtos,decoderProtos=serverProtos})
	handshakeBuffer.sys.protoVersion = protoVersion
	var err = socket.connect(host, port)
	_connected = socket.is_connected()
	if _connected:
		_onopen()
	return err
	
func init(host, port):
	print("pomelo init")
	#user 数据
	return _initSocket(host,port)


func _connect(host,port):
	return socket.connect(host, port)

func disconnect():
	_connected = false
	socket.disconnect()

func request(route,msg,obj,method):
	if(not _connected):
		return print("pomelo have not connect.")
	reqId = reqId+1
	_sendMessage(reqId,route,msg)

func notify(route,msg):
	if not msg:
		msg = {}
	_sendMessage(0,route,msg)
	
func _sendMessage(reqId,route,msg):
	if useCrypto:
		return print("no imp crypto now")
	msg = _encode(reqId,route,msg)
	var packet = package.encode(package.TYPE_DATA,msg)
	_send(packet)
	
	
func _send(msg):
	socket.put_partial_data(msg)

func _handshake(data):
	var res = {}
	res.parse_json(protocol.strdecode(data))
	data = res
	if data.code == 501:
		emit_signal("error","client version not fullfill")
		return
	if data.code != 200:
		emit_signal("error","handshake fail.")
		return
	_handshakeInit(data)
	var obj = package.encode(package.TYPE_HANDSHAKE_ACK);
	_send(obj)
	emit_signal("init",socket)

func _onData(data):
	var msg = data
	#if _decode:
	msg = _decode(msg)
	_processMessage(msg)

func _onKick(data):
	var res = {}
	res.parse_json(protocol.strdecode(data))
	emit_signal("onKick",data) 
	

func _hander(type,body):
	if type == package.TYPE_HANDSHAKE:
		_handshake(body)
	elif type == package.TYPE_HEARTBEAT:
		_heartbeat(body)
	elif type == package.TYPE_DATA:
		_onData(body)
	elif type == package.TYPE_KICK:
		_onKick(body)
	else:
		pass

func _processPackage(msgs):
	if typeof(msgs) == TYPE_ARRAY:
		for i in msgs:
			var msg = msgs[i]
			_handlers(msg.type,msg.body)

func _processMessage(msg):
	emit_signal(msg.route,msg.body)

func _deCompos(msg):
	var route = msg.route
	if msg.compressRoute:
		if not abbrs[route]:
			return {}
		route = abbrs[route]
		msg.route = abbrs[route]
	if serverProtos and serverProtos[route]:
		return protobuf.decode(route,msg.body)
	else:
		msg.parse_json(protocol.strdecode(msg.body))
	return msg
	

func _handshakeInit(data):
	if data.sys and data.sys.heartbeat:
		heartbeatInterval = data.sys.heartbeat*1000
		heartbeatTimeout = heartbeatInterval*2
	else:
		heartbeatInterval = 0
		heartbeatTimeout = 0
	_initData(data)

func _initData(data):
	if not data or not data.sys:
		return
	_dict = data.sys["dict"]
	var protos = data.sys.protos
	if _dict:
		abbrs = {}
		for route in _dict:
			abbrs[_dict[route]] = route
	if protos:
		if protos.version:
			protoVersion = protos.version
		else:
			protoVersion = 0
		if protos.server:
			serverProtos = protos.server
		else:
			serverProtos = {}
		if protos.client:
			clientProtos = protos.client
		else:
			clientProtos = {}
		if protobuf:
			var d = {encoderProtos=protos.client,decoderProtos=protos.server}
			protobuf.init(d)
		localStorage.set_value("pomelo","protos",protos.to_json())
	localStorage.save()
