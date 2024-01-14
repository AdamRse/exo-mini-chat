<?php
require_once __DIR__."/../php_config/php_headers/initHeaderAjax.php"; //Session_start et fonctions
require_once __DIR__."/../php_config/bdd/Bdd.class.php"; //$bdd
$answer=false;
$errors=array();

if(!empty($_GET['msg']) && isset($_GET['lastMsgId']) && isset($_SESSION["user"]['id'])){
    if($Bdd->sendMessage(json_decode($_GET['msg']), $_SESSION["user"]['id'])){
        $answer = $Bdd->getMessagesAfter($_GET['lastMsgId']);
        if(empty($answer)){
            $errors[] = array("msg" => "Impossible de récupérer le message", "code" => 12);
        }
    }
    else{
        $errors[]=array("msg" => $Bdd->returErrorDatabase(), "code" => 11);
    }
}
else{
    $errors[]=array("msg" => "Requete ajax non conforme. Attendu : Message, ID du dernier message, et être connecté.", "code" => 10);
}

//Retour dans un echo json
sendResponseJsonREWI($answer, $errors);
