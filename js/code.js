
//Init var
//loader; utilisable depuis init.js

//Functions

//Code
function loadScript(elemId){
    let ep = document.querySelector("#elemPage");

    //Formulaire d'inscription
    if(elemId=="inscription"){
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

    }
}