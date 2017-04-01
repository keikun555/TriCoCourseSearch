//Global variables
var courses
var currentResults = []
var selected = []
var selectedId = []
var classSched = []
var campuses = ['Bryn_Mawr', 'Haverford', 'Swarthmore'];
var semesters = ['Fall_2015', 'Spring_2016', 'Fall_2016', 'Spring_2017', 'Fall_2017'];
var semesterSchedule = {
  'Fall_2015': {
    'Bryn_Mawr': {
      'start': '08/31/2015',
      'end': '12/10/2015'
    },
    'Haverford': {
      'start': '08/31/2015',
      'end': '12/11/2015'
    },
    'Swarthmore': {
      'start': '08/31/2015',
      'end': '12/11/2015'
    }
  },
  'Spring_2016': {
    'Bryn_Mawr': {
      'start': '01/19/2016',
      'end': '04/29/2016'
    },
    'Haverford': {
      'start': '01/19/2016',
      'end': '04/29/2016'
    },
    'Swarthmore': {
      'start': '01/19/2016',
      'end': '04/29/2016'
    }
  },
  'Fall_2016': {
    'Bryn_Mawr': {
      'start': '08/29/2016',
      'end': '12/08/2016'
    },
    'Haverford': {
      'start': '08/29/2016',
      'end': '12/09/2016'
    },
    'Swarthmore': {
      'start': '08/29/2016',
      'end': '12/06/2016'
    }
  },
  'Spring_2017': {
    'Bryn_Mawr': {
      'start': '01/17/2017',
      'end': '04/28/2017'
    },
    'Haverford': {
      'start': '01/17/2017',
      'end': '04/28/2017'
    },
    'Swarthmore': {
      'start': '01/17/2017',
      'end': '04/28/2017'
    }
  },
  'Fall_2017': {
    'Bryn_Mawr': {
      'start': '09/05/2017',
      'end': '12/14/2017'
    },
    'Haverford': {
      'start': '09/05/2017',
      'end': '12/15/2017'
    },
    'Swarthmore': {
      'start': '09/04/2017',
      'end': '12/12/2017'
    }
  }
}

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
  //$('scheduler_here').collapse("show")
  scheduler.config.separate_short_events = true;
  scheduler.config.repeat_date = "%m/%d/%Y";
  scheduler.config.hour_date = "%g:%i%a";
  //scheduler.config.hour_size_px = 42;
  scheduler.xy.scale_height = 20;
  scheduler.xy.scroll_width = 1;
  scheduler.config.calendar_time = "%g:%i%a";
  scheduler.config.xml_date = "%m/%d/%Y %g:%i%a"
  scheduler.config.api_date = "%m/%d/%Y %g:%i%a"
  scheduler.config.include_end_by = true;
  scheduler.config.start_on_monday = false;
  /*called when body loads*/
  scheduler.init('scheduler_here', new Date(), "week");
  scheduler.config.repeat_precise = true;
  scheduler.config.readonly = true;
  //for exporting recurring events
  scheduler.updateView()
  //scheduler.enableAutoWidth(true)
  $('#calendar').collapse({
    toggle: true
  })
  $('#calendar').on('shown.bs.collapse', function() {
    scheduler.updateView()
  })
  if (semesters[semesters.length - 1].split('_')[0] == "Fall") {
    $("#dropdown").append(`<li class="divider"></li><li class="dropdown-header"><span>${parseInt(semesters[semesters.length - 1].split('_')[1]) + "-" + (parseInt(semesters[semesters.length - 1].split('_')[1])+1)}</span></li>`)
  }
  for (var i = semesters.length - 1; i >= 0; i--) {
    if (semesters[i].split('_')[0] == "Spring") {
      $("#dropdown").append(`<li class="divider"></li><li class="dropdown-header"><span>${parseInt(semesters[i].split('_')[1] - 1) + "-" + parseInt(semesters[i].split('_')[1])}</span></li>`)
    }
    $("#dropdown").append(`<li><a href=#/ style="color: 042A2B;"><span>${semesters[i].split('_')[1] + " " + semesters[i].split('_')[0]}</span></a></li>`);
  }
  $("#dropdown").append('<li class="divider"></li>')

  $('#dropdown').find('a').click(function(e) {
    $('#semester').text($(this).find('span')[0].innerHTML);
    $('#semester').append(' <span class="caret"></span>');
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
  $("[data-toggle=popover]").popover();
  //$("#authors").attr('title', 'The greatest of them all')
  $("#authors").attr('data-content', '<strong>Kei Imada</strong> - <br/>Full Stack Developer<br/><strong>Yichuan Yan</strong> - <br/>Designer<br/>Frontend Developer<br/><strong>Douglass Campbell</strong> - <br/>Frontend Developer<br/><strong>Ryan Jobson</strong> - <br/>Frontend Developer')
  $('#changelog').on('shown.bs.modal', function(e){
    $('#changelogButton').one('focus', function(e){$(this).blur();});
});
  loadData()
  //Changes***
  //createEvent("MWF Course", "1000", "9:30am", "10:20am", "MWF");
  //createEvent("TTH Course", "2000", "1:10pm", "2:30pm", "TTH");
}

function getRRULE(course) {
  //given course event, return RRULE of recurrence
  rec_type = course.rec_type.slice(9).split(",")
  rule = "RRULE:FREQ=WEEKLY;BYDAY="
  rec_values = []
  for (value in rec_type) {
    switch (rec_type[value]) {
      case "1":
        rec_values.push("MO")
        break;
      case "2":
        rec_values.push("TU")
        break;
      case "3":
        rec_values.push("WE")
        break;
      case "4":
        rec_values.push("TH")
        break;
      case "5":
        rec_values.push("FR")
        break;
      case "6":
        rec_values.push("SA")
        break;
      case "7":
        rec_values.push("SU")
        break;
      default:
        console.log("getRRULE: error with rec_type format");
    }

  }
  rule += rec_values.join(",")
  return rule
}

function getICal() {
  //creates .ics format file, returns it as string
  var dateToString = scheduler.date.date_to_str("%Y%m%dT%H%i%s")
  var selectedCourse = scheduler.getEvent(selectedId[0]);
  console.log(selectedCourse);
  var textL = []
  var tempCourse;
  textL.push("BEGIN:VCALENDAR")
  textL.push("VERSION:2.0")
  textL.push("PRODID:-//SwatLyfe//NONSGML v2.2//EN")
  textL.push("DESCRIPTION:Created by none other than the based Imada Sensei :)")
  var now = new Date(2017, 03, 06)
  console.log(now.getFullYear());
  for (var i = 0; i < selectedId.length; i++) {
    tempCourse = scheduler.getEvent(selectedId[i])
    textL.push("BEGIN:VEVENT")
    textL.push("UID:swatlyfe@" + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }))
    textL.push("DTSTAMP:" + dateToString(new Date()) + "Z")
    textL.push("DTSTART;TZID=America/New_York:" + dateToString(tempCourse.start_date))
    textL.push(getRRULE(tempCourse) + ";UNTIL=" + dateToString(tempCourse.end_date))
    textL.push("SUMMARY:" + tempCourse.text)
    textL.push("END:VEVENT")
  }
  textL.push("END:VCALENDAR")
  return textL.join("\n");
}

function downloadICal() {
  var text = getICal()
  var filename = "calendar"
  var blob = new Blob([text], {
    type: "text/plain;charset=utf-8"
  });
  saveAs(blob, filename + ".ics");
  // scheduler.data_attributes = function() {
  //   var empty = function(a) {
  //     return a || "";
  //   }
  //   return [
  //     ["id"],
  //     ["text"],
  //     ["start_date", scheduler.templates.xml_format],
  //     ["end_date", scheduler.templates.xml_format],
  //     ["rec_type", empty],
  //     ["event_length", empty],
  //     ["event_pid", empty]
  //   ];
  // }
  // var ical = scheduler.toICal()
  // console.log(ical);
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

function createEvent(course_name, course_number, semester, campus, start_time, end_time, repeat) {
  var sd = semesterSchedule[semester][campus]["start"]
  var ed = semesterSchedule[semester][campus]["end"]
  var el = 60 * (timeConvert(end_time) - timeConvert(start_time))
  //console.log(el)
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
    id: semester + " " + campus + " " + course_number,
    start_date: sd + " " + start_time,
    end_date: ed + " " + end_time,
    rec_type: "week_1___" + repNums,
    event_length: el,
    event_pid: 0,
    text: course_name
  })
  switch(campus){
    case "Swarthmore":
      scheduler.getEvent(id).color = "#85274E"
      break
    case "Bryn_Mawr":
      scheduler.getEvent(id).color = "#E8C91E"
      break
    case "Haverford":
      scheduler.getEvent(id).color = "#D33F2E"
      break
    default:
      break
  }
  selectedId.push(id);
  scheduler.updateView(sd)
}
//Changes***

function loadData() {

  courses = {};
  //var urlStub = 'https://raw.githubusercontent.com/keikun555/triCoCourseSearch/master/final/data/';
  //formats to json of campuses of semesters of courses
  for (campus in campuses) {
    var cam = {};
    for (semester in semesters) {
      var sem
      //gets data from url, for every semester for every campus
      // url = urlStub + campuses[campus] + "/" + semesters[semester] + ".json";
      // sem = $.parseJSON($.ajax({
      //   url: url,
      //   async: false,
      //   success: function(data) {}
      // })["responseText"]);
      // cam[semesters[semester]] = sem;
      // var json = $.getJSON("./data/" + campuses[campus] + "/" + semesters[semester] + ".json", function(data) {
      //   console.log(data);
      //   console.log(semesters[semester], campuses[campus]);
      //   sem = data
      //   cam[semesters[semester]] = sem
      //   courses[campuses[campus]] = cam;
      //   console.log(courses);
      //   //console.log("success");
      // }).fail(function() {
      //   console.log("Error:file not found");
      //   cam[semesters[semester]] = {}
      // }).always(function() {
      //   //console.log("complete");
      // });
      $.ajax({
        url: "./data/" + campuses[campus] + "/" + semesters[semester] + ".json",
        dataType: 'json',
        async: false,
        //data: myData,
        success: function(data) {
          cam[semesters[semester]] = data
        }
      });
      //console.log(JSON.stringify(jqxhr[0]));
      //console.log(sem);
      //cam[semesters[semester]] = sem
      //console.log(cam);
      //console.log(cam);

      //console.log(courses);
    }
    courses[campuses[campus]] = cam;
  }
  //console.log(courses['Swarthmore']["Fall_2017"])
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
      "Room Location",
      "Time And Days",
      "Department",
      "Instructor",
      "CRN",
      "Registration ID"
    ]
  };
  list = []
  //console.log(courses);
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
  console.log(searchText);
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
  semesterList = document.getElementById('semester').textContent.trim().split(' ');
  semester = [semesterList[1] + "_" + semesterList[0]]
  //console.log(semester);
  if (semesterList[0] === 'Select') {
    //if no semester is selected, choose most recent one
    semester = $('#dropdown').find('a').first().text().split(' ');
    //console.log(semester);
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
  result = selected.concat(find(searchText, semester, campuses))
  currentResults = result
  $(table).html(tableHeader)
  if (result.length > 0) {
    for (course in result) {
      //console.log(getRowHTML(result[course], selectedId.indexOf(result[course]["Semester"] + " " + result[course]["Campus"] + " " + result[course]["CRN"]) >= 0));
      $(table).append(getRowHTML(result[course], selectedId.indexOf(result[course]["Semester"] + " " + result[course]["Campus"] + " " + result[course]["CRN"]) >= 0));
    }
  } else {
    $(table).html('<div class="alert alert-warning"><strong>No classes found!</strong></div>')
  }
}

function getRowHTML(course, isSelected) {
  var name = course['Course Title'];
  var id = course['Registration ID'];
  var num = course['CRN'];
  var time = "Not Specified"
  var className = "tableRow"
  if (isSelected) {
    switch (course['Campus']) {
      case "Swarthmore":
        className = "rowSActive"
        break;
      case "Haverford":
        className = "rowHActive"
        break;
      case "Bryn_Mawr":
        className = "rowBMActive"
        break;
      default:
        console.log("getRowHTML:Error campus not found");
        break;
    }
  }
  try {
    time = course['Time And Days'].split(', ').join(',').split(',').join('<br>');
  } catch (e) {}
  var prof = "Not Specified"
  try {
    prof = course['Instructor'].split(', ').join(',').split(',').join(', ');
  } catch (e) {}
  var camp
  try {
    camp = course['Campus'].split('_').join(' ');
  } catch (e) {}
  var row;
  return `<tbody><tr onmouseleave='if($(this).attr("row_pressed")==="false"){this.className="tableRow"}' onmouseenter="rowHover(this)" id="${course}" type="checkbox" class="${className}" data-toggle="buttons-toggle" onclick="update(this)" row_pressed="${isSelected}" campus="${camp}"><td>${name}</td><td>${id}</td><td>${num}</td><td>${time}</td><td>${prof}</td><td>${camp}</td></tr></tbody>`
  //`<tbody><tr onmouseleave='if($(this).attr("row_pressed")==="false"){this.className="tableRow"}' onmouseenter="rowHover(this)" id="${course}" type="checkbox" class="tableRow" data-toggle="buttons-toggle" onclick="update(this)" row_pressed="false" campus="${camp}"><td>${name}</td><td>${id}</td><td>${num}</td><td>${time}</td><td>${prof}</td><td>${camp}</td></tr></tbody>`
}

function rowHover(row) {
  //console.log($(row).attr("row_pressed"));
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
  course = currentResults[row.rowIndex - 1]
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
    times = course["Time And Days"].split(', ').join(',').split(',')
    if (!(times[0] === "")) {
      for (time in times) {
        //console.log(times[time])
        delTime = times[time].split(/ |-/)
        //console.log(delTime)
        createEvent(course["Course Title"], course["CRN"], course["Semester"], course["Campus"], delTime[1], delTime[2], delTime[0]);
      }
    } else {
      id = scheduler.addEventNow({
        id: course["Semester"] + " " + course["Campus"] + " " + course["CRN"],
        start_date: "01/01/2017 12:00am",
        end_date: "01/01/2017 12:00am",
        text: course["Course Title"]
      })
      selectedId.push(id)
    }
    //console.log(`Added ${course["Course Title"]} (${course["Campus"]}) to selected`)
  } else if ($(row).attr('row_pressed') === "true") {
    $(row).attr('row_pressed', "false")
    row.className = "tableRow"
    courses[course["Campus"]][course["Semester"]].push(course)
    index = selected.indexOf(course)
    if (index > -1) {
      selected.splice(index, 1)
      scheduler.deleteEvent(selectedId[index])
      selectedId.splice(index, 1)
    }
    //console.log(`Removed ${course["Course Title"]} (${course["Campus"]}) from selected`)
  }
  classSched = []
  scheduler.parse(classSched, "json")
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

function get_type(thing) {
  if (thing === null) return "[object Null]"; // special case
  return Object.prototype.toString.call(thing);
}
/* used for debugging
function get_type(thing) {
  if (thing === null) return "[object Null]"; // special case
  return Object.prototype.toString.call(thing);
}
*/
