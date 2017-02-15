<?php
    date_default_timezone_set("Asia/Dhaka");
    
    function save_to_db($word , $fb_name , $fb_email) {
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "fb_app";
        $conn = new mysqli($servername, $username, $password, $dbname);
        $conn->query("SET CHARACTER SET utf8");
        $conn->query("SET SESSION collation_connection ='utf8_general_ci'");
        // Create connection
        
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        } 
        $ip = $_SERVER['REMOTE_ADDR'];
        $cur_time = date('Y-m-d H:i:s');

        $sql = "INSERT INTO vote (word, ip, fb_name,fb_email,created_At)
        VALUES ('$word', '$ip' , '$fb_name', '$fb_email' , '$cur_time')";
        if ($conn->query($sql) === TRUE) {
            return true ;
        } else {
           // echo "Error: " . $sql . "<br>" . $conn->error;
           return false ;
        }
        $conn->close();
    }
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        $_TYPE = $_POST['type'];
        $SELECTED_WORD = $_POST["val_1"];
        if($_TYPE == '1') { 
            $STICKER = $_POST["sticker"];
            
            $FB_NAME = $_POST["fb_name"];
            $FB_EMAIL = $_POST["fb_email"];
            
            $water_marked_text = $SELECTED_WORD ;
            $fb_image_url = $_POST['image_uri'];
            $user_id = $_POST['user_id'];
            $stamp = imagecreatefrompng('assets/app_pic/stickers/'. $STICKER .'.png');
            
            //$stamp = resize_image("assets/app_pic/profile masking-07.png" , "200" , "200");
            $im = imagecreatefromjpeg($fb_image_url);
            $marge_right = 0;
    		$marge_bottom = 0;
    		$sx = imagesx($stamp);
    		$sy = imagesy($stamp);
    		imagecopy($im, $stamp, imagesx($im) - $sx - $marge_right, imagesy($im) - $sy - $marge_bottom, 0, 0, $sx, $sy);
    		$save =  strtolower("assets/user_pic/"). $user_id .".png";
    		imagepng($im,$save);
    		imagedestroy($im);
            
            // Save a copy of photo for share only
            $temp = resize_image($save , "600" , "315");
            $save2 =  strtolower("assets/user_pic/"). $user_id ."_share.png";
            imagepng($temp,$save2);
            
            save_to_db($SELECTED_WORD, $FB_NAME , $FB_EMAIL);
            
            $arrayName = array('status' => 'Success' , 'url_is' => $save , 'share_able_url' => $save2, 'sticker_id' => $STICKER );
            echo json_encode($arrayName);
        } else {
            save_to_db($SELECTED_WORD, NULL , NULL);
            $arrayName = array('status' => 'Success' );
            echo json_encode($arrayName);

        }      

    }
    
    function resize_image($file, $w, $h, $crop=FALSE) {
        list($width, $height) = getimagesize($file);
        $r = $width / $height;
        if ($crop) {
            if ($width > $height) {
                $width = ceil($width-($width*abs($r-$w/$h)));
            } else {
                $height = ceil($height-($height*abs($r-$w/$h)));
            }
            $newwidth = $w;
            $newheight = $h;
        } else {
            if ($w/$h > $r) {
                $newwidth = $h*$r;
                $newheight = $h;
            } else {
                $newheight = $w/$r;
                $newwidth = $w;
            }
        }
        $src = imagecreatefrompng($file);
        $dst = imagecreatetruecolor($newwidth, $newheight);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
    
        return $dst;
    }
  


?>