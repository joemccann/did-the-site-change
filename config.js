"use strict"

const dotenv = require('dotenv')
	, path = require('path')
	, cfg = {
			accountSid: null
		,	authToken: null
		, sendingNumber: null
		, siteToMonitor: null
	}

dotenv.config({path: path.join(__dirname, '.env')})

cfg.accountSid = process.env.TWILIO_ACCOUNT_SID
cfg.authToken = process.env.TWILIO_AUTH_TOKEN
cfg.sendingNumber = process.env.TWILIO_NUMBER
cfg.siteToMonitor = process.env.SITE_TO_MONITOR

let requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber, cfg.siteToMonitor]
let isConfigured = requiredConfig.every(function(configValue){return !!configValue})

if (!isConfigured){
	throw new Error("TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER and SITE_TO_MONITOR must be set.")
}

module.exports = cfg
