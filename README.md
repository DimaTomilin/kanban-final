# Kanban Final Project

## What i will build

Welcome to my pre-course final project. I am going to build a task-management application. Why I decide do this, because I think that in your intensive live very important to write all-days tasks nad have some plan what I go to do today. Sometime I forgot very important things and after that feld very uncomfortable and guilty of that. So i decided that I need to write all my day task and have opportunity to manage it. In this way i thinked of this project nad started to work.


### Page Structure

It is 3 `section` elements. One for to-do tasks, one for in-progress tasks, and one for done tasks.

Each `section`  contain:

- [ ] a `ul` element that contain task elements, which are `li` elements.
- [ ] an `input` element allow me to write and add new tasks
- [ ] a `button` element that saved information from inout area to tha `ul`

Also page contain:

- [ ] a heading
- [ ] a global input with allow to search specefic named functions
- [ ] a section with `removezone` class that allow to us delete unneeded tasks
- [ ] and buttons of `load-btn` and `save-btn` that helps to me save and load information(tasks) from API Storage

### Interaction

- [ ] When the user clicks on one of the add-task buttons, a new task  added to the respective list. The task content taken from the respective input field.(! Trying to submit empty tasks cause an alert.)
- [ ] Double clicking a task element enable the user to edit its text. When the task element loses focus (`blur` event) the change saved. It doesn`t allow to save empty task and will cause an alert message.
- [ ] Hovering over a task element and pressing `alt + 1-3`  move the task to the appropriate list (`1`: todo, `2`: in-progress, `3`: done).
- [ ] All `li` elements also contains star icon that you can to click on it. In this way you can to add this task to important tasks.(! This futcher works only with localStorage so button of `load-btn` and `save-btn` will cause to same bags(i will improve it later))
- [ ] The search input filter tasks case-**in**sensitively, so that only tasks that match the search string are displayed. The filter reapplied every time the user changes the content of the search input (on **every keystroke**).
- [ ] User can use drag and drop to replace tasks all of you need to do: `mousedown` to drag element, after that you can move it to any section all section where you can to drop it have some indication, when you want to drop and finish replacing release `mousedown`(`mouseup` event) and your task will be replaced.
- [ ] If you want to remove some task you can do drag and drop to bin section it will be removed.

### Storage

- [ ] The data of all the tasks saved to `localStorage` following any changes made to the data. The data saved under a storage key named `tasks`. 
- [ ] The data about important tasks also saved to `localStorage` under a storage key named `important`
- [ ] Also I have API Storage that you can save all the tasks with `save-btn` and load information from this resource with `load-btn`. It is important that API Storage Information more important so it will update all information in `localStorage`

##
So I hope that you will get plaeasure from my website and it will help you to manage your time more effectively. If you find some bags or you see that something dond`t work correctly you have some ideas how to improve my website.
My Gmail: tomilin.dimon@gmail.com
Thank you for attention!