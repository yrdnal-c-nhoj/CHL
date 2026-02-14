/**
 * TextClock Experiment
 * @copyright Sebastian Inman
 * @author Sebastian Inman
 * @updated January 19th 2016
 * @version 1.0.0
 */

(function(TextClock, $, undefined) {

    'use strict';


    // ======================================
    // establish public variables and methods
    // ======================================

    TextClock.title       = 'TextClock Javascript Experiment';
    TextClock.time        = new Date();

    // ==========================================
    // establish private variables and parameters
    // ==========================================

    var hour, minute, interval, labels = {

      a:      $('.a'),
      about: $('.about'),
      minutes: $('.minutes'),
      oclock: $('.oclock'),

      hour: {

        last: null,
        this: null

      },

      tense: {

        to:   $('.to'),
        past: $('.after')

      },

      intervals: {

        ten:     $('.ten'),
        five:    $('.five'),
        half:    $('.thirty'),
        twenty:  $('.twenty'),
        quarter: $('.quarter'),

      }

    };

    // =======================================================
    // creates namespace provider which helps isolate
    // implementated code from the global namespace, providing
    // a single point of access for functions and methods.
    // =======================================================
    // this keeps the code more organized and allows the code
    // to be combined into more logical sections.
    // =======================================================

    TextClock.handler = (function() {

      function _handler() {

          var clock = this;

          // ==========================================
          // get the hour and minute values as integers
          // ==========================================

          this.getTimeValues = function() {

            TextClock.time = new Date();

            interval = 60 - TextClock.time.getSeconds() === 60 ? 0 : 60 - TextClock.time.getSeconds();

            hour   = TextClock.time.getHours() >= 12 ? TextClock.time.getHours() - 12 : TextClock.time.getHours();
            minute = TextClock.time.getMinutes();

            // ===========================================
            // set the current and previous hour selectors
            // ===========================================

            labels.hour.last = $('._' + hour.toString());
            labels.hour.this = $('._' + (hour + 1).toString());

          };

          // ====================================
          // add classes to an object of elements
          // ====================================

          this.addClasses = function(labels, classes) {

            $.each(labels, function() {

              $(this).addClass(classes);

            });

          };

          // =========================================
          // remove classes from an object of elements
          // =========================================

          this.removeClasses = function(labels, classes) {

            $.each(labels, function() {

              $(this).removeClass(classes);

            });

          };

          // =======================================
          // update the labels based on current time
          // =======================================

          this.updateTime = function() {

            clock.getTimeValues();

            console.log('update time: ' + hour + ':' + minute);

            // ====================
            // set the current hour
            // ====================

            if(minute === 60) {

              clock.removeClasses([

                labels.about,
                labels.intervals.five,
                labels.tense.to,

              ], 'active');

              clock.addClasses([

                labels.oclock,
                labels.hour.this

              ], 'active');

            // ============================
            // five minutes until next hour
            // ============================

            }else if(minute > 57) {

              clock.removeClasses([

                labels.intervals.five,
                labels.minutes,
                labels.tense.to,

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.hour.this,
                labels.oclock

              ], 'active');

            // ===========================
            // ten minutes until next hour
            // ===========================

            }else if(minute > 55) {

              clock.removeClasses([

                labels.intervals.ten

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.intervals.five,
                labels.minutes,
                labels.tense.to,
                labels.hour.this,
                labels.oclock

              ], 'active');

            // ===========================
            // ten minutes until next hour
            // ===========================

            }else if(minute === 55) {

              clock.removeClasses([

                labels.about,
                labels.intervals.ten

              ], 'active');

              clock.addClasses([

                labels.intervals.five,
                labels.minutes,
                labels.tense.to,
                labels.hour.this,
                labels.oclock

              ], 'active');

            }else if(minute > 52) {

              clock.removeClasses([

                labels.intervals.ten

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.intervals.five,
                labels.minutes,
                labels.tense.to,
                labels.hour.this,
                labels.oclock

              ], 'active');

            // ===============================
            // fifteen minutes until next hour
            // ===============================

            }else if(minute > 50) {

              clock.removeClasses([

                labels.a,
                labels.intervals.quarter

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.intervals.ten,
                labels.minutes,
                labels.tense.to,
                labels.hour.this,
                labels.oclock

              ], 'active');

            // ===============================
            // fifteen minutes until next hour
            // ===============================

            }else if(minute === 50) {

              clock.removeClasses([

                labels.about,
                labels.a,
                labels.intervals.quarter

              ], 'active');

              clock.addClasses([

                labels.intervals.ten,
                labels.minutes,
                labels.tense.to,
                labels.hour.this,
                labels.oclock

              ], 'active');

            }else if(minute > 47) {

              clock.removeClasses([

                labels.a,
                labels.intervals.quarter

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.intervals.ten,
                labels.minutes,
                labels.tense.to,
                labels.hour.this,
                labels.oclock

              ], 'active');

            // ==============================
            // twenty minutes until next hour
            // ==============================

            }else if(minute > 45) {

              clock.removeClasses([

                labels.intervals.five,
                labels.intervals.ten,
                labels.intervals.twenty

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.a,
                labels.intervals.quarter,
                labels.tense.to,
                labels.hour.this,
                labels.oclock

              ], 'active');

            // ==============================
            // twenty minutes until next hour
            // ==============================

            }else if(minute === 45) {

              clock.removeClasses([

                labels.about,
                labels.intervals.five,
                labels.intervals.ten,
                labels.intervals.twenty

              ], 'active');

              clock.addClasses([

                labels.a,
                labels.intervals.quarter,
                labels.tense.to,
                labels.hour.this,
                labels.oclock

              ], 'active');

            }else if(minute > 42) {

              clock.removeClasses([

                labels.intervals.twenty

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.a,
                labels.intervals.quarter,
                labels.tense.to,
                labels.hour.this,
                labels.oclock

              ], 'active');

            // ===========================
            // thiry minutes past the hour
            // ===========================

            }else if(minute > 40) {

              clock.removeClasses([

                labels.hour.last,
                labels.tense.past,
                labels.intervals.half

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.intervals.twenty,
                labels.minutes,
                labels.tense.to,
                labels.hour.this,
                labels.oclock

              ], 'active');

            // ===========================
            // thiry minutes past the hour
            // ===========================

            }else if(minute === 40) {

              clock.removeClasses([

                labels.about,
                labels.hour.last,
                labels.tense.past,
                labels.intervals.half

              ], 'active');

              clock.addClasses([

                labels.intervals.twenty,
                labels.minutes,
                labels.tense.to,
                labels.hour.this,
                labels.oclock

              ], 'active');

            }else if(minute > 34) {

              clock.removeClasses([

                labels.intervals.half,
                labels.tense.past,
                labels.hour.last

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.intervals.twenty,
                labels.minutes,
                labels.tense.to,
                labels.hour.this,
                labels.oclock

              ], 'active');

            // ============================
            // twenty minutes past the hour
            // ============================

            }else if(minute > 30) {

              clock.removeClasses([

                labels.intervals.twenty

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.intervals.half,
                labels.minutes,
                labels.tense.past,
                labels.hour.last,
                labels.oclock

              ], 'active');

            // ============================
            // twenty minutes past the hour
            // ============================

            }else if(minute === 30) {

              clock.removeClasses([

                labels.about,
                labels.intervals.twenty

              ], 'active');

              clock.addClasses([

                labels.intervals.half,
                labels.minutes,
                labels.tense.past,
                labels.hour.last,
                labels.oclock

              ], 'active');

            }else if(minute > 24) {

              clock.removeClasses([

                labels.intervals.twenty

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.intervals.half,
                labels.minutes,
                labels.tense.past,
                labels.hour.last,
                labels.oclock

              ], 'active');

            // =============================
            // fifteen minutes past the hour
            // =============================

            }else if(minute > 20) {

              clock.removeClasses([

                labels.a,
                labels.intervals.quarter

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.intervals.twenty,
                labels.minutes,
                labels.tense.past,
                labels.hour.last,
                labels.oclock

              ], 'active');

            // =============================
            // fifteen minutes past the hour
            // =============================

            }else if(minute === 20) {

              clock.removeClasses([

                labels.about,
                labels.a,
                labels.intervals.quarter

              ], 'active');

              clock.addClasses([

                labels.intervals.twenty,
                labels.minutes,
                labels.tense.past,
                labels.hour.last,
                labels.oclock

              ], 'active');

            }else if(minute > 17) {

              clock.removeClasses([

                labels.a,
                labels.intervals.quarter

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.intervals.twenty,
                labels.minutes,
                labels.tense.past,
                labels.hour.last,
                labels.oclock

              ], 'active');

            // =========================
            // ten minutes past the hour
            // =========================

            }else if(minute > 15) {

              clock.removeClasses([

                labels.intervals.ten,
                labels.minutes,

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.a,
                labels.intervals.quarter,
                labels.tense.past,
                labels.hour.last,
                labels.oclock

              ], 'active');

            // =========================
            // ten minutes past the hour
            // =========================

            }else if(minute === 15) {

              clock.removeClasses([

                labels.about,
                labels.intervals.ten,
                labels.minutes

              ], 'active');

              clock.addClasses([

                labels.a,
                labels.intervals.quarter,
                labels.tense.past,
                labels.hour.last,
                labels.oclock

              ], 'active');

            }else if(minute > 12) {

              clock.removeClasses([

                labels.minutes,
                labels.intervals.ten

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.a,
                labels.intervals.quarter,
                labels.tense.past,
                labels.hour.last,
                labels.oclock

              ], 'active');

            // ==========================
            // five minutes past the hour
            // ==========================

            }else if(minute > 10) {

              clock.removeClasses([

                labels.a,
                labels.intervals.five

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.intervals.ten,
                labels.minutes,
                labels.tense.past,
                labels.hour.last,
                labels.oclock

              ], 'active');

            // ==========================
            // five minutes past the hour
            // ==========================

            }else if(minute === 10) {

              clock.removeClasses([

                labels.about,
                labels.a,
                labels.intervals.five

              ], 'active');

              clock.addClasses([

                labels.intervals.ten,
                labels.minutes,
                labels.tense.past,
                labels.hour.last,
                labels.oclock

              ], 'active');

            }else if(minute > 7) {

              clock.removeClasses([

                labels.intervals.five,

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.intervals.ten,
                labels.minutes,
                labels.tense.past,
                labels.hour.last,
                labels.oclock

              ], 'active');

            // ===========
            // on the hour
            // ===========

            }else if(minute > 5) {

              clock.addClasses([

                labels.about,
                labels.intervals.five,
                labels.minutes,
                labels.tense.past,
                labels.hour.last,
                labels.oclock

              ], 'active');

            // ===========
            // on the hour
            // ===========

            }else if(minute === 5) {

              clock.removeClasses([

                labels.about,
                labels.tense.to

              ], 'active');

              clock.addClasses([

                labels.intervals.five,
                labels.minutes,
                labels.tense.past,
                labels.hour.last,
                labels.oclock

              ], 'active');

            }else if(minute > 2) {

              clock.removeClasses([

                labels.tense.to

              ], 'active');

              clock.addClasses([

                labels.about,
                labels.intervals.five,
                labels.minutes,
                labels.tense.past,
                labels.hour.last,
                labels.oclock

              ], 'active');

            }else{

              clock.removeClasses([

                labels.about,
                labels.minutes,
                labels.tense.to,
                labels.tense.past

              ], 'active');

              clock.addClasses([

                labels.oclock,
                labels.hour.last

              ], 'active');

            }

          };


          // ====================
          // initialize the clock
          // ====================

          this.init = function() {

              clock.getTimeValues();

              clock.updateTime();

              setInterval(function() {

                clock.updateTime();

              }, 60000);

              return this;

          };

          return clock.init();

        }

        // ===========================
        // create a new handler object
        // ===========================

        return new _handler();

    }());

// ========================================
// assign TextClock to the global namespace
// ========================================

}(window.TextClock = window.TextClock || {}, jQuery));