<?php
require_once "./php_config/php_headers/initHeaderAjax.php"; //Session_start et fonctions

$user = false;
if(empty($_SESSION)){
    if(empty($_COOKIE)){
        $user = "user en cookie";
    }
    $user = "user en session";
}

$r = array(
    "user" => $user
);

sendResponseJson($r);