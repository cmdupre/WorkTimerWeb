'use strict'

function storeTasks(content = null) {
    const tasks = [];
    const children = content?.getElementsByClassName('task');
    for (const child of children) {
        child.task.setDescription(child.getElementsByClassName('description')[0].value);
        tasks.push(child.task.toObject());
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

export default (() => {
    return {
        storeTasks,
        getTaskItems: () => JSON.parse(localStorage.getItem('tasks') || '[]'),
    }
})();