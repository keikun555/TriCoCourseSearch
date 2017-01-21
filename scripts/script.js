var courses

function main() {
    /*called when body loads*/
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
}

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
    $(table).html(tableHeader)
    if (result.length > 0) {
        for (course in result) {
            var name = result[course]['Course Title'];
            var id = result[course]['Registration ID'];
            var num = result[course]['CRN'];
            var time = result[course]['Time And Days'].split(', ').join(',').split(',').join('<br>');
            var prof = result[course]['Instructor'];
            var camp = result[course]['Campus'];
            var row = `<tbody><tr><td>${name}</td><td>${id}</td><td>${num}</td><td>${time}</td><td>${prof}</td><td>${camp}</td></tr></tbody>`
            $(table).append(row);
        }
    } else {
        $(table).html('<div class="alert alert-warning"><strong>No classes found!</strong></div>')
    }
}
/* used for debugging
function get_type(thing) {
  if (thing === null) return "[object Null]"; // special case
  return Object.prototype.toString.call(thing);
}
*/
