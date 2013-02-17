/*!
 * main.js
 *
 * Calendar Puzzle
 * Copyright (c) 2013 Greg Stallings
 */

;(function(window, document, undefined) {

  // Note: See spec/unit/CalendarSpec.js for more test data

  // Events from part 1
  var events = [
    { id: 1, start: 60, end: 179 },
    { id: 2, start: 180, end: 299 },
    { id: 3, start: 300, end: 419 },
    { id: 4, start: 120, end: 239 },
    { id: 5, start: 240, end: 330 },
    { id: 6, start: 180, end: 360 },
    { id: 7, start: 480, end: 540 }
  ];

  // Events required for the puzzle
  // An event that starts at 9:30 am and ends at 11:30 am
  // An event that starts at 6:00 pm and ends at 7:00pm
  // An event that starts at 6:20pm and ends at 7:20pm
  // An event that starts at 7:10pm pm and ends at 8:10pm

  // var events = [
  //   { id: 1, start: 30, end: 180 },
  //   { id: 2, start: 540, end: 600 },
  //   { id: 3, start: 560, end: 620 },
  //   { id: 4, start: 610, end: 670 }
  // ];

  var calendar = new FB.Calendar(events, {
    container: 'calendar-event-container'
  });

  window.onload = function() {
    calendar.render();
  };

})(window, document);
