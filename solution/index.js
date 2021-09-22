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
localStorage.setItem("tasks","");
const localStorageObject={
    "todo":[],
    "in-progress":[],
    "done":[],
}
