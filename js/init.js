
//Init var
let loader = document.body.querySelector('#loader');
let chatData = document.querySelector("chat-data");

//Functions
function modifyLoader(offset, val){
    let tabContent = loader.dataset.load;
    let newContent = "";
    for(let i=0; i<tabContent.length; i++){
        if(i==offset) newContent += val;
        else newContent += tabContent[i];
    }
    loader.dataset.load = newContent;
}
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

//Init elements
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

//Chargement de chat-data
chatData.dataset.hello = "world!";