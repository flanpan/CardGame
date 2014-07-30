crc = require 'crc'

module.exports.dispatch = (uid, connectors)->
  index = (Math.abs crc.crc32 uid) % connectors.length
  return connectors[index]