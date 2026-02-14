$(document).ready(function () {
  (function (clockJS, $) {

    var currentTime, hour, minute, interval;

    function getTimeValues() {
      currentTime = new Date();
      hour = currentTime.getHours() >= 12 ? currentTime.getHours() - 12 : currentTime.getHours();
      minute = currentTime.getMinutes();
    }

    function setTime() {
      updateTime();
      setTimeout(function () {
        updateTime();
        setInterval(function() {
          updateTime();
        }, 60000);
      }, interval * 1000);
    }

    function updateTime() {
      getTimeValues();

      // on the hour
      if (minute >= 58) {
        $('.five').removeClass('active');
        $('.to').removeClass('active');
        $('.oclock').addClass('active');

        $('.' + (hour + 1).toString()).addClass('active');
      } 
      // five to
      else if (minute >= 52) {
        $('.ten').removeClass('active');
        $('.five').addClass('active');
        $('.to').addClass('active');

        $('.' + (hour + 1).toString()).addClass('active');
      }
      //ten to
      else if (minute >= 49) {
        $('.a').removeClass('active');
        $('.quarter').removeClass('active');
        $('.ten').addClass('active');
        $('.to').addClass('active');

        $('.' + (hour + 1).toString()).addClass('active');
      }
      // quarter to
      else if (minute >= 43) {
        $('.twenty').removeClass('active');
        $('.a').addClass('active');
        $('.quarter').addClass('active');
        $('.to').addClass('active');

        $('.' + (hour + 1).toString()).addClass('active');
      }
      // twenty to
      else if (minute >= 36) {
        $('.half').removeClass('active');
        $('.past').removeClass('active');
        $('.twenty').addClass('active');
        $('.to').addClass('active');

        $('.' + hour.toString()).removeClass('active');
        $('.' + (hour + 1).toString()).addClass('active');
      }
      // half past
      else if (minute >= 26) {
        $('.twenty').removeClass('active');
        $('.half').addClass('active');
        $('.past').addClass('active');

        $('.' + (hour).toString()).addClass('active');
      }
      // twenty past
      else if (minute >= 19) {
        $('.a').RemoveClass('active');
        $('.quarter').removeClass('active');
        $('.twenty').addClass('active');
        $('.past').addClass('active');

        $('.' + (hour).toString()).addClass('active');
      }
      // quarter past
      else if (minute >= 13) {
        $('.ten').removeClass('active');
        $('.a').addClass('active');
        $('.quarter').addClass('active');
        $('.past').addClass('active');

        $('.' + (hour).toString()).addClass('active');
      }
      // ten past
      else if (minute >= 9) {
        $('.five').removeClass('active');
        $('.ten').addClass('active');
        $('.past').addClass('active');

        $('.' + (hour).toString()).addClass('active');
      }
      // five past
      else if (minute >= 3) {
        $('.oclock').removeClass('active');
        $('.five').addClass('active');
        $('.past').addClass('active');

        $('.' + (hour).toString()).addClass('active');
      }
      // on the hour
      else {
        $('.oclock').addClass('active');
        $('.' + (hour).toString()).addClass('active');
      }
    }

    clockJS.init = function () {
      getTimeValues();
      interval = 60 - currentTime.getSeconds();
      if (interval === 60) {
        interval = 0;
      }
      setTime();
    };

  }(window.clockJS = window.clockJS || {}, jQuery));

  clockJS.init();

});