<?php
require_once __DIR__."/../php_config/php_headers/initHeaderAjax.php"; //Session_start et fonctions
$answer=false;
$errors=array();

if(!empty($_GET["pseudo"]) && !empty($_GET["pw"])){
    require_once __DIR__."/../php_config/bdd/Bdd.class.php"; //$bdd
    //On check si le pseudo est déjà pris.
    if(!$Bdd->isUser($_GET['pseudo'])){
        //On vérifie qu'aucune valeur n'est vide
        if(checkArrayDatas($_GET, $errors)){
            //On peut construire la requête avec les données

            if($Bdd->addUser($_GET))
                $answer=true;
            else
                $errors[]=array("msg" => $Bdd->returErrorDatabase(), "code" => 20);
        }
    }
    else{
        $errors[]=array("msg" => "L'utilisateur ".$_GET['pseudo']." existe déjà, veuillez choisir un autre pseudo", "code" => 11);
    }
}
else
    $errors[]=array("msg" => "Pseudo et mot de passe obligatoires", "code" => 10);

//Retour dans un echo json
sendResponseJsonREWI($answer, $errors);
