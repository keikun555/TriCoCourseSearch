<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
	<title>Ical export/import</title>
	<link rel="stylesheet" type="text/css" href="codebase/style.css" />
</head>
<body>
	<center>
		<div id="install_main">
			<div id="install_header">
				<div id="install_header_left"></div>
				<div id="install_header_right"></div>
			</div>
			<div id="install_content">
<?php

	$problems = Array();

	/*! parsing request if configuration is getted in POST array
	 */
	if (isset($_POST["next"])) {
		if ((isset($_FILES["ical_file"]))&&(file_exists($_FILES["ical_file"]["tmp_name"]))) {
			$ical_content = file_get_contents($_FILES["ical_file"]["tmp_name"]);
		} else {
			if ((isset($_POST["ical_url"]))&&($_POST["ical_url"] != '')) {
				$ical_url = $_POST["ical_url"];
				if (file_get_contents($_POST["ical_url"]) !== false) {
					$ical_content = $_POST["ical_url"];
				} else {
					$problems[] = "Ical resource specified by url is not available.";
				}
			} else {
				$problems[] = "Resource file or url should be specified.";
			}
		}
		if (isset($_POST["ical_url"])) {
			$ical_url = $_POST["ical_url"];
		}

		if (isset($_POST['db_host'])) {
			$db_host = $_POST['db_host'];
		}
		if (isset($_POST['db_port'])) {
			$db_port = $_POST['db_port'];
		} else {
			$problems[] = "Database port should be specified.";
		}
		if (isset($_POST['db_user'])) {
			$db_user = $_POST['db_user'];
		} else {
			$problems[] = "Database user should be specified.";
		}
		if (isset($_POST['db_pass'])) {
			$db_pass = $_POST['db_pass'];
		} else {
			$problems[] = "Database password should be specified.";
		}
		if (isset($_POST['db_name'])) {
			$db_name = $_POST['db_name'];
		} else {
			$problems[] = "Database name should be specified.";
		}
		if ((isset($_POST['db_table']))&&($_POST['db_table'] != '')) {
			$db_table = $_POST['db_table'];
		} else {
			$problems[] = "Table name should be specified.";
		}
		if (isset($_POST['db_delete_old_data'])) {
			$db_delete_old_data = true;
		} else {
			$db_delete_old_data = false;
		}
		/*! checking database connection
		 */
		$db_server =  ($db_port !== '') ? $db_host.":".$db_port : $db_host;
		@$link = mysql_connect($db_server, $db_user, $db_pass);
		if (($link)&&(mysql_select_db($db_name) != false)) {
//			mysql_close($link);
		} else {
			$problems[] = "Database connection is failed. Check database configuration.";
		}
	}

if ((count($problems) == 0)&&(isset($link))&&($link != false)) {
	/*! export functionality
	 */

	/*! log array is used for export process logging
	 * Array(
	 *	[0] => Array(
	 *			"text" => "Text of message"
	 *			"type" => "success||error" (used for stylization)
	 *		)
	 * )
	 */
	$log = Array();
	$log[] = Array("text" => "Checking table '{$db_table}' exists...", "type" => "success");

	/*! checking if table exists */
	$query = "SELECT table_name FROM information_schema.tables WHERE table_schema = '{$db_name}' AND table_name = '{$db_table}' LIMIT 1";
	$res = mysql_query($query, $link);
	if (mysql_num_rows($res) == 1) {
		$log[] = Array("text" => "Table '{$db_table}' exists", "type" => "success");
		if ($db_delete_old_data) {
			/*! clearing table */
			$query = "DELETE FROM {$db_table}";
			$res = mysql_query($query, $link);
			if (mysql_error() == "") {
				$log[] = Array("text" => "Table '".$db_table."' was cleared successfully.", "type" => "success");
			} else {
				$log[] = Array("text" => "Some error occured during table {$db_table} clearing (".mysql_error().")", "type" => "error");
			}
		}
	} else {
		/*! table doesn't exist. creation*/
		$log[] = Array("text" => "Table {$db_table} doesn't exist", "type" => "success");
		$query = "CREATE TABLE `{$db_table}` (";
		$query .= "`event_id` int(11) NOT NULL AUTO_INCREMENT, ";
		$query .= "`start_date` datetime NOT NULL, ";
		$query .= "`end_date` datetime NOT NULL, ";
		$query .= "`text` varchar(255) NOT NULL, ";
		$query .= "`rec_type` varchar(64) NOT NULL, ";
		$query .= "`event_pid` int(11) NOT NULL, ";
		$query .= "`event_length` int(11) NOT NULL, ";
		$query .= "PRIMARY KEY (`event_id`))";
		$res = mysql_query($query, $link);
		if (mysql_error() == "") {
			$log[] = Array("text" => "Table {$db_table} was created successfully.", "type" => "success");
		} else {
			$log[] = Array("text" => "Some error occured during table {$db_table} creating (".mysql_error().")", "type" => "error");
		}
	}

	/*! exporting event from source into hash */
	require_once("codebase/class.php");
	$exporter = new ICalExporter();
	$log[] = Array("text" => "Events rendering...", "type" => "success");
	$events = $exporter->toHash($ical_content);
	$log[] = Array("text" => count($events)." event(s) was found.", "type" => "success");
	$log[] = Array("text" => "Inserting events in database...", "type" => "success");
	$success_num = 0;
	$error_num = 0;
	/*! inserting events in database */
	for ($i = 1; $i <= count($events); $i++) {
		$event = $events[$i];
		$query = "INSERT INTO `{$db_table}` VALUES (null, ";
		$query .= "'".mysql_real_escape_string($event["start_date"])."', ";
		$query .= "'".mysql_real_escape_string($event["end_date"])."', ";
		$query .= "'".mysql_real_escape_string($event["text"])."', ";
		$query .= "'".mysql_real_escape_string($event["rec_type"])."', ";
		$query .= "'".mysql_real_escape_string($event["event_pid"])."', ";
		$query .= "'".mysql_real_escape_string($event["event_length"])."')";
		$res = mysql_query($query, $link);
		if (mysql_error() == "") {
			$success_num++;
		} else {
			$error_num++;
			$log[] = Array("text" => "Some error occured during event inserting (".mysql_error().", [ QUERY:  {$query} ])", "type" => "error");
		}
	}
	$log[] = Array("text" => "{$success_num} events were inserted successfully", "type" => "success");
	if ($error_num > 0) {
		$log[] = Array("text" => "{$error_num} error(s) occur(s)", "type" => "error");
	}
	mysql_close($link);
}


if (isset($log)) {
	/*! output export result */
	?>
									<div class="message export">Export process</div>
	<?php
	for ($i = 0; $i < count($log); $i++) {
		?>
										<div class="log_row">
											<div class="log_msg <?php echo $log[$i]["type"]; ?>"><div class="num"><?php echo ($i + 1); ?>)</div><?php echo $log[$i]["text"]; ?></div>
										</div>
		<?php
	}
	?>
										<div class="log_row">
											<div class="log_msg"><div class="num"></div>Export is completed. <a href="">Return to start page.</a></div>
										</div>
	<?php
} else {
	/*! outputing configuration form */
?>
				<div id="content_step_1">
					<form action="index.php" method="post" enctype="multipart/form-data">
						<table cellpadding="0" cellspacing="0">
							<?php

								if (count($problems) > 0) {
									for ($i = 0; $i < count($problems); $i++) {
										?>
										<tr class="error_row">
										<td class="first_td"><div>Error:</div></td>
										<td><div class="error_msg"><div><?php echo $problems[$i]; ?><br></div></div></td>
										</tr>
										<?php
									}
								}

							?>
							<tr>
								<td class="first_td" width="140">&nbsp;</td>
								<td><div class="message">Resource configuration</div></td>
							</tr>
							<tr>
								<td class="first_td" valign="top">Ical file:</td>
								<td>
									<input type="file" class="input" name="ical_file" />
								</td>
							</tr>

							<tr>
								<td class="first_td" valign="top"></td>
								<td><span class="hint or">or</span></td>
							</tr>

							<tr>
								<td class="first_td" valign="top">Ical URL:</td>
								<td>
									<input class="input" name="ical_url" value="<?php echo (isset($ical_url) ? $ical_url : '') ?>" type="text">
								</td>
							</tr>

							<tr>
								<td class="first_td" width="140">&nbsp;</td>
								<td><div class="message">Database configuration</div></td>
							</tr>
							<tr>
								<td class="first_td" valign="top">Database host:</td>
								<td>
									<input class="input" id="db_host" name="db_host" value="<?php echo (isset($db_host) ? $db_host : 'localhost') ?>" type="text"><span style="padding: 0 4;">:</span>
									<input class="input" id="db_port" name="db_port" value="<?php echo (isset($db_port) ? $db_port : '3306') ?>" type="text" onchange="portChanged(true);">
									<span class="hint">If your database is located on another server, change this</span>
								</td>
							</tr>
							<tr>
							<td class="first_td" valign="top">Database name:</td>
							<td>
								<input class="input" name="db_name" value="<?php echo (isset($db_name) ? $db_name : 'sampledb') ?>" type="text">
								<span class="hint">The name of the database which your data is stored in.<br></span>
								</td>
							</tr>
							<tr>
								<td class="first_td" valign="top">User:</td>
								<td><input class="input" name="db_user" value="<?php echo (isset($db_user) ? $db_user : 'root') ?>" type="text"></td>
							</tr>
							<tr>
								<td class="first_td" valign="top">Password:</td>
								<td><input class="input" name="db_pass" value="<?php echo (isset($db_pass) ? $db_pass : '') ?>" type="password"></td>
							</tr>

							<tr>
							<td class="first_td" valign="top">Table name:</td>
							<td>
								<input class="input" name="db_table" value="<?php echo (isset($db_table) ? $db_table : 'sample') ?>" type="text">
								<span class="hint">The name of the table which your data will be loaded in.<br></span>
								</td>
							</tr>

							<tr>
							<td class="first_td" valign="top">Delete old data:</td>
							<td>
								<input type="checkbox" name="db_delete_old_data" <?php echo ((isset($db_delete_old_data))&&($db_delete_old_data == true)) ? 'checked="true"' : ''; ?> />
								<span class="hint after_checkbox">If option is switched on the old data will be deleted.<br></span>
								</td>
							</tr>


							<tr class="button-row">
								<td class="first_td">&nbsp;</td>
								<td><input class="continue-button" type="submit" name="next" value="&nbsp;"></td>
							</tr>
						</table>
					</form>
				</div>
<?php

}
?>
			</div>
		</div>
	</center>
</body>
</html>