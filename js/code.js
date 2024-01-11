
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
            getScriptPromise("createUser", rq).then((response) => {
                btForm.disabled=false;
                if(response === true){
                    
                }
            });
        });
    }
    else if(elemId=="chat"){// Chat

    }
}