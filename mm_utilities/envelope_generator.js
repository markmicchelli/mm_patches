autowatch = 1;

inlets = 4;
outlets = 2;

setinletassist(0, "(int) 0-indexed sustain segment");
setinletassist(1, "(list) x values of breakpoints");
setinletassist(2, "(list) y values of breakpoints");
setinletassist(3, "(list) 0/1 sustain flags of breakpoints");

setoutletassist(0, "(list) to line message (y values)");
setoutletassist(0, "(list) to line message (x values) [i.e., time]");

var x_values = [];
var y_values = [];
var sustain_flags = [];
var x_value_diffs = [0];

function msg_int(segment_index) {
  var current_segment_index = 0;
  var segment = [];
  var start_x = x_values[0];
  var start_y = y_values[0];
  var end_x = -1;

  // start counting at 1 b/c line messages are broken into 2 segments (initial + line)
  for (var i = 1; i < x_values.length; i += 1) {
    segment.push(y_values[i]);
    segment.push(x_value_diffs[i]);

    if (sustain_flags[i] === 1) {
	  if (current_segment_index === segment_index) {
		end_x = x_values[i];
        break;
      } else {
        current_segment_index += 1;
        start_x = x_values[i]
        start_y = y_values[i];
        segment = [];
      }
    }
  }
  if (end_x === -1) {
    end_x = x_values[x_values.length - 1];
  }
  outlet(1, start_x);
  outlet(1, [end_x, end_x - start_x]);
  outlet(0, start_y);
  outlet(0, segment);
}


function list() {
  var l = []
  for (var i = 0; i < arguments.length; i += 1) {
    l.push(arguments[i]);
  }
  if (inlet === 1) {
    x_values = l;
    for (var i = 1; i < x_values.length; i += 1) {
	  x_value_diffs[i] = x_values[i] - x_values[i - 1];
    }
  } else if (inlet === 2) {
    y_values = l;
  } else if (inlet === 3) {
    sustain_flags = l;
  }
}
