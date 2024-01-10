<?php
function sendResponseJson($response, Array $errors = array(), Array $warnings = array(), Array $infos = array()){
    $r = array(
        "response" => $response
        , "errors" => $errors
        , "warnings" => $warnings
        , "infos" => $infos
    );
    echo json_encode($r);
}