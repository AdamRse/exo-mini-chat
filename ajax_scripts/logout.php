<?php
require_once __DIR__."/../php_config/php_headers/initHeaderAjax.php"; //Session_start et fonctions
session_destroy();

if(isset($_COOKIE['spaceChatCnx'])) unset($_COOKIE['spaceChatCnx']);
setcookie("spaceChatCnx","", -1);

sendResponseJsonREWI(array(true));