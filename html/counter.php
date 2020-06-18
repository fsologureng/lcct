<?php

	// logging page hits
	$dbfolder = $_SERVER["DOCUMENT_ROOT"]."/hitcounter_db/";
	$dbname = $_SERVER["HTTP_HOST"]."_log.sq3";

	$client_ip = $_SERVER["REMOTE_ADDR"];
	$http_user_agent = $_SERVER["HTTP_USER_AGENT"];
	echo "Client IP: $client_ip <br>";
	echo "Client HTTP User Configuration: $http_user_agent <br><br>";

	$user_hash = hash_hmac('sha256', "$client_ip", "$http_user_agent");
	echo "The sha256 hash of client_ip with http_user_agent is : $user_hash <br>";

?>
