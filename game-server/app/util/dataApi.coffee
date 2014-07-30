class Data
  constructor: (data)->
    fields = {}
    if data[0]
        data[0].forEach (i, k)->
            fields[i] = k
        data.splice(0, 1)
    result = {}
    data.forEach (k)->
        item = mapData fields, k
        result[item.id] = item
    @fields = fields
    @data = result

  setItem: (item)->
    @data[item.id] = mapData @fields, item

  findBy: (attr, value)->
    result = []
    for i of @data
      item = @data[i]
    if item[attr] is value
      result.push item
    return result;

  findBigger: (attr, value)->
    result = []
    value = Number value
    for i of this.data
      item = this.data[i]
      if Number(item[attr]) >= value
        result.push item
    return result;

  findSmaller: (attr, value)->
    result = []
    value = Number(value)
    for i of this.data
      item = this.data[i]
      if Number(item[attr]) <= value
        result.push(item)
    return result

  findById: (id)->@data[id]
  all: ->@data


mapData = (fields, item)->
    obj = {}
    for k of fields
        obj[k] = item[fields[k]]
    return obj
###
var dbMgr = {};

dbMgr.getData = function(db) {
    var db_keys = Object.keys(db);
    var data = {};
    for (var i = 0; i < db_keys.length; i++) {
        data[db_keys[i]] = new Data(db[db_keys[i]]);
    };
    return data;
};

dbMgr.getNactive = function(db) {
    var db_keys = Object.keys(db);
    var nactive = {};
    for (var i = 0; i < db_keys.length; i++) {
        console.log(db_keys[i]);
        nactive[db_keys[i]] = [];
        var fieldsNameFlag = true;
        var ids = Object.keys(db[db_keys[i]].data);
        var fieldNames;
        for (var j = 0; j < ids.length; j++) {
            if (fieldsNameFlag) {
                fieldNames = Object.keys(db[db_keys[i]].data[ids[j]]);
                nactive[db_keys[i]].push(fieldNames);
                fieldsNameFlag = false;
            }
            var fields = [];
            for (var k = 0; k < fieldNames.length; k++) {
                fields.push(db[db_keys[i]].data[ids[j]][fieldNames[k]]);
            }
            nactive[db_keys[i]].push(fields);
        }
    }
    return nactive;
};
###