class ICalExporter API

Initialization:
	require_once("codebase/class.php");
	$export = new ICalExporter();

To iCalendar:

	setTitle($title) - sets title of ical file in toICal method
	getTitle() - gets title of ical
	toICal($events) - converts the information from the array or xml string to icalendar format

From iCalendar:

	toHash($ical) - converts ical string to array of events
	toXML($ical) - converts ical string to XML


Examples:

1. From Array to iCal:

$events = array(
	array(
		"id" => 1,
		"start_date" => "2010-04-05 08:00:00",
		"end_date" => "2012-04-09 09:00:00",
		"text" => "text1",
		"rec_type" => "week_2___3,5",
		"event_pid" => null,
		"event_length" => 3600
	),

	array(
		"id" => 2,
		"start_date" => "2010-04-06 12:00:00",
		"end_date" => "2010-04-06 18:00:00",
		"text" => "text2",
		"rec_type" => "",
		"event_pid" => null,
		"event_length" => null
	),

	array(
		"id" => 3,
		"start_date" => "2010-04-07 12:00:00",
		"end_date" => "2010-04-07 18:00:00",
		"text" => "text3",
		"rec_type" => "",
		"event_pid" => null,
		"event_length" => null
	),

	array(
		"id" => 4,
		"start_date" => "2010-04-08 12:00:00",
		"end_date" => "2010-04-08 18:00:00",
		"text" => "text4",
		"rec_type" => "",
		"event_pid" => null,
		"event_length" => null
	)
);

require_once("codebase/class.php");
$export = new ICalExporter();
$ical = $export->toICal($events);
file_put_contents("ical.ics");



2. From XML to iCal:

$xml = file_get_contents("events_rec.xml");
require_once("codebase/class.php");
$export = new ICalExporter();
$ical = $export->toICal($xml);
file_put_contents("ical.ics");


3. Setting iCalendar title:

$xml = file_get_contents("events_rec.xml");
require_once("codebase/class.php");
$export = new ICalExporter();
$export->setTitle("Calendar name");
$ical = $export->toICal($xml);
file_put_contents("ical.ics");


4. From iCal to Array:

$ical = file_get_contents("ical.ics");
require_once("codebase/class.php");
$export = new ICalExporter();
$events = $export->toHash($ical);

5. From iCal to XML:

$ical = file_get_contents("ical.ics");
require_once("codebase/class.php");
$export = new ICalExporter();
$xml = $export->toXML($ical);
file_put_contents("events_rec.xml", $xml);