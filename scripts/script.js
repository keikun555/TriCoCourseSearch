var courses
var currentResults = []
var selected = []
var classSched = []

function main() {
  // /*called when body loads*/
  // scheduler.init('scheduler_here', new Date(), "week");
  // loadData()
  // $('#dropdown').find('a').click(function(e) {
  //   $('#semester').text(this.innerHTML);
  //   $('#semester').append('<span class="caret"></span>');
  // });
  // $("#search").on("keydown", function(e) {
  //   if (e.keyCode === 13) {
  //     //checks whether the pressed key is "Enter"
  //     search();
  //   }
  // });
  // $(":checkbox").mouseup(function() {
  //   $(this).blur();
  // })
  scheduler.config.separate_short_events = true;
  scheduler.config.repeat_date = "%m/%d/%Y";
  scheduler.config.hour_date = "%g:%i%a";
  //scheduler.config.hour_size_px = 42;
  scheduler.xy.scale_height = 20;
  scheduler.xy.scroll_width = 0;
  scheduler.config.calendar_time = "%g:%i%a";
  scheduler.config.xml_date = "%m/%d/%Y %g:%i%a"
  scheduler.config.api_date = "%m/%d/%Y %g:%i%a"
  scheduler.config.include_end_by = true;
  scheduler.config.start_on_monday = false;
  /*called when body loads*/
  scheduler.init('scheduler_here', new Date(), "week");
  scheduler.config.repeat_precise = true;

  loadData()
  $('#dropdown').find('a').click(function(e) {
    $('#semester').text(this.innerHTML);
    $('#semester').append('<span class="caret"></span>');
  });
  $("#search").on("keydown", function(e) {
    if (e.keyCode === 13) {
      //checks whether the pressed key is "Enter"
      search();
    }
  });
  $(":checkbox").mouseup(function() {
      $(this).blur();
    })
    //Changes***
  //createEvent("MWF Course", "1000", "9:30am", "10:20am", "MWF");
  //createEvent("TTH Course", "2000", "1:10pm", "2:30pm", "TTH");
}

function timeConvert(str) {
  var p = str.split(':'),
    s = 0,
    m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10);
    m *= 60;
  }
  return s;
}

function createEvent(course_name, course_number, start_time, end_time, repeat) {
  var sd = "01/17/2017 "
  var ed = "05/30/2017 "
  var el = 60 * (timeConvert(end_time) - timeConvert(start_time))
  console.log(el)
  var repNums
  switch (repeat) {
    case "MWF":
      repNums = "1,3,5"
      break;
    case "TTH":
      repNums = "2,4"
      break;
    case "F":
      repNums = "5"
      break;
    case "W":
      repNums = "3"
      break;
    case "M":
      repNums = "1"
      break;
    case "T":
      repNums = "2"
      break;
    case "TH":
      repNums = "4"
      break;
    case "MW":
      repNums = "1,3"
      break;
    default:
      repNums = ""
  }
  var id = scheduler.addEvent({
    id: course_number,
    start_date: "01/17/2017 " + start_time,
    end_date: "05/27/2017 " + end_time,
    rec_type: "week_1___" + repNums,
    event_length: el,
    event_pid: 0,
    text: course_name
  })
}
//Changes***

function loadData() {
  var campuses = ['Bryn_Mawr', 'Haverford', 'Swarthmore'];
  var semesters = ['Fall_2015', 'Fall_2016', 'Spring_2016', 'Spring_2017'];
  courses = {};
  var urlStub = 'https://raw.githubusercontent.com/keikun555/triCoCourseSearch/master/data/';
  //formats to json of campuses of semesters of courses
  for (campus in campuses) {
    var cam = {};
    for (semester in semesters) {
      //gets data from url, for every semester for every campus
      url = urlStub + campuses[campus] + "/" + semesters[semester] + ".json";
      sem = $.parseJSON($.ajax({
        url: url,
        async: false,
        success: function(data) {}
      })["responseText"]);
      cam[semesters[semester]] = sem;
    }
    courses[campuses[campus]] = cam;
  }
  console.log(courses)
}

function find(searchText, semester, campuses) {
  /*given string, chosen semester, and chosen campuses, return list of courses within conditions*/
  var options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      "Course Title",
      "Registration ID",
      "Room Location"
    ]
  };
  list = []
  for (campus in campuses) {
    tempList = courses[campuses[campus]][semester].reduce(function(L, element) {
      return L.concat(element);
    }, [])
    for (course in tempList) {
      list.push(tempList[course]); //creating master list to search from
    }
  }
  //search the list
  var fuse = new Fuse(list, options)
  return fuse.search(searchText)
    //
    // result = [];
    // for (campus in campuses) {
    //     result.push(courses[campuses[campus]][semester].filter(function(course) {
    //         values = []
    //         for (element in course) {
    //             values.push(course[element])
    //         }
    //         for (word in searchText) {
    //             for (value in values) {
    //                 if (values[value].toLowerCase().includes(searchText[word].toLowerCase())) {
    //                     return true
    //                 }
    //             }
    //         }
    //         return false
    //     }));
    // }
    // result = result.reduce(function(list, campus) {
    //     return list.concat(campus);
    // }, []);
    // return result
}

function search() {
  var table = document.getElementById("table");
  var tableHeader = '<thead><tr><th style="text-align: center;">Course Name</th><th style="text-align: center;">Registration ID</th><th style="text-align: center;">Course Number</th><th style="text-align: center;">Time Offered</th><th style="text-align: center;">Instructor</th><th style="text-align: center;">Campus</th></tr></thead>'
  searchText = document.getElementById("search").value.trim() //.split(' ');
    //if nothing in searchText, shows all courses in given campus and semester
  semester = document.getElementById('semester').textContent.split(' ');
  if (semester[0] === 'Select') {
    //if no semester is selected, choose most recent one
    semester = $('#dropdown').find('a').first().text().split(' ');
  }
  semester = semester.reverse().join('_');
  allcampuses = ["brynmawr", "haverford", "swarthmore"];
  campuses = allcampuses.filter(function(campus) {
    return ($('#' + campus).attr('aria-pressed') === 'true');
  });
  if (campuses.length <= 0) {
    //if no campuses are selected, choose all campuses
    campuses = allcampuses
  }
  if (campuses.includes('brynmawr')) {
    campuses[campuses.indexOf('brynmawr')] = 'Bryn_Mawr';
  }
  for (campus in campuses) {
    campuses[campus] = campuses[campus].charAt(0).toUpperCase() + campuses[campus].slice(1);
  }
  result = find(searchText, semester, campuses);
  currentResults = result
  $(table).html(tableHeader)
  if (result.length > 0) {
    for (course in result) {
      var name = result[course]['Course Title'];
      var id = result[course]['Registration ID'];
      var num = result[course]['CRN'];
      var time = "Not Specified"
      try {
        time = result[course]['Time And Days'].split(', ').join(',').split(',').join('<br>');
      } catch (e) {}
      var prof = "Not Specified"
      try {
        prof = result[course]['Instructor'].split(', ').join(',').split(',').join(', ');
      } catch (e) {}
      var camp
      try {
        camp = result[course]['Campus'].split('_').join(' ');
      } catch (e) {}
      var row;
      row = `<tbody><tr onmouseleave='if($(this).attr("row_pressed")==="false"){this.className="tableRow"}' onmouseenter="rowHover(this)" id="${course}" type="checkbox" class="tableRow" data-toggle="buttons-toggle" onclick="update(this)" row_pressed="false" campus="${camp}"><td>${name}</td><td>${id}</td><td>${num}</td><td>${time}</td><td>${prof}</td><td>${camp}</td></tr></tbody>`
      $(table).append(row);
    }
  } else {
    $(table).html('<div class="alert alert-warning"><strong>No classes found!</strong></div>')
  }
}

function rowHover(row) {
  if ($(row).attr("row_pressed") === "false") {
    switch ($(row).attr('campus')) {
      case "Swarthmore":
        row.className = "rowSHover"
        break;
      case "Haverford":
        row.className = "rowHHover"
        break;
      case "Bryn Mawr":
        row.className = "rowBMHover"
        break;
      default:
        break;
    }
  }
}

function update(row) {
  course = currentResults[row.id]
  if ($(row).attr('row_pressed') === "false") {
    $(row).attr('row_pressed', "true")
    switch ($(row).attr('campus')) {
      case "Swarthmore":
        row.className = "rowSActive"
        break;
      case "Haverford":
        row.className = "rowHActive"
        break;
      case "Bryn Mawr":
        row.className = "rowBMActive"
        break;
      default:
        break;
    }
    selected.push(course)
    index = courses[course["Campus"]][course["Semester"]].indexOf(course)
    if (index > -1) {
      courses[course["Campus"]][course["Semester"]].splice(index, 1)
    }
    //console.log(`Added ${course["Course Title"]} (${course["Campus"]}) to selected`)
  } else if ($(checkbox).attr('row_pressed') === "true") {
    $(checkbox).attr('row_pressed', "false")
    checkbox.className = "tableRow"
    courses[course["Campus"]][course["Semester"]].push(course)
    index = selected.indexOf(course)
    if (index > -1) {
      selected.splice(index, 1)
    }
    //console.log(`Removed ${course["Course Title"]} (${course["Campus"]}) from selected`)
  }
  classSched = []
  scheduler.parse(classSched, "json")
  for (course in selected) {
    times = selected[course]['Time And Days'].split(', ').join(',').split(',')
    if (!(times[0] === "")) {
      for (time in times) {
        //console.log(times[time])
        delTime = times[time].split(/ |-/)
          //console.log(delTime)
        createEvent(selected[course]["Course Title"], selected[course]["CRN"], delTime[1], delTime[2], delTime[0]);
      }
    }
    else {
      scheduler.addEventNow({
        id: selected[course]["CRN"],
        start_date: "01/01/2017 12:00am",
        end_date: "01/01/2017 12:00am",
        text: selected[course]["Course Title"]
      })
    }
  }
  //console.log(classSched)

}

function show_minical() {
  if (scheduler.isCalendarVisible()) {
    scheduler.destroyCalendar();
  } else {
    scheduler.renderCalendar({
      position: "dhx_minical_icon",
      date: scheduler._date,
      navigation: true,
      handler: function(date, calendar) {
        scheduler.setCurrentView(date);
        scheduler.destroyCalendar()
      }
    });
  }
}

/* used for debugging
function get_type(thing) {
  if (thing === null) return "[object Null]"; // special case
  return Object.prototype.toString.call(thing);
}
*/
