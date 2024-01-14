
//Init var
//loader; utilisable depuis init.js

//Functions

//Code
function loadScript(elemId){
    let ep = document.querySelector("#elemPage");

    //Formulaire d'inscription
    if(elemId=="inscription"){
        stat = "inscription";
        let btForm = ep.querySelector("button");
        btForm.addEventListener("click", function(){//Envoyer le formulaire d'inscription
            this.disabled=true;
            let rq = "";
            let data = ep.querySelectorAll("input").forEach(function(e){
                if(!empty(e.value)){
                    if(rq != ""){
                        rq += "&";
                    }
                    rq += e.name+"="+e.value
                } 
            });
            getScriptPromise("createUser", rq).then((rt) => {
                btForm.disabled=false;
                let iPseudo = ep.querySelector("#i-pseudo");
                if(rt.response === true){
                    let logPseudo = document.querySelector("#log-username");
                    let divMsgInline = document.querySelector('#message-inline');
                    logPseudo.value = iPseudo.value;
                    document.querySelector("#log-pw").focus();
                    divMsgInline.querySelector("p").innerHTML = "Utilisateur <b>"+logPseudo.value+"</b> enregistré !<br/>Connectez vous avec votre mot de passe au dessus."
                    changePage(divMsgInline);
                    changeMultipleClass(logPseudo, "bg-green-200 border-green-800");

                }
                else if(returnCodeFirstError(rt) == 11){
                    changeMultipleClass(iPseudo, "bg-red-200 border-red-800", "bg-gray-200 border-gray-200");
                    iPseudo.focus();
                }
                else if(returnCodeFirstError(rt) == 10){
                    let iPw = ep.querySelector("#i-pw");
                    changeMultipleClass(iPseudo, "bg-red-200 border-red-800", "bg-gray-200 border-gray-200");
                    changeMultipleClass(iPw, "bg-red-200 border-red-800", "bg-gray-200 border-gray-200");
                }
            });
        });
    }
    else if(elemId=="chat"){// Chat
        stat = "chat";

        let taText = ep.querySelector(".taMessage");
        let btSend = ep.querySelector(".sendMessage");
        let keyDownNow = "";

        
        taText.addEventListener("keydown", (k) => {
            let taText = ep.querySelector(".taMessage");
            console.log(k.key);
            if(k.key == "Enter" && taText.value != "" && keyDownNow != "Shift"){
                    btSend.disabled = true;
                    sendMessage();
            }
            keyDownNow = k.key;
        });
        taText.addEventListener("keyup", () => {
            keyDownNow = "";
        })
        btSend.addEventListener("click", () => {
            btSend.disabled = true;
            sendMessage();
        });

        refreshMessage();
    }
}
function sendMessage(){
    let taText = document.querySelector("#elemPage .taMessage");
    let btSend = document.querySelector("#elemPage .sendMessage");
    let affichage = document.querySelector("#elemPage .affichage");
    let lastMsgId = (empty(affichage.lastChild.id))?0:affichage.lastChild.id.split("-")[1];
    getScriptPromise("sendMsg", 'lastMsgId='+lastMsgId+'&msg='+JSON.stringify(taText.value)).then((rt) => {
        if(rt.response){
            if(!empty(rt.response.length)){
                rt.response.forEach((m) => {
                    addMessage(m.content, m.messageId, m.pseudo, m.dt_msg);
                })
                affichage.scrollTo(0, affichage.scrollHeight);
                btSend.disabled = false;
                taText.value = "";
            }
            else{
                console.log("Retour non attendu de la réponse de sendMsg.php : ", rt);
            }
        }
        else{
            console.log("Le script sendMsg.php renvoie une erreur");
        }
    });
}
function refreshMessage(){
    let affichage = document.querySelector("#elemPage .affichage");
    let lastIdMessage = (empty(affichage.lastChild.id))?0:affichage.lastChild.id.split("-")[1];
    let tplMessage = document.querySelector("#elemPage .tpl-message");
    console.log("je refresh avec lastId",lastIdMessage);
    if(lastIdMessage === 0){//On prend tous les messages
        getScriptPromise("getMsg").then((rt) => {
            if(rt.response){
                if(empty(rt.response.length)){
                    //Pas de message en BDD
                }
                else{
                    affichage.innerHTML = "";
                    rt.response.forEach((m) => {
                        addMessage(m.content, m.messageId, m.pseudo, m.dt_msg, m.color, tplMessage, affichage)
                    });
                    affichage.scrollTo(0, affichage.scrollHeight);
                }
            }
        });
    }
    else{// On prend que les messages après lastChild.id
        getScriptPromise("refresh", "lastIdMessage="+lastIdMessage).then((rt) => {
            if(rt.response){
                if(rt.response!==true){//Il y a es messages à refresh
                    rt.response.forEach((m) => {
                        addMessage(m.content, m.messageId, m.pseudo, m.dt_msg, m.color, tplMessage, affichage)
                    })
                }
            }
        });
    }
    affichage.scrollTo(0, affichage.scrollHeight);
    setTimeout(() => {
        if(stat == "chat") refreshMessage();
    }, autoRefresh);
}
function addMessage(message, idMessage, author, date, color, template = document.querySelector("#elemPage .tpl-message"), divAffichage = document.querySelector("#elemPage .affichage")){
    let newMsg = template.cloneNode(true);
    newMsg.id = "idm-"+idMessage;
    newMsg.classList.remove("hidden");
    let content = newMsg.querySelectorAll("div");
    content[0].innerHTML = message;
    //content[0].classList.add("");
    content[1].innerHTML = "<b>"+author+"</b> ("+date+")";
    content[1].style.color = "#"+color;
    divAffichage.appendChild(newMsg);
}