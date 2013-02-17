# Calendar Puzzle

### Puzzle Description

This puzzle is a calendar rendering problem. The input is a list of events and the output is a calendar display similar to Outlook, Google Calendar, etc. Although there is a decent amount of front-end work, the crux of the problem is finding a robust algorithm for laying out the events. The algorithmic difficulty of this problem is quite high, so candidates who submit a robust solution should be regarded as pretty technical.

### Puzzle Materials

#### Part I:

Write a function (JavaScript) to lay out a series of events on the calendar for a single day.

Events will be placed in a container. The top of the container represents 9am and the bottom represents 9pm. The width of the container will be 620px (10px padding on the left and right) and the height will be 720px (1 pixel for every minute between 9am and 9pm). The objects should be laid out so that they do not visually overlap. If there is only one event at a given time slot, its width should be 600px.

There are 2 major constraints:

* Every colliding event must be the same width as every other event that it collides width. 
* An event should use the maximum width possible while still adhering to the first constraint.

The input to the function will be an array of event objects with the start and end times of the event. Example (JavaScript):

```javascript
[
  { id: 1, start: 60, end: 120 },  // Event from 10am to 11am
  { id: 2, start: 100, end: 240 }, // Event from 10:40am to 1pm
  { id: 3, start: 700, end: 720 }  // Event from 8:40pm to 9pm 
]
```

The function should return an array of event objects that have the left and top positions set (relative to the top left of the container), in addition to the id, start, and end time.

```javascript
/**
 * Lays out events for a single  day
 *
 * @param {Array} events An array of event objects. Each event object consists
 *                       of a start and end time  (measured in minutes) from 9am,
 *                       as well as a unique id. The start and end time of each
 *                       event will be [0, 720]. The start time will be less than
 *                       the end time.
 *
 * @return {Array} An array of event objects that has the width, the left and top
 *                 positions set, in addition to the id, start and end time. The 
 *                 object should be laid out so that there are no overlapping events.
 *
 * function layOutDay(events) {...}
 */
 ```

#### Part II:

Use your function from Part I to create a web page that is styled with the following calendar events:

* An event that starts at 9:30 am and ends at 11:30 am
* An event that starts at 6:00 pm and ends at 7:00pm
* An event that starts at 6:20pm and ends at 7:20pm
* An event that starts at 7:10pm pm and ends at 8:10 pm

### FAQ

Are frameworks such as JQuery, MooTools, etc. allowed? Yes, but please include the file with your source code.
Is there a maximum bound on the number of events? You can assume a maximum of 100 events for rendering reasons, but your solution should be generalized.
What browsers need to be supported? Your solution should work on all modern standards-compliant browsers.
Does my solution need to match the image pixel for pixel? No, we will not be testing for pixel matching.

## My Solution

Meeting the two major constraints:

* Every colliding event must be the same width as every other event that it collides with. 
* An event should use the maximum width possible while still adhering to the first constraint.

There are essentially two major steps in the solution. Since every event must be the same width as every other event it collides with, an event A that has a duration that collides with an event B will have the same width as B. If an event C collides with B, then it will have the same width as B. If C does not collide with A, however, it will still have the same width as B. The relationship can be thought of mathematically as A = B, B = C, so A = B = C. I call this a collision group. If another event D does not collide with A, B, or C, then it gets it's own collision group. Collision groups each have their own array.

So when the raw events array is parsed, the first event is placed into the first collision group. N events after the first event are checked against all previous events that have already been parsed into collision groups. If event N collides with any event already parsed then it will be placed into the same collision group as the event with which it collides. Each collision group is stored in a two-dimensional array of all collision groups. Every event in a collision group will have the same width as every other event in the same collision group, which satisfies the first major condition of the puzzle.

Consider the following diagram:

```
-----
| A |-----
-----|   |
     | B |
     |   |-----
     -----| C |
          -----

---------------
|      D      |
---------------
```

As in the first example, A = B, B = C, so A = B = C. And D != A = B = C. Events A, B, and C would be placed in the same collision group. Every event above has the same width of every event with which it collides. However, the second major constraint of the puzzle is not satisfied. The events do not use the maximum width possible. See in the following diagram how the widths can be larger than in the first diagram:

```
-------
|  A  |-------
-------|     |
       |  B  |
-------|     |
|  C  |-------
-------

--------------
|      D     |
--------------
```

Algorithmically, the way this is acheived this is to evaluate each collision group separately to find the maximum width which will be applied to all events of the collision group. A new two-dimensional array is needed to serve the purpose of holding a representation of the events that will be rendered to the page. I call this a matrix in order to distinguish it from the collision groups structure, which is also a two-dimensional array. The matrix should be thought of as a two-dimensional representation of rows and columns. Events from an individual collision group that are parsed into the matrix are evaluated against previous events in the matrix in a left-to-right fashion, across columns.

While incrementing columns, if there is no existing last event at the bottom of the current column, then place the current event in the current spot. If there is an existing last event at the bottom of the current column, then check if the current event collides with that existing event. If the current event does not collide, then place the current event in the next row of the current column. Note that the events must be pre-sorted by start time.

Here is an example of evaluation where D does not collide with A, E does not collide with B, and F does not collide with D.

```
1. Insert A.
   Check the last row in column 1.
   It's empty so place in column 1.

[ A ]

2. Insert B.
   Check the last row in column 1.
   Does B collide with A? Yes, so check the last row in column 2.
   It's empty so place in column 2.

[ A, B ]

3. Insert C.
   Check the last row in column 1.
   Does C collide with A? Yes, so check the last row in column 2.
   Does C collide with B? Yes, so check the last row in column 3.
   It's empty so place in column 3.

[ A, B, C ]

4. Insert D.
   Check the last row in column 1.
   Does C collide with A? No, so place in the next row of column 1.

[ A, B, C ]
| D ]

5. Insert E.
   Check the last row in column 1.
   Does E collide with D? Yes, so check the last row in column 2.
   Does E collide with B? No, so place in the next row of column 2.

[ A, B, C ]
| D, E ]

6. Insert F.
   Check the last row in column 1.
   Does F collide with D? No, so place in the next row of column 1.

[ A, B, C ]
| D, E ]
[ F ]
```

Each collision group will have its own matrix. Once all the events in the collision group have been parsed into the matrix, then the matrix can be used to calculate the width and left position of each event. The width of each event in the collision group is the container element width divided by the maximum length of all the rows in the matrix.

The algorithm is robust enough to handle a near infinite number of events. In this example, the number of events rendered inside of the container is limited horizontally and vertically by the widths and heights of the event element contents such as title, as well as the minimum widths and heights derived from the padding and borders on the event elements. Events are not guaranteed not to extend beyond the scope of the container if the event end time extends beyond the end time of 720.

### Organization and Style

The Calendar a class of the FB module. EventCollection and Event are classes of Calendar properties so that they may be referenced via Calendar.EventCollection and Calendar.Event, respectively. A class for the Event exists beyond what the normal event object so that it will be more robust as features are added to the Calendar and the Event object has more functionality added to it.

Method documentation is in JSDoc style and coding style is roughly that of [idiomatic.js](https://github.com/rwldrn/idiomatic.js).

### Dependencies

The only dependency for the calendar is [Lo-Dash](https://github.com/bestiejs/lodash), an optimized version of the JavaScript utility library, [Underscore.js](https://github.com/documentcloud/underscore). The library is used for simple operations such as mapping and sorting, and nothing significant.

[jQuery](https://github.com/jquery/jquery) is used as a dependency in [Jasmine](https://github.com/pivotal/jasmine) testing, in order to more easily identify the positions and dimensions of rendered events.

### Testing

Unit tests are used to verify the expected output of the left and top positions as well as widths and heights of the events after processing. A few sample event collections are tested. Unit tests are performed using [Jasmine](https://github.com/pivotal/jasmine) by navigating to `spec/SpecRunner.html` in the browser.
