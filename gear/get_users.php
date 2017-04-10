<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");


//$db = new PDO('sqlite:leaflet.sqlite');
//$sql = "SELECT id, name, website, city, lat, lng FROM users;";

include "../lib/hms.php";
conndb();

$sql = "SELECT pat_name, doc_name, add_no, vill_name, date_sick, lat, lng FROM dengue_point";

$rs = pg_query($sql);
if (!$rs) {
    echo "An SQL error occured.\n";
    exit;
}

$rows = array();
while ($r = pg_fetch_assoc($rs)) {
//while($r = $rs->fetch(PDO::FETCH_ASSOC)) {
//while($r = $rs->fetch(PDO::FETCH_ASSOC)) {
    $rows[] = $r;
}
print json_encode($rows);

closedb();
//$db = NULL;
?>