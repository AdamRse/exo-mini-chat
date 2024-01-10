<?php
function sendResponseJson($response, Array $errors = array(), Array $warnings = array(), Array $infos = array()){
    $r = array(
        "response" => $response
        , "errors" => $errors
        , "warning" => $warnings
        , "info" => $infos
    );
    echo json_encode($r);
}