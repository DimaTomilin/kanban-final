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
    const newListItemElement=createElement("li", [inputValue],["task"])
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
            const newListItemElement=createElement("li", [task],["task"])
            listElement.appendChild(newListItemElement)
        }
        numberOfSection++;
    }
}

function dblclickEditTaskEvent(event){
    const targetElement=event.target
    if(targetElement.tagName!=="LI"){
        return;
    }
    let valueOfItem=targetElement.innerHTML
    targetElement.setAttribute("contenteditable","true")
    targetElement.addEventListener("blur", ()=>{
        for(const section in localStorageObject){
            let propertyArray=localStorageObject[section]
            if(propertyArray.includes(valueOfItem)){
                propertyArray[propertyArray.indexOf(valueOfItem)]=targetElement.innerHTML
            }
         }
        localStorage.tasks=JSON.stringify(localStorageObject)
        targetElement.setAttribute("contenteditable","false")  
    })
}

function replaceOfTask (event) {
    if(event.target.tagName!=="LI"){
        return;
    }
    const targetElement=event.target
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
        for(const section in localStorageObject){
            let propertyArray=localStorageObject[section]
            if(propertyArray.includes(targetElement.innerHTML)){
                const indexOfElement=propertyArray.indexOf(targetElement.innerHTML);
                const arrayElement=propertyArray[indexOfElement]
                propertyArray.splice(indexOfElement, 1)
                newLocalStorageArray.unshift(arrayElement)
            }
        }
        localStorage.tasks=JSON.stringify(localStorageObject)
        window.onkeydown=null;
    };
}

function searchTasks(){
    const input=document.getElementById("search")
    const valueInInput=input.value.toLowerCase()
    document.querySelectorAll("ul")
    for(let list of document.querySelectorAll("ul")){
        list.innerHTML=""
    }
    generationTasklistFromLocalStorage(localStorageObject)
    const allTasks=document.querySelectorAll(".task")
    for(let task of allTasks){
        const taskValue=task.innerHTML.toLowerCase()
        if(!taskValue.includes(valueInInput)){
            task.parentElement.removeChild(task)
        }
    }
}

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
document.querySelector("main").addEventListener("dblclick", dblclickEditTaskEvent)
document.addEventListener("mouseover", replaceOfTask);
document.getElementById("search").addEventListener("input", searchTasks)