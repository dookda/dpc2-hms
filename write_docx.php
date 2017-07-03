<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Employee Details</title>
  </head>
  <body>
    <form method="post" action="#">
      <input type="text" name="e_name" />        
      <input type="text" name="e_email" />
      <input type="submit" name="e_submit" />
    </form>
  </body>

<?php

if(isset($_POST["e_submit"]))
{

	$name=(string) $_POST["e_name"];
    $email=(string) $_POST["e_email"];
	//Step 1 : Template Docx file
	$template_file = 'template.docx';

	$rand_no = rand(100000, 999999);
	$fileName = "Result_File" . $rand_no . ".docx";

	$folder = "Result";
	$fullpath = $folder . '/' . $fileName;

	try
	{
		//Create the Result Directory if Directory is not created already
		if (!file_exists($folder))
			mkdir($folder);
			
		//Copy the Template file to the Result Directory
		copy($template_file, $fullpath);

		$zip = new ZipArchive;

		//Docx file is nothing but a zip file. Open this Zip File
		if($zip->open($fullpath) == true)
		{
			//In the Open XML Wordprocessing format content is stored
			//in the document.xml file located in the word directory.
			
			$key_file_name = 'word/document.xml';
			$message = $zip->getFromName($key_file_name);				
						
			$timestamp = date('Y-m-d H:i:s');
			
			//Replace the Placeholders with actual values
			$message = str_replace("{{Name}}", $name, $message);
			$message = str_replace("{{Email}}", $email, $message);
			
			//Replace the content with the new content created above.
			$zip->addFromString($key_file_name, $message);
			$zip->close();
				
			//That's it, you have the new Word document in the Result Directory with placeholders replaced with new content
		}

		echo 'write successful';
	}
	catch (Exception $e) 
	{
		$error_message =  "Error creating the Word Document";
		//TODO : Handle the error message
	}
}

?>

</html>