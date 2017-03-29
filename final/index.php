<?php
<html lang="en">

<head>
  <title>TriCo Course Scheduler</title>
  <link rel="shortcut icon" href="https://raw.githubusercontent.com/keikun555/triCoCourseSearch/master/pictures/tri.ico" />
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- JQuery -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <!-- Bootstrap! -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <!-- DHTMLX! -->
  <script src="./scripts/dhtmlxscheduler/dhtmlxscheduler.js"></script>
  <script src="./scripts/dhtmlxscheduler/ext/dhtmlxscheduler_recurring.js"></script>
  <script src="./scripts/dhtmlxscheduler/exportToICal.js"></script>
  <link rel="stylesheet" href="./scripts/dhtmlxscheduler/dhtmlxscheduler_flat.css" type="text/css">
  <script src="./scripts/dhtmlxscheduler/ext/dhtmlxscheduler_quick_info.js"></script>
  <script src="./scripts/dhtmlxscheduler/ext/dhtmlxscheduler_minical.js"></script>
  <script src="./scripts/dhtmlxscheduler/ext/dhtmlxscheduler_serialize.js"></script>
  <!-- My Scripts -->
  <script src="./scripts/script.js"></script>
  <script src="./scripts/fuse.min.js"></script>
  <!-- Google Analytics -->
  <script>
    (function(i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
      a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-91946928-1', 'auto');
    ga('send', 'pageview');
  </script>
  <!--Custom CSS!-->
  <style>
    body {
      font-size: 14px;
    }

    @include media-breakpoint-up(sm) {
      body {
        font-size: 16px;
      }
    }

    @include media-breakpoint-up(md) {
      body {
        font-size: 20px;
      }
    }

    @include media-breakpoint-up(lg) {
      body {
        font-size: 28px;
      }
    }

    body {
      background-image: url("https://raw.githubusercontent.com/keikun555/triCoCourseSearch/master/pictures/books.jpg");
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: 100% 100%;
      /*height: 2000px;*/
    }

    .jumbotron {
      background: #F8F8F8;
      color: grey;
      opacity: .70;
      padding: 10px 0 25px 0;
      /*background-color:none !important;*/
    }

    .text-center {
      color: white;
    }

    .container-box {
      background: white;
      left: 90%;
      background-size: 20%;
      background-repeat: no-repeat;
      border-radius: 3px;
      width: 97%;
      opacity: .95;
      padding-top: 25px;
      padding-bottom: 25px;
      padding-right: 25px;
      padding-left: 25px;
      text-align: center;
      margin: 0 auto;
      left: 50%;
      top: 50%;
    }

    .btn-swarthmore,
    .btn-swarthmore:focus {
      color: #F8F8F8;
      background-color: #DDC4CE;
      border-color: #FFFFFF;
      outline: none !important;
    }

    .btn-swarthmore:hover,
    .btn-swarthmore:active,
    .btn-swarthmore.active,
    .open .dropdown-toggle.btn-swarthmore {
      color: #F8F8F8 !important;
      background-color: #85274E !important;
      border-color: #FFFFFF !important;
    }

    .btn-swarthmore:active,
    .btn-swarthmore.active,
    .open .dropdown-toggle.btn-swarthmore {
      background-image: none;
    }

    .btn-swarthmore.disabled,
    .btn-swarthmore[disabled],
    fieldset[disabled] .btn-swarthmore,
    .btn-swarthmore.disabled:hover,
    .btn-swarthmore[disabled]:hover,
    fieldset[disabled] .btn-swarthmore:hover,
    .btn-swarthmore.disabled:focus,
    .btn-swarthmore[disabled]:focus,
    fieldset[disabled] .btn-swarthmore:focus,
    .btn-swarthmore.disabled:active,
    .btn-swarthmore[disabled]:active,
    fieldset[disabled] .btn-swarthmore:active,
    .btn-swarthmore.disabled.active,
    .btn-swarthmore[disabled].active,
    fieldset[disabled] .btn-swarthmore.active {
      background-color: #768A8B;
      color: F1F1F1;
      border-color: #FFFFFF;
    }

    .btn-swarthmore .badge {
      color: #BC899E;
      background-color: #BBBDBA;
    }

    .btn-haverford,
    .btn-haverford:focus {
      color: #F8F8F8;
      background-color: #FFC0B9;
      border-color: #FFFFFF;
      outline: none !important;
    }

    .btn-haverford:hover,
    .btn-haverford:active,
    .btn-haverford.active,
    .open .dropdown-toggle.btn-haverford {
      color: #F8F8F8 !important;
      background-color: #D33F2E !important;
      border-color: #FFFFFF !important;
    }

    .btn-haverford:active,
    .btn-haverford.active,
    .open .dropdown-toggle.btn-haverford {
      background-image: none;
    }

    .btn-haverford.disabled,
    .btn-haverford[disabled],
    fieldset[disabled] .btn-haverford,
    .btn-haverford.disabled:hover,
    .btn-haverford[disabled]:hover,
    fieldset[disabled] .btn-haverford:hover,
    .btn-haverford.disabled:focus,
    .btn-haverford[disabled]:focus,
    fieldset[disabled] .btn-haverford:focus,
    .btn-haverford.disabled:active,
    .btn-haverford[disabled]:active,
    fieldset[disabled] .btn-haverford:active,
    .btn-haverford.disabled.active,
    .btn-haverford[disabled].active,
    fieldset[disabled] .btn-haverford.active {
      background-color: #768A8B;
      color: F1F1F1;
      border-color: #FFFFFF;
    }

    .btn-haverford .badge {
      color: #1A3D3E;
      background-color: #231F20;
    }

    .btn-brynmawr,
    .btn-brynmawr:focus {
      color: #F8F8F8;
      background-color: #F2E499;
      border-color: #FFFFFF;
      outline: none !important;
    }

    .btn-brynmawr:hover,
    .btn-brynmawr:active,
    .btn-brynmawr.active,
    .open .dropdown-toggle.btn-brynmawr {
      color: #F8F8F8 !important;
      background-color: #E8C91E !important;
      border-color: #FFFFFF !important;
    }

    .btn-brynmawr:active,
    .btn-brynmawr.active,
    .open .dropdown-toggle.btn-brynmawr {
      background-image: none;
    }

    .btn-brynmawr.disabled,
    .btn-brynmawr[disabled],
    fieldset[disabled] .btn-brynmawr,
    .btn-brynmawr.disabled:hover,
    .btn-brynmawr[disabled]:hover,
    fieldset[disabled] .btn-brynmawr:hover,
    .btn-brynmawr.disabled:focus,
    .btn-brynmawr[disabled]:focus,
    fieldset[disabled] .btn-brynmawr:focus,
    .btn-brynmawr.disabled:active,
    .btn-brynmawr[disabled]:active,
    fieldset[disabled] .btn-brynmawr:active,
    .btn-brynmawr.disabled.active,
    .btn-brynmawr[disabled].active,
    fieldset[disabled] .btn-brynmawr.active {
      background-color: #768A8B;
      color: F1F1F1;
      border-color: #FFFFFF;
    }

    .btn-brynmawr .badge {
      color: #CFCA8B;
      background-color: #FFFFFF;
    }

    .tableRow {
      background: #ffffff;
    }

    .rowSHover {
      background: #DDC4CE;
    }

    .rowSActive {
      background: #85274E;
      color: #F8F8F8;
    }

    .rowHHover {
      background: #FFC0B9;
    }

    .rowHActive {
      background: #D33F2E;
      color: #F8F8F8;
    }

    .rowBMHover {
      background: #F2E499;
    }

    .rowBMActive {
      background: #E8C91E;
      color: #F8F8F8;
    }
  </style>
</head>

<body onload="main()">
  <div class="jumbotron">
    <h1 class="text-center" style="font-size: 36px;color: grey;">TriCo Course Scheduler</h1>
    <h3 class="text-center" style="font-size: 24px;color: grey;">simplifies course selection to a mere searchbox and a calendar</h3>
    <h5 class="text-center" style="font-size: 12px;color: grey;">upcoming features:  export to iCal, autoscheduler . . . .</h5>
    <div class="row">
      <div class="col-md-3 col-sm-3 col-xs-3"></div>
      <div class="col-md-2 col-sm-2 col-xs-2">
        <area href="http://www.swarthmore.edu/" target="_blank" shape="circle"><img class="img-responsive center-block" style='max-height: 50px; cursor: pointer;' src="https://raw.githubusercontent.com/keikun555/triCoCourseSearch/master/pictures/S.png"
        /></a>
      </div>
      <div class="col-md-2 col-sm-2 col-xs-2">
        <area href="https://www.brynmawr.edu/" target="_blank" shape="circle"><img class="img-responsive center-block" style='max-height: 50px; cursor: pointer;' src="https://raw.githubusercontent.com/keikun555/triCoCourseSearch/master/pictures/BM2.png"
        /></a>
      </div>
      <div class="col-md-2 col-sm-2 col-xs-2">
        <area href="https://www.haverford.edu/" target="_blank" shape="circle"><img class="img-responsive center-block" style='max-height: 50px; cursor: pointer;' src="https://raw.githubusercontent.com/keikun555/triCoCourseSearch/master/pictures/H.png"
        /></a>
      </div>
      <div class="col-md-3 col-sm-3 col-xs-3"></div>
    </div>
  </div>
  <div class="container-box">
    <div class="container">
      <div id="calendar" class="collapse in">
        <div id="scheduler_here" class="dhx_cal_container" style='width:100%; height:500px;'>
          <div class="dhx_cal_navline">
            <div class="dhx_cal_prev_button">&nbsp;</div>
            <div class="dhx_cal_next_button">&nbsp;</div>
            <div class="dhx_cal_today_button"></div>
            <div class="dhx_cal_date"></div>
            <div class="dhx_minical_icon" id="dhx_minical_icon" onclick="show_minical()">&nbsp;</div>
            <div class="dhx_cal_date"></div>
            <div class="dhx_cal_tab" name="day_tab" style="right:204px;"></div>
            <div class="dhx_cal_tab" name="week_tab" style="right:140px;"></div>
            <div class="dhx_cal_tab" name="month_tab" style="right:76px;"></div>
          </div>
          <div class="dhx_cal_header"></div>
          <div class="dhx_cal_data"></div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
          <a href="#calendar" class="btn btn-default btn-lg btn-block" data-toggle="collapse">Click for Calendar</a>
        </div>
      </div>
    </div>
    <br>
    <div class="container">
      <!--<div class="row" style="margin-bottom: 25px">
          <div class="col-md-1 col-sm-2 col-xs-3"></div>
          <div class="col-md-2 col-sm-2 col-xs-6">
            <a href="http://www.swarthmore.edu/" target="_blank"><img class="img-responsive center-block" style='max-height: 50px; cursor: pointer;' onclick="slogin()" src="https://raw.githubusercontent.com/keikun555/triCoCourseSearch/master/pictures/S.png" /></a>
          </div>
          <div class="col-md-2 col-sm-1 col-xs-3"></div>
          <div class="col-md-2 col-sm-2 col-xs-6">
            <a href="https://www.brynmawr.edu/" target="_blank"><img class="img-responsive center-block" style='max-height: 50px; cursor: pointer;' onclick="bmlogin()" src="https://raw.githubusercontent.com/keikun555/triCoCourseSearch/master/pictures/BM2.png" /></a>
          </div>
          <div class="col-md-2 col-sm-1 col-xs-0"></div>
          <div class="col-md-2 col-sm-2 col-xs-6">
            <a href="https://www.haverford.edu/" target="_blank"><img class="img-responsive center-block" style='max-height: 50px; cursor: pointer;' onclick="hlogin()" src="https://raw.githubusercontent.com/keikun555/triCoCourseSearch/master/pictures/H.png" /></a>
          </div>
          <div class="col-md-1 col-sm-2 col-xs-0"></div>
        </div>-->
      <div class="row">
        <div class="col-md-12">
          <div class="well">
            <div class="input-group">
              <input type="text" class="form-control input-lg" id="search" placeholder="Search">
              <div class="input-group-btn">
                <button class="btn btn-default btn-lg" onclick="search()" id="submit" type="submit">
                    <i class="glyphicon glyphicon-search"></i>
                  </button>
              </div>
            </div>
            <br>
            <div class="row">
              <div class="col-md-2">
                <div class="btn-group">
                  <button type="button" id="semester" class="btn btn-default dropdown-toggle btn-block" data-toggle="dropdown" style="color: 042A2B;">Select Semester
                      <span class="caret"></span>
                    </button>
                  <ul class="dropdown-menu" id="dropdown">
                    <!--<li class="dropdown-header">2016-2017</li>
                    <li><a href="#" style="color: 042A2B;">2017 Spring</a></li>
                    <li><a href="#" style="color: 042A2B;">2016 Fall</a></li>
                    <li class="divider"></li>
                    <li class="dropdown-header">2015-2016</li>
                    <li><a href="#" style="color: 042A2B;">2016 Spring</a></li>
                    <li><a href="#" style="color: 042A2B;">2015 Fall</a></li>-->
                  </ul>
                </div>
              </div>
              <div class="col-md-2">
                <input value="Export to iCal" type="button" class="btn btn-default btn-block" onclick='downloadICal()'>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <button id="swarthmore" type="checkbox" class="btn btn-primary btn-lg btn-block btn-swarthmore" data-toggle="buttons-toggle">Swarthmore</button>
        </div>
        <div class="col-md-4">
          <button id="brynmawr" type="checkbox" class="btn btn-primary btn-lg btn-block btn-brynmawr" data-toggle="buttons-toggle">Bryn Mawr</button>
        </div>
        <div class="col-md-4">
          <button id="haverford" type="checkbox" class="btn btn-primary btn-lg btn-block btn-haverford" data-toggle="buttons-toggle">Haverford</button>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 table-responsive" style="color: 042A2B;">
          <table id="table" class="table table-lg">
          </table>
        </div>
      </div>
    </div>
  </div>
</body>

</html>
 ?>
