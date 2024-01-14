<?php
require_once __DIR__."/../php_config/php_headers/initHeaderAjax.php"; //Session_start et fonctions
require_once __DIR__."/../php_config/bdd/Bdd.class.php"; //$bdd
$answer=false;
$errors=array();

if(!empty($_GET['lastIdMessage'])){
    $msgs = $Bdd->getMessagesAfter($_GET['lastIdMessage']);
    if($msgs!==false){
        $answer = (empty($msgs[0]))?true:$msgs;
    }
    else{
        $errors[]=array("msg" => $Bdd->returErrorDatabase(), "code" => 10);
    }
}
else{
    $errors[]=array("msg" => "ID du dernier message non correct", "code" => 10);
}

//Retour dans un echo json
sendResponseJsonREWI($answer, $errors);
