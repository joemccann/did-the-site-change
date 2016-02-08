"use strict"

const twilioClient = require('./twilio-client')
	, fs = require('fs')
	, admins = require('../config/administrators.json')

function formatMessage(errorToReport) {
  return 'ALERT! ' + errorToReport
}

module.exports.sendSMSNotification = function(message){admins.forEach(function(admin){twilioClient.sendSMS(admin.phoneNumber, formatMessage(message))})}
