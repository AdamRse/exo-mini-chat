<?php
function sendResponseJsonREWI($response, Array $errors = array(), Array $warnings = array(), Array $infos = array()){
    $r = array(
        "response" => $response
        , "errors" => $errors
        , "warnings" => $warnings
        , "infos" => $infos
    );
    echo json_encode($r);
}
function checkArrayDatas($a, &$isEmpty = array()){
    foreach ($a as $k => $v){
        if (empty($v)) $isEmpty[] = "Valeur de $k attendue (vide envoyée)";
    }
    return empty($isEmpty);
}