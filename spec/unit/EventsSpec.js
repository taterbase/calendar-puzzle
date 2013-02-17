describe('Calendar Events', function() {
  var calendar;

  beforeEach(function() {
    calendar = new FB.Calendar();
  });

  describe('with original sample events', function() {
    var events;

    beforeEach(function() {
      events = [
        { id: 3, start: 700, end: 720 },
        { id: 2, start: 100, end: 240 },
        { id: 1, start: 60, end: 120 }
      ];
    });

    it('should sort unsorted events by start time', function() {
      var expected = [
        { id: 1, start: 60, end: 120, top: null, left: null, width: null, height: null },
        { id: 2, start: 100, end: 240, top: null, left: null, width: null, height: null },
        { id: 3, start: 700, end: 720, top: null, left: null, width: null, height: null }
      ];

      calendar.addEvents(events);
      expect(calendar.eventCollection.raw()).toEqual(expected);
    });

    it('should calculate positions and widths', function() {
      var expected = [
        { id: 1, start: 60, end: 120, top: 60, left: 9, width: 300, height: 59 },
        { id: 2, start: 100, end: 240, top: 100, left: 309, width: 300, height: 139 },
        { id: 3, start: 700, end: 720, top: 700, left: 9, width: 600, height: 19 }
      ];

      calendar.addEvents(events);
      expect(calendar.layOutDay()).toEqual(expected);
    });
  });

  describe('with events from part 1 diagram', function() {
    var events;

    beforeEach(function() {
      events = [
        { id: 1, start: 60, end: 179 },
        { id: 2, start: 180, end: 299 },
        { id: 3, start: 300, end: 419 },
        { id: 4, start: 120, end: 239 },
        { id: 5, start: 240, end: 330 },
        { id: 6, start: 180, end: 360 },
        { id: 7, start: 480, end: 540 }
      ];
    });

    it('should calculate positions and widths', function() {
      var expected = [
        { id: 1, start: 60, end: 179, top: 60, left: 9, width: 200, height: 118 },
        { id: 4, start: 120, end: 239, top: 120, left: 209, width: 200, height: 118 },
        { id: 2, start: 180, end: 299, top: 180, left: 9, width: 200, height: 118 },
        { id: 6, start: 180, end: 360, top: 180, left: 409, width: 200, height: 179 },
        { id: 5, start: 240, end: 330, top: 240, left: 209, width: 200, height: 89 },
        { id: 3, start: 300, end: 419, top: 300, left: 9, width: 200, height: 118 },
        { id: 7, start: 480, end: 540, top: 480, left: 9, width: 600, height: 59 }
      ];

      calendar.addEvents(events);
      expect(calendar.layOutDay()).toEqual(expected);
    });
  });

  describe('with consecutive events for the first three hours', function() {
    var events;

    beforeEach(function() {
      events = [
        { id: 1, start: 0, end: 59 },
        { id: 2, start: 60, end: 119 },
        { id: 3, start: 120, end: 179 }
      ];
    });

    it('should calculate positions and widths', function() {
      var expected = [
        { id: 1, start: 0, end: 59, top: 0, left: 9, width: 600, height: 58 },
        { id: 2, start: 60, end: 119, top: 60, left: 9, width: 600, height: 58 },
        { id: 3, start: 120, end: 179, top: 120, left: 9, width: 600, height: 58 }
      ];

      calendar.addEvents(events);
      expect(calendar.layOutDay()).toEqual(expected);
    });
  });

  describe('with required sample events', function() {
    var events;

    beforeEach(function() {
      events = [
        { id: 1, start: 30, end: 180 },
        { id: 2, start: 540, end: 600 },
        { id: 3, start: 560, end: 620 },
        { id: 4, start: 610, end: 670 }
      ];
    });

    it('should calculate positions and widths', function() {
      var expected = [
        { id: 1, start: 30, end: 180, top: 30, left: 9, width: 600, height: 149 },
        { id: 2, start: 540, end: 600, top: 540, left: 9, width: 300, height: 59 },
        { id: 3, start: 560, end: 620, top: 560, left: 309, width: 300, height: 59 },
        { id: 4, start: 610, end: 670, top: 610, left: 9, width: 300, height: 59 }
      ];

      calendar.addEvents(events);
      expect(calendar.layOutDay()).toEqual(expected);
    });
  });


  describe('without events', function() {
    it('requires an array of events', function () {
      expect(function() {
        calendar.addEvents();
      }).toThrow('Events must be an array.');
    });

    it('requires at least one event', function() {
      expect(function() {
        calendar.addEvents([]);
      }).toThrow('At least one event is required.');
    });

    it('cannot be rendered', function() {
      expect(function() {
        calendar.render();
      }).toThrow('There are no events to render.');
    });
  });

  describe('with invalid events', function() {
    var events;

    it('requires an id', function() {
      events = [{ start: 700, end: 720 }];

      expect(function() {
        calendar.addEvents(events);
      }).toThrow('Event id is required.');
    });

    it('requires a start time', function() {
      events = [{ id: 3, end: 720 }];

      expect(function() {
        calendar.addEvents(events);
      }).toThrow('Event start is required.');
    });

    it('requires an end time', function() {
      events = [{ id: 3, start: 700 }];

      expect(function() {
        calendar.addEvents(events);
      }).toThrow('Event end is required.');
    });

    it('requires end time to be greater than start time', function() {
      events = [{ id: 3, start: 60, end: 0 }];

      expect(function() {
        calendar.addEvents(events);
      }).toThrow('Event end time must be greater than start time.');
    });
  });
});
