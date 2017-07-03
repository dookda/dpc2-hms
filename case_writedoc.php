<?php

$postdata = file_get_contents("php://input");
if (isset($postdata)) {
    $request = json_decode($postdata);
    $add = $request->add;
    $dd = $request->dd;
    $tstart = $request->tstart;
    $tend = $request->tend;

    $template_file = 'template_hms.docx';

	$token = rand(100000, 999999);
	$fileName = "Result_File" . $token . ".docx";

	$folder = "Result";
	$fullpath = $folder . '/' . $fileName;

	try
	{
		if (!file_exists($folder))
			mkdir($folder);

		copy($template_file, $fullpath);

		$zip = new ZipArchive;
		if($zip->open($fullpath) == true)
		{			
			$key_file_name = 'word/document.xml';
			$message = $zip->getFromName($key_file_name);				
						
			$timestamp = date('Y-m-d H:i:s');
			
            $message = str_replace("address", $add, $message);
			$message = str_replace("dd", $dd, $message);
			$message = str_replace("tstart", $tstart, $message);
			$message = str_replace("tend", $tend, $message);

            $zip->addFromString($key_file_name, $message);
			$zip->close();				
		}

        $admin[] = array(
					'status' => 'true',
					'path' => $fullpath,
					'access_token' => $token
			);
        print json_encode(array("data"=>$admin));

	}
	catch (Exception $e) 
	{
		$error_message =  "Error creating the Word Document";
	}
}
