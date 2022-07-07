const xapi = require('xapi');

var totalSeconds;
const everySecond = 1000;
var counter;
var clock;

function twoDigits(n){
  if(n < 10)
  return '0' + n; // Add leading zero
  return n;
}

function connected_timer(){
  var time = xapi.Command.Time.DateTime.Get().catch(console.log); 
  Promise.all([time]).then((data) => { 

  const hour = data[0].Hour; 
  const minute = data[0].Minute; 
  const seconds = data[0].Second; 

  clock = twoDigits(hour)+":"+twoDigits(minute)+":"+twoDigits(seconds);
  xapi.Command.UserInterface.Message.TextLine.Display( {X: 9400, Y: 500, Text: clock});
  totalSeconds++;

})}


function startcounter(){  
  totalSeconds=2;
  counter = setInterval(connected_timer, everySecond);
}

function stopcounter(){
  clearInterval(counter);
  xapi.command('UserInterface Message TextLine Clear');
}

xapi.event.on('CallSuccessful', startcounter);
xapi.event.on('CallDisconnect', stopcounter);
