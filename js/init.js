
//Init parameters
let errorClasses = "text-red-900 bg-red-200";
let warningClasses = "text-orange-900 bg-orange-200";
let infoClasses = "text-blue-900 bg-blue-200";

//Init var
let loader = document.body.querySelector('#loader');
let chatData = document.querySelector("chat-data");
let alert = document.querySelector("#alert");

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
//modifie plusieurs classes d'un élément.
function changeMultipleClass(elem, stringAdd = "", stringRemove = ""){
    if(empty(elem)){
        if(!empty(stringAdd)){
            let addSplit = stringAdd.split(" ");
            for(let i=0; i<addSplit.length; i++){
                if(!empty(addSplit[i])) elem.classList.add(addSplit[i]);
            }
        }
        if(!empty(stringRemove)){
            let rmSPlit = stringRemove.split(" ");
            for(let i=0; i<rmSPlit.length; i++){
                if(!empty(rmSPlit[i])) elem.classList.remove(rmSPlit[i]);
            }
        }
    }
}
//Gère les erreur, warnings et messages renvoyés par les scripts ajax. Les affiche s'il y en a sinon renvoie la réponse décapsulée.
function processAjaxResponse(tabResp){
    if(tabResp.errors.length > 0){
        let msg = alert.querySelector(".msg").innerHTML = "";
        alert.classList.remove("hidden");
        changeMultipleClass(alert.querySelector("#box"), errorClasses, warningClasses+" "+infoClasses);
        alert.querySelector(".titre").innerHTML = "Erreur";

        for(let i = 0; i<tabResp.errors.length ; i++){
            msg.innerHTML += tabResp.errors[i];
            if(i<tabResp.errors.length-1) msg.innerHTML += "<br/>";
        }
    }
    else if(tabResp.warnings.length > 0){
        let msg = alert.querySelector(".msg").innerHTML = "";
        alert.classList.remove("hidden");
        changeMultipleClass(alert.querySelector("#box"), warningClasses, errorClasses+" "+infoClasses);
        alert.querySelector(".titre").innerHTML = "Attention";

        for(let i = 0; i<tabResp.warnings.length ; i++){
            msg.innerHTML += tabResp.warnings[i];
            if(i<tabResp.warnings.length-1) msg.innerHTML += "<br/>";
        }
    }
    else if(tabResp.infos.length > 0){
        let msg = alert.querySelector(".msg").innerHTML = "";
        alert.classList.remove("hidden");
        changeMultipleClass(alert.querySelector("#box"), infoClasses, errorClasses+" "+warningClasses);
        alert.querySelector(".titre").innerHTML = "Info";

        for(let i = 0; i<tabResp.infos.length ; i++){
            msg.innerHTML += tabResp.infos[i];
            if(i<tabResp.infos.length-1) msg.innerHTML += "<br/>";
        }
    }
    return (empty(tabResp.response))?false:tabResp.response;
}
async function getScriptPromise(phpScript, rq = "") {
    if(rq!="" && rq[0]!="?") rq = "?"+rq;
    const JsonResp = await fetch("./ajax_scripts/"+phpScript+".php"+rq);
    const tabResp = await JsonResp.json();
    return processAjaxResponse(tabResp);;
}



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

// Appelez la fonction pour exécuter le script PHP et utiliser la réponse
getScriptPromise("initSession").then((response) => {
    //Je déclare le script php initialisé et prêt
    if(response) modifyLoader(1,1);
});