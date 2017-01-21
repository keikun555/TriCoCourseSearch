var courses
var currentResults = []
var selected = []

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
  scheduler.config.repeat_date = "%m/%d/%Y";
  scheduler.config.include_end_by = true;
  /*called when body loads*/
  scheduler.init('scheduler_here', new Date(), "week");
  scheduler.config.repeat_precise = true;

  // HEADER STUFF
  /*$(document).ready(function() {

      // page is now ready, initialize the calendar...

      $('#scheduler_here').fullCalendar({
        left:   '???',
        center: '',
        right:  'TEST prev,next'
      })
  });*/
  // HEADER STUFF

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
    /*
        var events = [
        {id:1,text:"course_name",start_date:"01/18/2017 10:00",end_date:"01/18/2017 17:00"},
        {id:0,text:"some_text",start_date:"2017/01/16 10:00",end_date:"2017/01/16 17:00"},
        {id:1,start_date:"2017-01-18 10:00:00",end_date:"2017-01-18 17:00:00",text:"some_text",details:"",rec_type:"day_1___",event_length:"7200",event_pid:"0"}
        ];
      scheduler.parse(events, "json");//takes the name and format of the data source
    */
  createEvent("MWF Course", "09:30", "10:20", "MWF");
}

function createEvent(course_name, start_time, end_time, repeat_list) {
  if (repeat_list == "MWF") {
    var events = [{
      id: 1,
      text: "WORK!",
      start_date: "01/16/2017 " + start_time + ":" + "00",
      end_date: "05/30/2017 " + end_time + ":" + "00",
      event_length: "7200",
      event_pid: "0",
      rec_type: "week_1___1,3,5"
    }];
  } else if (repeat_list = "TH") {
    var events = [{
      id: 1,
      text: "course_name",
      start_date: "01/17/2017 start_time",
      end_date: "01/17/2017 end_time"
    }, {
      id: 2,
      text: "course_name",
      start_date: "01/19/2017 start_time",
      end_date: "01/19/2017 end_time"
    }];
  }
  scheduler.parse(events, "json"); //takes the name and format of the data source
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
      var time = result[course]['Time And Days'].split(', ').join(',').split(',').join('<br>');
      var prof = result[course]['Instructor'].split(', ').join(',').split(',').join(', ');
      var camp = result[course]['Campus'].split('_').join(' ');
      var row;
      if (camp === "Swarthmore") {
        row = `<tbody><tr><td>${name}</td><td><button id="${course}" type="checkbox" class="btn btn-swarthmore" data-toggle="buttons-toggle" onclick="update(this)" aria-pressed="false">${id}</button></td><td>${num}</td><td>${time}</td><td>${prof}</td><td>${camp}</td></tr></tbody>`
        $(table).append(row);
      } else if (camp === "Haverford") {
        row = `<tbody><tr><td>${name}</td><td><button id="${course}" type="checkbox" class="btn btn-haverford" data-toggle="buttons-toggle" onclick="update(this)" aria-pressed="false">${id}</button></td><td>${num}</td><td>${time}</td><td>${prof}</td><td>${camp}</td></tr></tbody>`
        $(table).append(row);
      } else {
        row = `<tbody><tr><td>${name}</td><td><button id="${course}" type="checkbox" class="btn btn-brynmawr" data-toggle="buttons-toggle" onclick="update(this)" aria-pressed="false">${id}</button></td><td>${num}</td><td>${time}</td><td>${prof}</td><td>${camp}</td></tr></tbody>`
        $(table).append(row);
      }
    }
  } else {
    $(table).html('<div class="alert alert-warning"><strong>No classes found!</strong></div>')
  }
}

function update(checkbox) {
  course = currentResults[checkbox.id]
  if ($(checkbox).attr('aria-pressed') === "false") {
    selected.push(course)
    index = courses[course["Campus"]][course["Semester"]].indexOf(course)
    if (index > -1) {
      courses[course["Campus"]][course["Semester"]].splice(index, 1)
    }
    //console.log(`Added ${course["Course Title"]} (${course["Campus"]}) to selected`)
  } else if ($(checkbox).attr('aria-pressed') === "true") {
    courses[course["Campus"]][course["Semester"]].push(course)
    index = selected.indexOf(course)
    if (index > -1) {
      selected.splice(index, 1)
    }
    //console.log(`Removed ${course["Course Title"]} (${course["Campus"]}) from selected`)
  }
}

/* used for debugging
function get_type(thing) {
  if (thing === null) return "[object Null]"; // special case
  return Object.prototype.toString.call(thing);
}
*/
