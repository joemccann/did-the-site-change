"use strict"

const request = require('request')
	,	cfg = require('./config')
	,	cronJob = require('cron').CronJob
	,	checksum = require('checksum')
	, twilio = require('./twilio/twilio-notification')

let checksumString = ''	

// Watch the site for changes...
function siteWatcher(){

	// Check to see if there is a seed checksum
	if(!checksumString){
		// Create the first checksum and return
		return request(cfg.siteToMonitor, function initialRequestCallback(error, response, body){

			if(error)return console.error(error)
			else checksumString = checksum(body)
	    console.log(checksumString) // Show the checksum. 

		}) // end request

	}
	else{
		// Compare current checksum with latest request body 
		return request(cfg.siteToMonitor, function recurringRequestCallback(error, response, body){

			if(error)return console.error(error)
			// Do the comparison
			else{
				if(checksumString != checksum(body)){
					// They are not the same so send notification 
					console.log('Sites are not the same.')
					// Send the SMS to administrators
					return twilio.sendSMSNotification(`The site, ${cfg.siteToMonitor}, has changed!`)
				}
	  	} // end else
		}) // end request
	} // end else

} // end siteWatcher

// Start the job to check every 5 seconds
var job = new cronJob('*/5 * * * * *', siteWatcher, function endCronJob(){
    console.log('cronJob ended')
  },
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
);

job.start()




