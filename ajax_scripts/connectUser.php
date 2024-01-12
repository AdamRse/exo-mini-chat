<?php
require_once __DIR__."/../php_config/php_headers/initHeaderAjax.php"; //Session_start et fonctions
$answer=false;
$errors=array();
$warnings=array();

if(!empty($_GET["pseudo"]) && !empty($_GET["pw"])){
    require_once __DIR__."/../php_config/bdd/Bdd.class.php"; //$bdd
    //On va chercher le pseudo
    $tabUser=$Bdd->getUserName($_GET['pseudo']);
    if($tabUser!==false){
        if(!empty($tabUser)){
            if($tabUser['pw']==$_GET["pw"]){
                unset($tabUser["pw"]);
                $_SESSION['user']=$tabUser;
                setcookie('spaceChatCnx', $tabUser['id']."!+".$_SERVER['HTTP_USER_AGENT'], time() + 3600*8);
                $answer=true;
            }
            else{
                $warnings[]=array("msg" => "Mot de passe incorrect", "code" => 10);
            }
        }
        else{
            $errors[]=array("msg" => "Impossible de trouver l'utilisateur <b>".$_GET['pseudo']."</b>", "code" => 12);
        }
    }
    else{
        $errors[]=array("msg" => $Bdd->returErrorDatabase(), "code" => 11);
    }
}
else
    $errors[]=array("msg" => "Pseudo et mot de passe obligatoires", "code" => 10);

//Retour dans un echo json
sendResponseJsonREWI($answer, $errors, $warnings);
