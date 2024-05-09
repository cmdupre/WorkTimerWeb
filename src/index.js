'use strict'

import taskFactory from "./taskFactory";
import dom from "./dom";
import storage from "./storage";

function restoreTasks() {
    dom.disableRestoreButton(restoreTasks);
    for (const item of storage.getTaskItems()) {
        const task = taskFactory.createFromObject(item);
        startNewTask(null, task);
    }
}

function toggleTimer(e) {
    if (e.target.textContent === 'Stop') {
        e.target.parentElement.task.stop();
        e.target.textContent = 'Start';
        e.target.classList.remove('stop');
        e.target.classList.add('start');
    }
    else {
        stopTasks();
        e.target.parentElement.task.start();
        e.target.textContent = 'Stop';
        e.target.classList.remove('start');
        e.target.classList.add('stop');
    }
    storage.storeTasks(dom.getDiv());
}

function discardTask(e) {
    // todo: ensure all event listeners are deleted
    delete e.target.parentElement.task;
    e.target.parentElement.parentElement.removeChild(e.target.parentElement);
    storage.storeTasks(dom.getDiv());
}

function stopTasks() {
    const children = dom.getDiv().children;
    for (const child of children) {
        if (child.task === undefined) {
            continue;
        }
        stopTask(child);
    }
}

function stopTask(element) {
    element.getElementsByClassName('timer')[0].textContent = 'Start';
    element.getElementsByClassName('timer')[0].classList.remove('stop');
    element.getElementsByClassName('timer')[0].classList.add('start');
    element.task.stop();
}

function startNewTask(e, task = null) {
    // task === null signifies call from new task event
    // instead of from restore function.
    if (task === null) {
        dom.disableRestoreButton(restoreTasks);
        stopTasks();
    }

    const parms = {
        task,
        toggleTimer,
        discardTask,
        stopTask,
    }

    const newTask = dom.createNewTask(parms);

    if (task === null) {
        newTask.task = taskFactory.create();
        newTask.task.start();
        storage.storeTasks(dom.getDiv());
    }
    else {
        newTask.task = task;
        newTask.description.value = newTask.task.getDescription();
    }
}

dom.createStartButton(startNewTask);
dom.createRestoreButton(restoreTasks);
dom.createTotalizer();

setInterval(dom.updateRuntimes, 500);
setInterval(dom.updateTotalizer, 500);
