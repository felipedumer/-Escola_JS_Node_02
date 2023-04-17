const setTagAsDone = async (element, id) => {
    event.preventDefault();
    try {
        let headers = new Headers({ 'Content-Type' : 'application/json'});
        let body = JSON.stringify({ task: {done : element.checked }});
        let response = await fetch(`/tasks/${id}?_method=put`, { headers: headers, body , method: 'PUT'});
        let data = await response.json();
        let task = data.task;
        let parent = element.parentNode;

        if(task.done) {
            element.checked = true;
            parent.classList.add('has-text-success');
            parent.classList.add('has-italic');
;        } else {
            parent.classList.remove('has-text-success');
            parent.classList.remove('has-italic');
        }
    } catch (e) {
        alert('Erro ao atualizar a tarefa');
    }
}