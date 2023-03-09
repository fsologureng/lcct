<?php
	header("Cache-Control: no-cache, must-revalidate");
	header('Content-type: application/javascript; charset=utf-8');
	header('X-Robots-Tag: noindex,nofollow',true);

	$output;
	// debugging
	$debug = 0;
	$message = "/*\n";
	$message .= "HTTP_HOST=".$_SERVER["HTTP_HOST"]."'\n";
	$message .= "REFERER=".$_SERVER["HTTP_REFERER"]."'\n";

	if( ! preg_match('/'.$_SERVER["HTTP_HOST"].'/',$_SERVER["HTTP_REFERER"]) ) {
		$message .= "No referer\n";
		$message .= "*/\n";
		if ($debug) {
			echo $message;
		}
		exit;
	};
	// obtain user data
	$client_ip = $_SERVER["REMOTE_ADDR"];
	$message .= "Client IP: $client_ip \n";
	$http_user_agent = $_SERVER["HTTP_USER_AGENT"];
	$message .= "Client HTTP User Configuration: $http_user_agent \n\n";

	$user_hash = hash_hmac('sha256', "$client_ip", "$http_user_agent");
	$message .= "The sha256 hash of client_ip with http_user_agent is : $user_hash \n";

	// logging page hits
	$dbfolder = $_SERVER["DOCUMENT_ROOT"]."/../db/";
	$dbname = "visitas.db";

	// check if database file exists first
	if(!file_exists($dbfolder.$dbname)) {
		$output = "/* \"error\": \"[db] file not exists\"*/\n";
	}
	else {
		$message .= "DB file exists\n";

		$logdb = new PDO("sqlite:".$dbfolder.$dbname);

		// obtain date
		$date = date('Y-m-d', time() - (10*60*60)); // UTC - 10h == CLT-6h == cambio de día a las 6am
		$message .= "to register hash $user_hash and date $date\n";
		$message .= "*/\n";

		// insert pair hash, date
		$query_statement = $logdb->query("INSERT INTO hits (hash_client_ip,date) VALUES ('$user_hash','$date') ON CONFLICT DO NOTHING");
		if ( $query_statement === false ) {
			$output = "/* \"error\": \"[db] insert\"*/\n";
		}
		else {
			// Obtain daily unique visits
			$query_statement = $logdb->query('SELECT count(*) AS num FROM hits');
			$returned_record = NULL;
			if ( $query_statement === false ) {
				$output = "/* \"error\": \"[db] select\"*/\n";
			}
			else {
				$returned_record = $query_statement->fetchAll();
				$output = "let hits = ".$returned_record[0]['num'].";\n";
			}
		}
	}

	// Close databse connection
	$logdb = null;

	// output
	if ( $debug ) {
		echo $message;
	}
	echo $output;
?>
