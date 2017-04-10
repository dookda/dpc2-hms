<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

$pat_name = htmlspecialchars(trim($_POST['pat_name']));
$doc_name = htmlspecialchars(trim($_POST['doc_name']));
$add_no = htmlspecialchars(trim($_POST['add_no']));
$vill_name = htmlspecialchars(trim($_POST['vill_name']));
$date_sick = htmlspecialchars(trim($_POST['date_sick']));
$lat = htmlspecialchars(trim($_POST['lat']));
$lng = htmlspecialchars(trim($_POST['lng']));
$token = mt_rand(100000, 999999);

include "../lib/hms.php";
conndb();


$sql = "INSERT INTO dengue_point (geom, pat_name, doc_name, add_no, vill_name, date_sick, lat, lng, token) 
VALUES ( ST_GeomFromText('POINT($lng $lat)', 4326), '$pat_name', '$doc_name', '$add_no', '$vill_name', '$date_sick', $lat, $lng, $token)";
pg_query($sql);
/*$db = new PDO('sqlite:leaflet.sqlite');
$db->exec("INSERT INTO users (name, email, website, city, lat, lng, token) VALUES ('$name', '$email', '$website', '$city', '$lat', '$lng', '$token');");
$db = NULL;*/




closedb();

$subject = "Welcome to the Leaflet Users Map!";
$body = '
<html>
<head>
</head>
<body>
	<p>Thanks for adding yourself to the map!</p>
	Your account information:<br>
	-------------------------<br>
	Email: '.$pat_name.'<br>
	Token: '.$token.'<br>
	-------------------------<br><br>
	Should you need to edit your information, please visit the map and click on the Remove me button.<br>
	Enter your email and unique token to remove your entry from the database.<br>
	Feel free to add yourself back to the map at any time!
</body>
</html>
';
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= 'From: Leaflet Users Map <noreply@bryanmcbride.com>' . "\r\n";
//mail($email, $subject, $body, $headers, "-fnoreply@bryanmcbride.com");
?>