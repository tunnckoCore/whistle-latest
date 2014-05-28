<?php
/**
 * @author      George Yanev (http://github.com/tunnckoCore)
 * 
 * @license     MIT License (http://opensource.org/licenses/MIT)
 * @copyright   2013, WAF Development
 */
//require 'system/WhistleBitly.php';
//$bitlyApi = new WhistleBitly();
//$bitlyApi->start('required use only for fb', 'required use only for fb');
/*
 * Usage
 *
$whistle = new WhistleApis();
$whistle->start('511956138886922', '6ce16e5dfc522664f2d29d3d8a1a32f9');

echo '<h1>apis.cdnm.whistle.bg</h1><hr>';
$whistle->bitlyCreateLink('cs1bg', 'http://www.cs-bg.info/');

echo 'Original link of <b>'.$whistle->bitlyGetLink('cs1bg').'</b>';
echo ' ===> <b>' . $whistle->bitlyGetLink('cs1bg', 'original') . '</b>';
 * 
 */

$data = array();

if (isset($_GET['files'])) {
    $error = false;
    $files = array();

    $uploaddir = './uploads/';
    foreach ($_FILES as $key => $file) {
        $basenameFile = basename($file['name']);
        /**
         * RENAME FILE
         */
        $newFilename = rand(0, 99999999) . strrchr($basenameFile, '.');

        /**
         * CHECK EXISTS RENAMED FILE
         */
        if (file_exists($uploaddir . $newFilename)) {
            $newFilename = rand(0, 999999999999) . strrchr($basenameFile, '.');
        }
        if (move_uploaded_file($file['tmp_name'], $uploaddir . $newFilename)) {
            $files[] = $newFilename;
            //$bitlyKey = 'j'.$key.'mpApi';
            //$bitlyApi->bitlyCreateLink($bitlyKey, 'http://www.whistle-bg.tk/preview/'.$newFilename);
            
            //$bitlys[] = $bitlyApi->bitlyGetLink($bitlyKey);
        } else {
            $error = true;
        }
    }
    $data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
} else {
    $data = array('success' => 'Form was submitted', 'formData' => $_POST);
}

echo json_encode($data);
