function createElement(tagName, children = [], classes = [], attributes = {}, eventListeners = {}) {
    let el = document.createElement(tagName)
    //Adding children
    for(const child of children){
        el.append(child);
    }
    //Adding classes
    for(const cls of classes){
        el.classList.add(cls);
    }
    //Adding attributes
    for(const attr in attributes){
        el.setAttribute(attr, attributes[attr])
    }
    //Adding events
    for(const event in eventListeners){
        el.addEventListener(event, eventListeners[event])
    }
    return  el
}

function displayLoading(){
    loaderElement.classList.add("loader")
}

function hideLoading(){
    loaderElement.classList.remove("loader")
}

function addTaskClickEvent(event) {
    const target=event.target
    if(target.tagName!=="BUTTON"){
        return;
    }
    const input=target.previousElementSibling
    let inputValue=input.value
    if(inputValue===""){
        alert ("You can`t add empty task.")
        return;
    }
    const listElement=target.parentElement.querySelector("ul")
    const starIconElement=createElement("i",[],["fa", "fa-star"])
    const textElement=createElement("div",[inputValue],["task-text"])
    const newListItemElement=createElement("li", [textElement, starIconElement],["task"],{draggable:"true"},{"dblclick": dblclickEditTaskEvent, "mouseover": replaceOfTask, "dragstart": dragEvent})
    listElement.insertBefore(newListItemElement, listElement.childNodes[0]);
    switch(target.id){
        case "submit-add-to-do":
            localStorageObject.todo.unshift(inputValue)
            break;
        case "submit-add-in-progress":
            localStorageObject["in-progress"].unshift(inputValue)
            break;
        case "submit-add-done":
            localStorageObject.done.unshift(inputValue)
            break;
    }
    localStorage.tasks=JSON.stringify(localStorageObject);
    input.value="";
}

function generationTasklistFromLocalStorage(obj){
    let numberOfSection=0
    for(const property in obj){
        const tasks=obj[property]
        for(const task of tasks){
            const listElement=document.querySelectorAll("ul")[numberOfSection]
            const starIconElement=createElement("i",[],["fa", "fa-star"])
            const textElement=createElement("div",[task],["task-text"])
            const newListItemElement=createElement("li", [textElement, starIconElement],["task"],{draggable:"true"},{"dblclick": dblclickEditTaskEvent, "mouseover": replaceOfTask, "dragstart": dragEvent})
            listElement.appendChild(newListItemElement)
        }
        numberOfSection++;
    }
}

function dblclickEditTaskEvent(event){
    const targetElement=event.target.closest("li").querySelector(".task-text")
    let valueOfItem=targetElement.textContent
    targetElement.setAttribute("contenteditable","true")
    targetElement.focus()
    targetElement.addEventListener("blur", ()=>{
        if(targetElement.textContent===""){
            alert("You can`t save empty task");
            targetElement.textContent=valueOfItem;
            targetElement.setAttribute("contenteditable","false")
            return;
        }
        for(const section in localStorageObject){
            let propertyArray=localStorageObject[section]
            if(propertyArray.includes(valueOfItem)){
                propertyArray[propertyArray.indexOf(valueOfItem)]=targetElement.innerText
            }
        }
        localStorage.tasks=JSON.stringify(localStorageObject)
        console.log(localStorage.tasks)
        targetElement.setAttribute("contenteditable","false")
    })
}

function removeReplacingElement(elementValue){
    for(const section in localStorageObject){
        let propertyArray=localStorageObject[section]
        if(propertyArray.includes(elementValue)){
            const indexOfElement=propertyArray.indexOf(elementValue);
            propertyArray.splice(indexOfElement, 1)
        }
    }
}
function replaceOfTask (event) {
    const targetElement=event.target.closest("li")
    window.onkeydown = function (event2) {
        if(!event2.code.includes("Digit")){
            return
        }
        if(event2.altKey===false){
            return
        }
        const key=parseInt(event2.key)
        if(key>3){
            return
        }
        let newParentElement;
        let newLocalStorageArray;
        switch(key){
            case 1:
                newParentElement=document.querySelector(".to-do-tasks")
                newLocalStorageArray=localStorageObject.todo
                break;
            case 2:
                newParentElement=document.querySelector(".in-progress-tasks")
                newLocalStorageArray=localStorageObject["in-progress"]
                break;
            case 3:
                newParentElement=document.querySelector(".done-tasks")
                newLocalStorageArray=localStorageObject.done
                break;
        }
        newParentElement.insertBefore(targetElement, newParentElement.childNodes[0]);
        removeReplacingElement(targetElement.innerText)
        newLocalStorageArray.unshift(targetElement.innerText)
        localStorage.tasks=JSON.stringify(localStorageObject)
        window.onkeydown=null;
    };
}

function refreshTaskSection(){
    const allListsOfTasks=document.querySelectorAll("ul")
    for(let list of allListsOfTasks){
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
    }
    generationTasklistFromLocalStorage(localStorageObject)
}

function searchTasks(){
    const input=document.getElementById("search")
    const valueInInput=input.value.toLowerCase()
    refreshTaskSection();
    const allTasks=document.querySelectorAll(".task")
    for(let task of allTasks){
        const taskValue=task.innerText.toLowerCase()
        if(!taskValue.includes(valueInInput)){
            task.parentElement.removeChild(task)
        }
    }
}

 async function saveToStorage(){
    displayLoading();
    const response = await fetch("https://json-bins.herokuapp.com/bin/614ee0bfc092dca86cb87689", { //send request to API
        method: "PUT" ,
        headers: {
            'Accept': "application/json" ,
            'Content-Type': "application/json",
        },
        body: JSON.stringify({"tasks": localStorageObject})
    })
    hideLoading();
    if(!response.ok){ // error part: behavior of all elements in error situation anf throw ERROR with current status
        alert("ERROR "+response.status+". "+response.statusText)//displaying in result element at error message
        throw `ERROR ${response.status}`
    }
    
}

async function loadFromStorage(){
    displayLoading();
    const response =await fetch("https://json-bins.herokuapp.com/bin/614ee0bfc092dca86cb87689")
    if(!response.ok){ // error part: behavior of all elements in error situation anf throw ERROR with current status
        alert("ERROR "+response.status+". "+response.statusText)//displaying in result element at error message
        throw `ERROR ${response.status}`
    }
    hideLoading();
    const tasksOBjectFromStorage=(await response.json()).tasks
    localStorageObject=tasksOBjectFromStorage;
    localStorage.tasks=JSON.stringify(localStorageObject);
    
    refreshTaskSection();
    
}

function dragEvent (event){
    draggingElement=event.target.closest("li")
    event.dataTransfer.setData("text", event.target.closest("ul").className);
    const sections = document.querySelectorAll("section")
    for(let section of sections){
        section.addEventListener("dragover", allowDrop)
        section.addEventListener("drop", dropEvent)
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function dropEvent(event) {
    event.preventDefault();
    const previousParentClassName=event.dataTransfer.getData("text");
    const newSectionClass = event.target.closest("section").className
    const newParentList=event.target.closest("section").querySelector("ul")
    const valueOfDraggingElement=draggingElement.textContent
    switch(newSectionClass){
        case "dropzone":
            newParentList.insertBefore(draggingElement, newParentList.childNodes[0]);
            removeReplacingElement(valueOfDraggingElement);
            let localStorageArray;
            switch(newParentList.className){
                case "in-progress-tasks":
                    localStorageArray=localStorageObject["in-progress"]
                    break;
                case "to-do-tasks":
                    localStorageArray=localStorageObject["todo"]
                    break;
                case "done-tasks":
                    localStorageArray=localStorageObject["done"]
                    break;
            }
            localStorageArray.unshift(valueOfDraggingElement)
            localStorage.tasks=JSON.stringify(localStorageObject)
            break;
        case "removezone":
            document.querySelector(`.${previousParentClassName}`).removeChild(draggingElement);
            removeReplacingElement(valueOfDraggingElement);
            localStorage.tasks=JSON.stringify(localStorageObject)
            break;
    }
}


let draggingElement;

const loaderElement = document.querySelector("#loader")

let localStorageObject={
    "todo":[],
    "in-progress":[],
    "done":[],
}
if(localStorage.getItem("tasks")===null){
    localStorage.setItem("tasks","");
    localStorage.tasks=JSON.stringify(localStorageObject);
} else {
    localStorageObject=JSON.parse(localStorage.getItem("tasks"));
    generationTasklistFromLocalStorage(localStorageObject);
}

document.querySelector("main").addEventListener("click", addTaskClickEvent)
document.getElementById("search").addEventListener("input", searchTasks)
document.getElementById("save-btn").addEventListener("click", saveToStorage)
document.getElementById("load-btn").addEventListener("click", loadFromStorage)

