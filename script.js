const list = document.querySelector('.todo-list-1');
const completedList = document.querySelector('.completed-todolist');
// let listItems = list.children;
// let completedItems = completedList.children;
let todoList = document.getElementById('todolist');

let items = [];

// let startItems = [{
//     id: 0,
//     state: false,
//     text: 'hey yall',
// },
// {
//     id: 1,
//     state: true,
//     text: 'well well well what do we have here',
// }
// ];

window.onload = function () {

    let toDoList = localStorage.getItem('todolist');

    if (toDoList != null) {
        items = JSON.parse(toDoList);
    }

    for (let i = 0; i < items.length; i++) {
        createItem(items[i]);
    }

    addNewItem();
    calculatePercent();
    deleteEverything();
}

// create new item

let createItem = function (taskDetail) {
    let taskTemplate = document.querySelector('#list-template').content;
    let newItemTemplate = taskTemplate.querySelector('.list-item');
    let task = newItemTemplate.cloneNode(true);
    let taskDescription = task.querySelector('span');
    let checkbox = task.querySelector('.todo-list-input');
    task.dataset.id = taskDetail.id;
    let taskText = taskDetail.text;
    taskDescription.textContent = taskText;

    removeItem(task);
    addCheckHandler(task);

    if (taskDetail.state) {
        checkbox.checked = true;
        completedList.appendChild(task);
    } else {
        list.appendChild(task);
    }
    
    toggleMessages();
    editItem(task);
};

// add new item

let addNewItem = function () {
    let newItem = document.querySelector('.item-form');
    let newItemContent = document.querySelector('.input-form');

    newItem.addEventListener('submit', function(evt) {
        evt.preventDefault();

        let newItemDetail = {
            id: new Date().getTime(),
            state: 0,
            text: newItemContent.value
        };

        items.push(newItemDetail);
        console.log(items, "items")
        createItem(newItemDetail);
        localStorage.setItem('todolist', JSON.stringify(items));
        newItemContent.value = '';
        calculatePercent();
});
}


// show empty messages - in progress and completed

let toggleEmptyTodoList = function () {
    let emptyListMessage = document.querySelector('.todo-list-empty');
    let isEmpty = true;

    for (let i = 0; i < items.length; i++) {
        if (!items[i].state) {
            isEmpty = false;
            break;
        }
    }

    if (isEmpty) {
        emptyListMessage.classList.remove('hidden');
    } else {
        emptyListMessage.classList.add('hidden');
    }
};

let toggleEmptyCompletedList = function () {
    let emptyListCompleted = document.querySelector('.compeleted-list-empty');
    let isEmpty = true;

    for (let i = 0; i < items.length; i++) {
        if (items[i].state) {
            isEmpty = false;
            break;
        }
    }

    if (isEmpty) {
        emptyListCompleted.classList.remove('hidden');
    } else {
        emptyListCompleted.classList.add('hidden');
    }
};

let toggleMessages = function () {
    toggleEmptyTodoList();
    toggleEmptyCompletedList();
}

// move items up and down

let addCheckHandler = function (item) {
    let checkbox = item.querySelector('.todo-list-input');
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            item.remove();
            completedList.appendChild(checkbox.parentNode);
        } else {
            item.remove();
            list.appendChild(checkbox.parentNode);
        }

        let taskId = item.dataset.id;

        for (let i = 0; i < items.length; i++) {
            if (items[i].id == taskId) {
                items[i].state = checkbox.checked ? 1 : 0;
            }
        }

        localStorage.setItem('todolist', JSON.stringify(items));

        calculatePercent();

        toggleMessages();
});
}


// remove items

let removeItem = function (item) {
    let deleteImg = item.querySelector('.todo-list-img-close');
    deleteImg.addEventListener('click', function () {
        let taskId = item.dataset.id;

        for (let i = 0; i < items.length; i++) {
            let chosenItem = items[i];

            if (chosenItem.id == taskId) {
                items.splice(i, 1);
                i--;
            }
        }

        item.remove();
        localStorage.setItem('todolist', JSON.stringify(items));
        toggleMessages();
        calculatePercent();
    });
};

// edit items

let editItem = function (item) {
    let editArea = document.createElement("input");
    editArea.type = "text";

    let taskDescription = item.querySelector('span');
    let taskText = taskDescription.textContent;
    editArea.value = taskText;

    item.addEventListener('dblclick', function () {
        taskDescription.replaceWith(editArea);
    });

    editArea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            taskText = editArea.value;
            taskDescription.textContent = taskText;
            editArea.replaceWith(taskDescription);
            let taskId = item.dataset.id; 

            for (let i = 0; i < items.length; i++) {
                if (items[i].id == taskId) {
                    items[i].text = taskText;
                }
            }
        } else if (e.keyCode === 27) {
            e.preventDefault();

            editArea.replaceWith(taskDescription);
            editArea.value = taskText;
            
        }

        localStorage.setItem('todolist', JSON.stringify(items));
    });
}



// progress bars

let calculatePercent = function () {
    let progressBarTodo = document.getElementById("progressbar-todo");
    let progressBarCompleted = document.getElementById("progressbar-completed");
    let currentProgress = 0;
    let itemsCount = items.length;
    let itemPercent = 100 / itemsCount;

    for (let i = 0; i < items.length; i++) {
        if (items[i].state === 1) {
            currentProgress += itemPercent;
        }
    };

    progressBarTodo.value = currentProgress;
    progressBarCompleted.value = currentProgress;
}

// deleting items

let deleteEverything = function() {
    let deleteButton = document.querySelector('.delete-img');
    deleteButton.addEventListener('click', function (e) {

        let todoList = document.getElementById('todolist');
        let completedList = document.getElementById("completedlist");

        items = [];

        todoList.innerHTML = '';
        completedList.innerHTML = '';

        localStorage.setItem('todolist', JSON.stringify(items));
        calculatePercent();
        toggleMessages();
    })
}





// // loop for ids

// for (let i = 0; i < listItems.length; i++) {
//     addCheckHandler(listItems[i])
//     listItems[i].setAttribute("id", Date.now() + i);
//     id.push(listItems[i].id) 
// }


