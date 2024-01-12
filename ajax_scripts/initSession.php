<?php
require_once __DIR__."/../php_config/php_headers/initHeaderAjax.php"; //Session_start et fonctions

$user = false;
if(empty($_SESSION['user'])){
    if(empty($_COOKIE['spaceChatCnx'])){
        $user = false;
    }
    else{
        $expl = explode('!+', $_COOKIE['spaceChatCnx'], 2);
        if(sizeof($expl)==2){
            require_once __DIR__."/../php_config/bdd/Bdd.class.php"; //$bdd
            $userBdd=$Bdd->getUserId($expl[0]);
            if(!empty($userBdd['id'])){
                if($expl[1]==$_SERVER['HTTP_USER_AGENT']){
                    unset($userBdd['pw']);
                    $_SESSION['user']=$userBdd;
                    $user=$_SESSION['user']['id'];
                }
            }
            else{
                $user = false;
            }
        }
        else{
            $user = false;
        }
    }
}
else
    $user=$_SESSION['user']['id'];

$r = array(
    "user" => $user
);

sendResponseJsonREWI($r);