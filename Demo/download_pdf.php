<?php
$path = $_REQUEST['MyXml'];
        if ($fd = fopen ($path, "r"))
        {
                $path_parts = pathinfo($path);
		$ext = strtolower($path_parts["extension"]);
                header("Content-type: application/octet-stream");   
                header("Content-Disposition: filename=\"".$path_parts["basename"]."\"");
		header("Cache-control: private"); //use this to open files directly
                while(!feof($fd))
                {
                        $buffer = fread($fd, 2048);
                        echo $buffer;
                }
        }
        fclose ($fd);
        exit;
?>
