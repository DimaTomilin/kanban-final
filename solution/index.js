/*
*
*
DOM
*
*
*/

//Generit function of creating DOM element with all children, classes etc.
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

// Function of creating structure of all <li> elements with argument of value
function createNewTaskElement(value){
    const starIconElement=createElement("i",[],["fa", "fa-star"],{},{"click": toggleToImportantTasks})
    const textElement=createElement("div",[value]) //Adding div element to more comfortable using with other functions
    const newTasklement=createElement("li", [textElement, starIconElement],["task"],{draggable:"true"},{"dblclick": dblclickEditTaskEvent, "mouseover": replaceOfTask, "dragstart": dragEvent})
    return newTasklement;
}

//Fucntion of creating all tasks element from localStorage
function generationTasklist(){
    const allTasks = getTasksFromStorage()

    for(const [taskType, taskList] of Object.entries(allTasks)){
        const taskListElement = document.querySelector(`[data-type=${taskType}]`).closest("section").querySelector("ul");
        
        taskList.forEach(function(task) {
            taskListElement.appendChild(createNewTaskElement(task));
        });
    }
}

//Deleting all task from DOM
function deletingAllTasks(){
    const allListsOfTasks = document.querySelectorAll("ul")
    for(let list of allListsOfTasks){
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
    }
}

//Refresh of all tasks in the DOM
function refreshTaskSection(){
    deletingAllTasks();
    generationTasklist()
    generationImportantTasksFromLocalStorage(importantTasksArray)
}



/*
*
*
Network
*
*
*/




/*
*
*
Storage
*
*
*/

function updateTasksInLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
  
  
function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem('tasks'));
}

function updateImportantTasksInLocalStorage(tasks) {
    localStorage.setItem('important', JSON.stringify(tasks));
}
  
  
function getImportantTasksFromStorage() {
    return JSON.parse(localStorage.getItem('important'));
}

//Changing task in task section in LocalStorage
function changingTaskInLocalStorage(task, newTask){
    const tasks = getTasksFromStorage();

    for(const [taskType, taskList] of Object.entries(tasks)){ 
        if(taskList.includes(task)){
            taskList[taskList.indexOf(task)] = validateTask(newTask);
        }
    }

    updateTasksInLocalStorage(tasks);
}

//Changing task in important section of LocalStorage
function changingImportantTask(task, newTask){
    const importantTasks = getImportantTasksFromStorage();
    if(importantTasks.includes(task)){ //Check if edited task was in important tasks and change it in the array
        importantTasks[importantTasks.indexOf(task)] = newTask;
        updateImportantTasksInLocalStorage(importantTasks)
    }
}



/*
*
*
Derictives
*
*
*/

//Check task format 
function validateTask(taskText) {
    if (typeof taskText === 'string' && taskText.length) {
      return taskText;
    }
    
    throw Error('Invalid Task');
}

//Displaying of loader element
function displayLoading(){
    loaderElement.classList.add("loader")
}

//Stop displaying of loading element
function hideLoading(){
    loaderElement.classList.remove("loader")
}

//Function that make task text editable and after unfocus saves changes
function dblclickEditTaskEvent(event){
    event.preventDefault();
    
    const targetElement = event.target
    makingEditable(targetElement);
}

//Function of event listener that addes new task to target list
function addTaskClickEvent(event) {
    const input = event.target.closest("section").querySelector("input")
    const taskType = event.target.dataset.type;

    updateTasks(input.value, taskType);
    input.value = "";
}




/*
*
*
Tasks
*
*
*/

function updateTasks(task, taskType){
   const currentTasks = getTasksFromStorage();

   currentTasks[taskType].unshift(validateTask(task));
   updateTasksInLocalStorage(currentTasks);

   refreshTaskSection(currentTasks);
}
 
function makingEditable(element){
    let valueOfItem = element.innerText
    element.setAttribute("contenteditable","true") //Making text editable
    savingChanges(element, valueOfItem)
}
 
function savingChanges(element, valueOfElement){
    element.addEventListener("blur", ()=>{ //Handler moment of click on other element
        try{
            changingTask(valueOfElement, element.innerText)
            element.setAttribute("contenteditable","false")
        } catch (e) {
            element.innerText = valueOfElement; //Return value that was 
            element.setAttribute("contenteditable","false")
            return;
        }
    })
}
 
function changingTask(task, newTask){
    changingTaskInLocalStorage(task, newTask)
    changingImportantTask(task, newTask);
}












//Removing of replaced task element from old localStorage section
function removeReplacingElement(elementValue){
    for(const section in localStorageObject){
        let propertyArray = localStorageObject[section]
        if(propertyArray.includes(elementValue)){
            const indexOfElement = propertyArray.indexOf(elementValue);
            propertyArray.splice(indexOfElement, 1)
        }
    }
}

//Using of Alt+1,2,3 to replace tast between sections
function replaceOfTask (event) {
    const targetElement = event.target.closest("li")
    window.onkeydown = function (event2) {
        if(!event2.code.includes("Digit")){//Check if key is number
            return
        }
        if(event2.altKey === false){ //Check altKEy
            return
        }
        const key = parseInt(event2.key)
        if(key>3){ //Check that key is exist
            return
        }

        let newParentElement; //PLace where I want to replace the task
        let newLocalStorageArray; //Updating localStorage
        switch(key){
            case 1:
                newParentElement = document.querySelector(".to-do-tasks")
                newLocalStorageArray = localStorageObject.todo
                break;
            case 2:
                newParentElement = document.querySelector(".in-progress-tasks")
                newLocalStorageArray = localStorageObject["in-progress"]
                break;
            case 3:
                newParentElement = document.querySelector(".done-tasks")
                newLocalStorageArray = localStorageObject.done
                break;
        }
        newParentElement.insertBefore(targetElement, newParentElement.childNodes[0]); //Added new task to the top of list
        removeReplacingElement(targetElement.innerText)
        newLocalStorageArray.unshift(targetElement.innerText)
        localStorage.tasks = JSON.stringify(localStorageObject)
        window.onkeydown = null;
    };
}



//Fucntion of search input that do refresh of all tasks and sort to you all tasks that include text from input area
function searchTasks(){
    const valueInInput = document.getElementById("search").value.toLowerCase()
    refreshTaskSection();
    const allTasks = document.querySelectorAll(".task")
    for(let task of allTasks){
        const taskValue = task.innerText.toLowerCase()
        if(!taskValue.includes(valueInInput)){
            task.parentElement.removeChild(task)
        }
    }
}


const TASKS_API_URI = 'https://json-bins.herokuapp.com/bin/6162f1049e72744bcfc40980';

async function request(method = '', data = null) {
    const options = {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };
  
    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(TASKS_API_URI, options);
    errorCatch(response);
    return response.json();
}
  
async function loadTasksFromApi() {
    const loaded = await request('GET', null);

    return loaded.tasks;
}
  
async function saveTasksToApi(tasks) {
    return request('PUT', {tasks});
}

function errorCatch(response){
    if(!response.ok){ // error part: behavior of all elements in error situation anf throw ERROR with current status
        alert("ERROR "+response.status+". "+response.statusText)//displaying in result element at error message
        throw `ERROR ${response.status}`
    }
}

//Fucntion of save tasks in API Storage
async function saveToStorage(){
    displayLoading();

    const tasks = getTasksFromStorage()
    await saveTasksToApi(tasks)
   
    hideLoading();
}

////Fucntion of loading tasks from API Storage if in localStorage we have other tasks function refreshes localStorage information to API information 
async function loadFromStorage(){
    displayLoading();

    const tasks = await loadTasksFromApi()
    updateTasksInLocalStorage(tasks);
    refreshTaskSection();

    hideLoading();
}

//Starting drag event
function dragEvent (event){
    draggingElement = event.target.closest("li")
    event.dataTransfer.setData("text", event.target.closest("ul").className);

    const sections = document.querySelectorAll("section") //Adding event listener to all sections
    for(let section of sections){
        section.addEventListener("dragover", allowDrop)
        section.addEventListener("drop", dropEvent)
    }
}

//Preparing to drop event
function allowDrop(event) {
    event.preventDefault();
}

//Finish of dragging, drop event
function dropEvent(event) {
    event.preventDefault();

    const previousParentClassName = event.dataTransfer.getData("text");
    const newSectionClass = event.target.closest("section").className
    const newParentList = event.target.closest("section").querySelector("ul")
    const valueOfDraggingElement = draggingElement.textContent;

    switch(newSectionClass){ //Check if I want to delete or replace task
        case "dropzone":
            newParentList.insertBefore(draggingElement, newParentList.childNodes[0]);
            removeReplacingElement(valueOfDraggingElement);
            let localStorageArray;
            switch(newParentList.className){
                case "in-progress-tasks":
                    localStorageArray = localStorageObject["in-progress"]
                    break;
                case "to-do-tasks":
                    localStorageArray = localStorageObject["todo"]
                    break;
                case "done-tasks":
                    localStorageArray = localStorageObject["done"]
                    break;
            }
            localStorageArray.unshift(valueOfDraggingElement)
            localStorage.tasks = JSON.stringify(localStorageObject)
            break;
        case "removezone":
            document.querySelector(`.${previousParentClassName}`).removeChild(draggingElement);
            removeReplacingElement(valueOfDraggingElement);

            if(importantTasksArray.includes(valueOfDraggingElement)){ //Deleting from importantTasksArray deleted tasks
                importantTasksArray.splice(importantTasksArray.indexOf(valueOfDraggingElement), 1)
                localStorage.important = JSON.stringify(importantTasksArray)
            }

            localStorage.tasks = JSON.stringify(localStorageObject)
            break;
    }
}

//Event listener of click on important icon that use toggle(to add or to remove indication)
function toggleToImportantTasks(event){
    const target = event.target;
    const task = target.closest("li").firstChild.innerText
    if(target.closest("li").className.includes("important")){
        target.closest("li").classList.remove("important")
        importantTasksArray.splice(importantTasksArray.indexOf(task), 1);
        localStorage.important = JSON.stringify(importantTasksArray)
    } else {
        target.closest("li").classList.add("important")
        importantTasksArray.unshift(task)
        localStorage.important = JSON.stringify(importantTasksArray)
    }
    
}

//Function that check all existing tasks if them important tasks
function generationImportantTasksFromLocalStorage(importantTasksArray){
    const allTasksElements = document.querySelectorAll("li")
    for(const task of allTasksElements){
        for(const importantTask of importantTasksArray){
            if(task.firstChild.innerText === importantTask){
                task.classList.add("important")
            }
        }
    }
}


let draggingElement;

const loaderElement = document.querySelector("#loader")

let localStorageObject = {
    "todo":[],
    "in-progress":[],
    "done":[],
}



let importantTasksArray = [];

if(localStorage.getItem("tasks") === null){
    localStorage.setItem("important","")
    localStorage.setItem("tasks","");
    localStorage.important = JSON.stringify(importantTasksArray)
    localStorage.tasks = JSON.stringify(localStorageObject);
} else {
    importantTasksArray = JSON.parse(localStorage.getItem("important"));
    localStorageObject = JSON.parse(localStorage.getItem("tasks"));
    generationTasklist();
    generationImportantTasksFromLocalStorage(importantTasksArray)
}

const addButtons=document.querySelectorAll(".add-button")
for(const button of addButtons){
    button.addEventListener("click", addTaskClickEvent)
}
document.getElementById("search").addEventListener("input", searchTasks)
document.getElementById("save-btn").addEventListener("click", saveToStorage)
document.getElementById("load-btn").addEventListener("click", loadFromStorage)

