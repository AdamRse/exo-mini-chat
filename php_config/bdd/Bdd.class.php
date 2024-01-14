<?php
class Bdd extends PDO {

    private const sgbd = 'mysql';
    private const server = "127.0.0.1";
    private const db = "miniChat";
    //private const user = "root";
    private const user = "adam";
    //private const pw = "";
    private const pw = "crepuscule";

    public function __construct(){
        $connectionString = self::sgbd.":dbname=".self::db.";host=".self::server;
        parent::__construct($connectionString, self::user, self::pw);
        $this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    public function returErrorDatabase(){
        $error = $this->errorInfo();
        return "Mysql renvoie une erreur : ".$error[2]."<br/>Mysql code : ".$error[1]."<br/>PDO code : ".$error[2];
    }
    private function rqPrepareFromArray($a, $table, $type = "insert"){
        $sqlCol = "";
        $sqlVal = "";
        $rq = "";
        if($type == "insert"){
            foreach ($a as $col => $v) {
                if(!empty($v) || $v===0){
                    $sqlCol .= "$col, ";
                    $sqlVal .= ":$col, ";
                }
            }
            $sqlCol = substr($sqlCol,0,-2);
            $sqlVal = substr($sqlVal,0,-2);
            $rq = "INSERT INTO $table ($sqlCol) VALUES ($sqlVal);";
        }
        return $rq;
    }

    public function addUser($a){//["col DB"] => value
        $a['pseudo']=strtolower($a['pseudo']);
        $q = $this->prepare($this->rqPrepareFromArray($a, "users"));
        return $q->execute($a);
    }
    public function getUserId($id){
        $q = $this->prepare("SELECT * FROM users WHERE id = :id");
        $q->execute(array("id" => $id));
        return $q->fetch(PDO::FETCH_ASSOC);
    }
    public function getUserName($pseudo){
        $q = $this->prepare("SELECT * FROM users WHERE pseudo = LOWER(:p)");
        $q->execute(array("p" => $pseudo));
        return $q->fetch(PDO::FETCH_ASSOC);
    }
    public function isUser($pseudo){
        $q = $this->prepare("SELECT * FROM users WHERE pseudo = LOWER(:p)");
        $q->execute(array("p" => $pseudo));
        return $q->rowCount()!=0;
    }
    public function getMessage($id){
        $q = $this->prepare("SELECT m.id as messageId, u.id as userId, u.pseudo, m.content, u.color, m.ip, m.dt_msg
                                FROM messages as m
                                LEFT JOIN users as u
                                ON m.m_user = u.id
                                WHERE m.id = :id;");
        $q->execute(["id" => $id]);
        return $q->fetch(PDO::FETCH_ASSOC);
    }
    public function getLastsMessages(){
        $q = $this->prepare("SELECT m.id as messageId, u.id as userId, u.pseudo, m.content, u.color, m.ip, m.dt_msg
                                FROM messages as m
                                LEFT JOIN users as u
                                ON m.m_user = u.id
                                ORDER BY m.id ASC
                                LIMIT 0, 50;");
        $q->execute();
        return $q->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getMessagesAfter($idMessage){
        $q = $this->prepare("SELECT m.id as messageId, u.id as userId, u.pseudo, m.content, u.color, m.ip, m.dt_msg
                                FROM messages as m
                                LEFT JOIN users as u
                                ON m.m_user = u.id
                                WHERE m.id > :idM
                                ORDER BY m.id ASC
                                LIMIT 0, 50;");
        $q->execute(["idM" => $idMessage]);
        return $q->fetchAll(PDO::FETCH_ASSOC);
    }
    public function sendMessage($msg, $userId){
        $msg=preg_replace("/<(^>)+>/", "", $msg);
        $msg=nl2br(preg_replace("/\n{2,}/", "\n", $msg));//On gère les sauts de ligne
        $q = $this->prepare("INSERT INTO messages (content, m_user, m_chatroom, ip, user_agent) VALUES (:m, :u, :c, :ip, :ua)");
        return $q->execute(["m" => $msg, "u" => $userId, "c" => "1", "ip" => $_SERVER['REMOTE_ADDR'], "ua" => $_SERVER['HTTP_USER_AGENT']]);
    }
}
$Bdd = new Bdd();