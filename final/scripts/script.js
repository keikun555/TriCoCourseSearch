//Global variables
var courses
var currentResults = []
var selected = []
var selectedId = {}
var campuses = ['Bryn_Mawr', 'Haverford', 'Swarthmore'];
var semesters = ['Fall_2015', 'Spring_2016', 'Fall_2016', 'Spring_2017', 'Fall_2017'];
var semesterSchedule = {}

function main() {
  initializeScheduler()
  initializeJQuery()
  loadData()
}

function initializeScheduler() {
  scheduler.config.separate_short_events = true;
  scheduler.config.repeat_date = "%m/%d/%Y";
  scheduler.config.hour_date = "%g:%i%a";
  scheduler.config.scroll_hour = 8;
  //scheduler.config.hour_size_px = 42;
  scheduler.xy.scale_height = 20;
  scheduler.xy.scroll_width = 0;
  //scheduler.config.hour_size_px = 84;
  scheduler.config.separate_short_events = true;
  scheduler.config.calendar_time = "%g:%i%a";
  scheduler.config.xml_date = "%m/%d/%Y %g:%i%a"
  scheduler.config.api_date = "%m/%d/%Y %g:%i%a"
  scheduler.config.include_end_by = true;
  scheduler.config.start_on_monday = false;
  scheduler.config.touch = "force";
  /*called when body loads*/
  scheduler.init('scheduler_here', new Date(), "week");
  scheduler.config.repeat_precise = true;
  scheduler.config.readonly = true;
  scheduler.config.buttons_left = ["dhx_save_btn"];
  scheduler.config.buttons_right = [];
  scheduler.config.icons_select = [];
  scheduler.templates.quick_info_content = function(start, end, ev) {
    var actualEvent = scheduler.getEvent(ev.event_pid)
    var returnText = "Instructor: " + actualEvent.instructor
    if (actualEvent.instructor.length <= 1) {
      returnText += "Unspecified"
    }
    returnText += "\nLocation: " + actualEvent.location
    if (actualEvent.location.length <= 1) {
      returnText += "Unspecified"
    }
    return returnText;
  };
  scheduler.attachEvent("onBeforeLightbox", function(id) {
    ev = scheduler.getEvent(id)
    $("#recurring_end_date").val(semesterSchedule[ev.semester][ev.campus]["end"]);
    var recurring = scheduler.formSection("recurring").node.parentNode;
    var button = recurring.querySelector(".dhx_custom_button");
    button.click()
    //button.style.display = "none";
    return true;
  });
  scheduler.config.lightbox.sections = [{
      name: "description",
      height: 130,
      map_to: "text",
      type: "textarea",
      focus: true
    },
    {
      name: "recurring",
      type: "recurring",
      map_to: "rec_type",
      button: "recurring",
      form: "custom_recurring_lightbox"
    }, {
      name: "time",
      height: 72,
      type: "time",
      map_to: "auto"
    }
  ];
  //for exporting recurring events
  scheduler.updateView()
  //scheduler.enableAutoWidth(true)
}

function initializeJQuery() {
  $('#calendar').collapse({
    toggle: true
  })
  $('#calendar').on('shown.bs.collapse', function() {
    $("#calendarButton").text("Hide Calendar")
    scheduler.updateView()
  })
  $('#calendar').on('hidden.bs.collapse', function() {
    $("#calendarButton").text("Show Calendar")
  });
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
  $("#importGCal").popover({
      trigger: "manual",
      html: true,
      animation: false
    })
    .on("mouseenter", function() {
      var _this = this;
      $(this).popover("show");
      $(".popover").on("mouseleave", function() {
        $(_this).popover('hide');
      });
    }).on("mouseleave", function() {
      var _this = this;
      setTimeout(function() {
        if (!$(".popover:hover").length) {
          $(_this).popover("hide");
        }
      }, 300);
    });
  //$("#authors").attr('title', 'The greatest of them all')
  $("#importGCal").attr('data-content', '<button id="importGCalButton" type="button" class="btn btn-warning btn-block" data-toggle="modal" data-target="#gCalImportModal">How to Export to Google Calendar</button>')
  $("#authors").attr('data-content', '<strong>Kei Imada</strong> - <br/>Full Stack Developer<br/><strong>Yichuan Yan</strong> - <br/>Designer<br/>Frontend Developer<br/><strong>Douglas Campbell</strong> - <br/>Frontend Developer<br/><strong>Ryan Jobson</strong> - <br/>Frontend Developer<br/><strong>Calvin Chan</strong> - <br/>Quality Assurance<br/>')
  $('#changelog').on('shown.bs.modal', function(e) {
    $('#changelogButton').one('focus', function(e) {
      $(this).blur();
    });
  });
  $.ajax({
    url: './changelog.md',
    dataType: 'text',
    success: function(changelog) {
      $('#changelogHere').html(micromarkdown.parse(changelog))
    }
  })
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
  //console.log(selectedCourse);
  var textL = []
  var tempCourse;
  textL.push("BEGIN:VCALENDAR")
  textL.push("VERSION:2.0")
  textL.push("PRODID:-//SwatLyfe//NONSGML v2.2//EN")
  textL.push("DESCRIPTION:Created by none other than the based Imada Sensei :)")
  var now = new Date(2017, 03, 06)
  //console.log(now.getFullYear());
  for (var idStub in selectedId) {
    for (var timeId in selectedId[idStub]) {
      tempCourse = scheduler.getEvent(selectedId[idStub][timeId])
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

function createEvent(course, start_time, end_time, repeat) {
  //console.log(course);
  var course_name = course["Course Title"]
  var course_number = course["CRN"]
  var semester = course["Semester"]
  var campus = course["Campus"]
  var instructor = course["Instructor"]
  var location = course["Room Location"]
  var times = course["Time And Days"].split(', ').join(',').split(',')
  var startDate = semesterSchedule[semester][campus]["start"]
  var endDate = semesterSchedule[semester][campus]["end"]
  var idStub = semester + " " + campus + " " + course_number
  //createEvent(course, delTime[1], delTime[2], delTime[0]);
  selectedId[idStub] = []
  if (times[0] === "") {
    // if time does not exist
    id = scheduler.addEventNow({
      id: idStub,
      start_date: startDate,
      end_date: endDate,
      text: course["Course Title"],
      location: location,
      instructor: instructor,
      semester: semester,
      campus: campus
    })
    //console.log(id);
    switch (campus) {
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
    selectedId[idStub].push(id)
    scheduler.updateView(startDate)
  } else {
    for (time in times) {
      times[time] = (times[time]).split(/ |-/)
      var start_time = times[time][1]
      var end_time = times[time][2]
      var repeat = times[time][0]
      var eventLength = 60 * (timeConvert(end_time) - timeConvert(start_time))
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
        id: idStub + " " + parseInt(time),
        start_date: startDate + " " + start_time,
        end_date: endDate + " " + end_time,
        rec_type: "week_1___" + repNums,
        event_length: eventLength,
        event_pid: 0,
        text: course_name,
        location: location,
        instructor: instructor,
        semester: semester,
        campus: campus
      })
      switch (campus) {
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
      selectedId[idStub].push(id)
      scheduler.updateView(startDate)
    }
  }
}

function loadData() {
  $.ajax({
    dataType: "json",
    url: "./data/schedule.json",
    success: function(data) {
      semesterSchedule = data
    }
  });
  courses = {}
  //initialize courses json of json datastructure
  for (campus in campuses) {
    courses[campuses[campus]] = {}
    for (semester in semesters) {
      courses[campuses[campus]][semesters[semester]] = {}
    }
  }
  //actually fill in the values
  for (campus in campuses) {
    for (semester in semesters) {
      (function(cam, sem) {
        $.ajax({
          dataType: "json",
          url: "./data/" + cam + "/" + sem + ".json",
          success: function(data) {
            courses[cam][sem] = data;
          }
        });
      })(campuses[campus], semesters[semester])
    }
  }
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
      "CRN"
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
  //console.log(searchText);
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
  if (semesterList[0] === 'Semester') {
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
  if (searchText.length == 0) {
    result = selected
    for (campus in campuses) {
      result = result.concat(courses[campuses[campus]][semester]);
    }
  } else {
    result = selected.concat(find(searchText, semester, campuses))
  }
  currentResults = result
  $(table).html(tableHeader)
  if (result.length > 0) {
    for (course in result) {
      //console.log(getRowHTML(result[course], selectedId.indexOf(result[course]["Semester"] + " " + result[course]["Campus"] + " " + result[course]["CRN"]) >= 0));
      $(table).append(getRowHTML(result[course], selectedId.hasOwnProperty(result[course]["Semester"] + " " + result[course]["Campus"] + " " + result[course]["CRN"])));
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
  return `<tbody><tr onmouseleave='if($(this).attr("row_pressed")==="false"){this.className="tableRow"}' onmouseenter="rowHover(this)" id="${course}" type="checkbox" class="${className}" data-toggle="buttons-toggle" onclick="update(this)" row_pressed="${isSelected}" campus="${camp}"><td data-title="Course Name">${name}</td><td data-title="Registration ID">${id}</td><td data-title="Course Number">${num}</td><td data-title="Time">${time}</td><td data-title="Instructor">${prof}</td><td data-title="Campus">${camp}</td></tr></tbody>`
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

function deleteEvent(course) {
  var course_number = course["CRN"]
  var semester = course["Semester"]
  var campus = course["Campus"]
  var idStub = semester + " " + campus + " " + course_number
  courses[course["Campus"]][course["Semester"]].push(course)
  index = selected.indexOf(course)
  if (index > -1) {
    selected.splice(index, 1)
    for (timeid in selectedId[idStub]) {
      scheduler.deleteEvent(selectedId[idStub][timeid])
    }
    delete selectedId[idStub]
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
    createEvent(course);
    //console.log(`Added ${course["Course Title"]} (${course["Campus"]}) to selected`)
  } else if ($(row).attr('row_pressed') === "true") {
    $(row).attr('row_pressed', "false")
    row.className = "tableRow"
    deleteEvent(course)
    //console.log(`Removed ${course["Course Title"]} (${course["Campus"]}) from selected`)
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
