<?php
require_once __DIR__."/../php_config/php_headers/initHeaderAjax.php"; //Session_start et fonctions
require_once __DIR__."/../php_config/bdd/Bdd.class.php"; //$bdd
$answer=false;
$errors=array();

$msgs = $Bdd->getLastsMessages();
if($msgs!==false){
    $answer = (empty($msgs))?true:$msgs;
}
else{
    $errors[]=array("msg" => $Bdd->returErrorDatabase(), "code" => 10);
}

//Retour dans un echo json
sendResponseJsonREWI($answer, $errors);
