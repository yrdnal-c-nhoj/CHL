function clock() {
  function addZero(i) {
      if (i < 10) {
          i = "0" + i;
      }
      return i;
  }
  var ampm;
  var hours;
  var d = new Date();
  var h = (d.getHours());
  if (h > 12) {
    hours = ((h + 11) % 12) + 1;
    hours = addZero(hours);
    ampm = "pm";
  } else if (h === 12) {
    hours = 12;
    ampm = "pm";
  } else if (h === 0) {
    hours = 12;
    ampm = "am";
  } else if (h < 12){
    hours = addZero(h);
    ampm = "am";
  }
  var m = addZero(d.getMinutes());
  var s = addZero(d.getSeconds());

  var hour = hours.toString().split("");
  var minutes = m.toString().split("");
  var seconds = s.toString().split("");

  return output = [{"hour": hour}, {"minutes": minutes}, {"seconds": seconds}, ampm];
}



$(document).ready(function () {
  var ampm = "am";
  var hoursTens, hoursOnes, minutesTens, minutesOnes, secondsTens, secondsOnes;

  // Reusable function to handle animation triggering
  function flipNumber(id, newValue, oldValue) {
    if (newValue !== oldValue) {
      // Set new value on the back but keep front and bottom the same for now
      $(id + '-top-back h1').html(newValue);

      // Add animation classes for flipping
      $(id + '-top-front').addClass('animate-front').delay(200).queue(function (next) {
        $(this).removeClass('animate-front');
        // Now update the top-front panel AFTER flip completes
        $(id + '-top-front h1').html(newValue);
        next();
      });

      $(id + '-top-back').addClass('animate-back').delay(200).queue(function (next) {
        $(this).removeClass('animate-back');
        // Now update the bottom-bottom panel AFTER the flip completes
        $(id + '-bottom-bottom h1').html(newValue);
        next();
      });
    }
  }

  // Update the clock at intervals
  setInterval(function () {
    clock();

    // Seconds
    var newSecondsTens = output[2].seconds[0];
    var newSecondsOnes = output[2].seconds[1];
    flipNumber('#seconds-tens', newSecondsTens, secondsTens);
    flipNumber('#seconds-ones', newSecondsOnes, secondsOnes);
    secondsTens = newSecondsTens;
    secondsOnes = newSecondsOnes;

    // Minutes
    var newMinutesTens = output[1].minutes[0];
    var newMinutesOnes = output[1].minutes[1];
    flipNumber('#minutes-tens', newMinutesTens, minutesTens);
    flipNumber('#minutes-ones', newMinutesOnes, minutesOnes);
    minutesTens = newMinutesTens;
    minutesOnes = newMinutesOnes;

    // Hours
    var newHoursTens = output[0].hour[0];
    var newHoursOnes = output[0].hour[1];
    flipNumber('#hours-tens', newHoursTens, hoursTens);
    flipNumber('#hours-ones', newHoursOnes, hoursOnes);
    hoursTens = newHoursTens;
    hoursOnes = newHoursOnes;

    // AM/PM
    var newAmPM = output[3];
    if (newAmPM !== ampm) {
      ampm = newAmPM;
      $('.ampm').html(ampm);
    }
  }, 1000); // End of setInterval function
}); // End of document ready