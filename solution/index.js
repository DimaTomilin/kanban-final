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
    const listItemElement=createElement("li", [inputValue],["list-item"])
    listElement.append(listItemElement)
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

localStorage.setItem("tasks","");
const localStorageObject={
    "todo":[],
    "in-progress":[],
    "done":[],
}
document.querySelector("main").addEventListener("click", addTaskClickEvent)