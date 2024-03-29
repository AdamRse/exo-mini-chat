/////////////////////////
//Init parameters
let autoRefresh = 10000;
let stat = "connection";
let errorClasses = "text-red-900 bg-red-200";
let warningClasses = "text-orange-900 bg-orange-200";
let infoClasses = "text-blue-900 bg-blue-200";

/////////////////////////
//Init var
let user = false;
let loader = document.body.querySelector('#loader');
let chatData = document.querySelector("chat-data");
let alert = document.querySelector("#alert");
let login = document.querySelector("#login");
let iLogin = login.querySelectorAll("input");
let isLog = document.querySelector("#isLog");

let page = document.querySelector("#page");
let formInscription = document.querySelector("#inscription");
let chat = document.querySelector("#chat");

/////////////////////////
//Functions
//modifie les flags de data-load de div#loader. Si tous les flags sont à 1 ça indique au script que tout les paramètres initialisés et les éléments chargés localement.
function modifyLoader(offset, val){
    let tabContent = loader.dataset.load;
    let newContent = "";
    for(let i=0; i<tabContent.length; i++){
        if(i==offset) newContent += val;
        else newContent += tabContent[i];
    }
    loader.dataset.load = newContent;
}
//vérifie si tous les flags data-load de div#loader sont à 1, ce qui veut dire que tout est chargé.
function isLoaded(){
    let tabContent = loader.dataset.load;
    let loaded = true;
    for(let i=0; i<tabContent.length; i++){
        if(tabContent[i]=="0") loaded = false;
    }

    if(loaded) loader.classList.add('hidden');
    else loader.classList.remove('hidden');
    return loaded;
}
function empty(letvar){
    return letvar == "" || letvar == undefined || letvar == false || letvar == null;
}
function isString(val){
    return typeof val === 'string' || val instanceof String;
}
//Charger le chat avec les données user passées
function initPageLoggedInOut(arrayUser = false){
    chatData = document.querySelector("chat-data");
    if(arrayUser){//On veut se connecter
        Object.keys(arrayUser).forEach(key => {
            chatData.dataset[key]=arrayUser[key];
        });
        isLog.querySelector("span").innerHTML = arrayUser.pseudo;
        isLog.classList.remove("hidden");
        login.classList.add("hidden");
        login.querySelectorAll("input").forEach(function(e){
            e.value = "";
        });
        changePage(chat);
    }
    else{//On se déconnecte
        stat = "connection";
        isLog.classList.add("hidden");
        login.classList.remove("hidden");
        //remove les attributs de chat-data
        Object.keys(chatData.dataset).forEach(dataKey => {
            delete chatData.dataset[dataKey];
        });
        changePage(formInscription);
    }
}
//modifie plusieurs classes d'un élément.
function changeMultipleClass(elem, stringAdd = "", stringRemove = ""){
    if(!empty(elem)){
        if(empty(elem.dataset.defaultTw)) elem.dataset.defaultTw = elem.className;
        if(empty(stringAdd) && empty(stringRemove)){
            //On remet les classes par défaut
            elem.className = elem.dataset.defaultTw;
        }
        else if(!empty(stringAdd)){
            let addSplit = stringAdd.split(" ");
            for(let i=0; i<addSplit.length; i++){
                if(!empty(addSplit[i])) elem.classList.add(addSplit[i]);
            }
        }
        else{
            let rmSPlit = stringRemove.split(" ");
            for(let i=0; i<rmSPlit.length; i++){
                if(!empty(rmSPlit[i])) elem.classList.remove(rmSPlit[i]);
            }
        }
    }
}
//Retourne le code de la première erreur s'il existe. Sinon false.
function returnCodeFirstError(response){
    let rt = false;
    if(response.errors.length > 0){
        if(!isString(response.errors[0])){
            rt = response.errors[0].code;
        }
    }
    return rt;
}
//Gère l'affichage des erreur, warnings et messages renvoyés par les scripts ajax. Les affiche s'il y en a sinon renvoie la réponse décapsulée.
function processAjaxResponse(tabResp){
    let msg = alert.querySelector(".msg");
    msg.innerHTML = "";
    if(tabResp.errors.length > 0){
        alert.classList.remove("hidden");
        changeMultipleClass(alert.querySelector("#box"), errorClasses, warningClasses+" "+infoClasses);
        alert.querySelector(".titre").innerHTML = "Erreur";

        for(let i = 0; i<tabResp.errors.length ; i++){
            if(isString(tabResp.errors[i])){
                msg.innerHTML += tabResp.errors[i];
            }
            else{
                msg.innerHTML += tabResp.errors[i].msg;
            }
            if(i<tabResp.errors.length-1) msg.innerHTML += "<br/>";
        }
    }
    else if(tabResp.warnings.length > 0){
        alert.classList.remove("hidden");
        changeMultipleClass(alert.querySelector("#box"), warningClasses, errorClasses+" "+infoClasses);
        alert.querySelector(".titre").innerHTML = "Attention";

        for(let i = 0; i<tabResp.warnings.length ; i++){
            if(isString(tabResp.warnings[i])){
                msg.innerHTML += tabResp.warnings[i];
            }
            else{
                msg.innerHTML += tabResp.warnings[i].msg;
            }
            if(i<tabResp.warnings.length-1) msg.innerHTML += "<br/>";
        }
    }
    else if(tabResp.infos.length > 0){
        alert.classList.remove("hidden");
        changeMultipleClass(alert.querySelector("#box"), infoClasses, errorClasses+" "+warningClasses);
        alert.querySelector(".titre").innerHTML = "Info";

        for(let i = 0; i<tabResp.infos.length ; i++){
            if(isString(tabResp.infos[i])){
                msg.innerHTML += tabResp.infos[i];
            }
            else{
                msg.innerHTML += tabResp.infos[i].msg;
            }
            if(i<tabResp.infos.length-1) msg.innerHTML += "<br/>";
        }
    }
    //return (empty(tabResp.response))?false:tabResp.response;
    return tabResp;
}
function changePage(newElem){
    page.innerHTML = "";
    let cloneElem = newElem.cloneNode(true);
    cloneElem.id = "elemPage"
    page.appendChild(cloneElem);
    loadScript(newElem.id);
}
async function getScriptPromise(phpScript, rq = "") {
    if(rq!="" && rq[0]!="?") rq = "?"+rq;
    const JsonResp = await fetch("./ajax_scripts/"+phpScript+".php"+rq);
    const tabResp = await JsonResp.json();
    return (empty(tabResp))?null:processAjaxResponse(tabResp);
}


/////////////////////////
//Init elements
//MutationObserveur détecte les changements de flags de data-load de div#loader. Si tous les flags sont à 1 il indiquera que la page est chargée et initialisée.
document.body.onload = () => {
    modifyLoader(0,1);
}
let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if(mutation.attributeName == "data-load"){
            isLoaded();
        }
    });
});
observer.observe(loader, { attributes: true });  

/////////////////////////
//Init events
alert.addEventListener("click", function(){
    this.classList.add("hidden");
});
alert.querySelector("img").addEventListener("click", function(){
    alert.classList.add("hidden");
});
alert.querySelector("#box").addEventListener("click", function(e){
    e.stopPropagation();
})
//Déconnexion
isLog.querySelector("button").addEventListener("click", function(){
    getScriptPromise("logout").then((e) => {
        initPageLoggedInOut();
    });
});
//Demmande de login
login.querySelector("button").addEventListener("click", function(){
    let user = login.querySelector("#log-username");
    let pw = login.querySelector("#log-pw");
    if(empty(user.value)){
        changeMultipleClass(user, "bg-red-200 border-red-800");
    }
    if(empty(pw.value)){
        changeMultipleClass(pw, "bg-red-200 border-red-800");
    }
    else if(!empty(user.value)){
        console.log("click button j'envoie ", "pseudo="+user.value+"&pw="+pw.value);
        getScriptPromise("connectUser", "pseudo="+user.value+"&pw="+pw.value).then((rt) => {
            if(rt.response){
                initPageLoggedInOut(rt.response);
            }
            else if(returnCodeFirstError(rt) == 10){
                //form incomplet
                console.log("form connexion incomplet");
            }
            else if(returnCodeFirstError(rt) == 11){
                //Erreur de Bdd
                console.log("form connexion erreur Bdd");
            }
        });
    }
});
iLogin.forEach((i) => {
    i.addEventListener("keypress", function(e){
        if(e.key=="Enter"){
            let user = login.querySelector("#log-username");
            let pw = login.querySelector("#log-pw");
            if(empty(user.value)){
                changeMultipleClass(user, "bg-red-200 border-red-800");
                user.focus();
            }
            if(empty(pw.value)){
                changeMultipleClass(pw, "bg-red-200 border-red-800");
                pw.focus();
            }
            else if(!empty(user.value)){

                getScriptPromise("connectUser", "pseudo="+user.value+"&pw="+pw.value).then((rt) => {
                    if(rt.response){
                        initPageLoggedInOut(rt.response);
                    }
                    else if(returnCodeFirstError(rt) == 10){
                        //form incomplet
                        console.log("form connexion incomplet");
                    }
                    else if(returnCodeFirstError(rt) == 11){
                        //Erreur de Bdd
                        console.log("form connexion erreur Bdd");
                    }
                });
            }
        }
    })
});
login.querySelector("button").addEventListener("keydown", (k) => {    let user = login.querySelector("#log-username");
    if(k.key == "Enter" && iLogin[0].value != "" && iLogin[1].value != ""){

    }
});
/////////////////////////
// Initialiser la session PHP
getScriptPromise("initSession").then((rt) => {
    if(rt.response){
        //On affiche le chat
        //Foreach d'un objet pour parcourir ses méthodes
        initPageLoggedInOut(rt.response.user);
    }
    else{
        //On affiche la page de connexion/inscription, on est déco
        changePage(formInscription);
    }

    //Je déclare le script php initialisé et prêt
    if(rt) modifyLoader(1,1);
});