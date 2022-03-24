/**
 * Fire Alarm Alerting Macro
 * 
 * Uses The xStatus RoomAnalytics T3Alarm Detected API to alert users in a room if there is a fire alarm.
 * 
 * Contributers:
 * Jeremy Worden (jeremy@lookingpoint.com)
 */

const xapi = require('xapi');

const alertTime = 60; //Time in seconds to display alert on screen and touch 10


//This enables the Room Analytics required for the macro to function properly
function init() {
    xapi.config.set('RoomAnalytics T3AlarmDetection Mode', 'On')
    .catch((error) => { console.error(error); });
    console.log('RoomAnalytics T3AlarmDetection mode been enabled');
}

function alertDisplay() {
   const text2Display = 'May I have your attention please. May I have your attention please. There is a fire emergency reported in the building. Please exit the building by taking a left out of this room and using exit stair #3. Do not use the elevators.”';

	xapi.command(
	  	'UserInterface Message Alert Display',
	  	{Title : 'Fire Alarm Detected!',
	  	Text : (text2Display),
	  	Duration : (alertTime) }
	)
}

//Run init function to setup prerequisite configurations
init();

// Fetch current count and set feedback for change in peoplecount
xapi.status
    .get('RoomAnalytics T3Alarm Detected')
    .then((status) => {
        
        if (status == "True") {
            console.log('Fire Alarm detected notifying users');
            alertDisplay();
        }

        // // Listen to events
        console.log('Adding feedback listener to: RoomAnalytics T3Alarm Detection');
        xapi.status.on('RoomAnalytics T3Alarm Detected', (status) => {
            if (status == "True") {
                console.log('Fire Alarm detected notifying users');
                alertDisplay();
            }
        })
    })
    .catch((err) => {
        console.log(`Failed to fetch T3Alarm, err: ${err.message}`);
        console.log(`Are you interacting with a Room Series? exiting...`);
        xapi.close();
    });
