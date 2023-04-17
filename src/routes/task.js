const express = require('express');
const checklistDepedentRoute = express.Router();
const simpleRouter = express.Router();
const Checklist = require('../models/checklist');
const Task = require('../models/task');

checklistDepedentRoute.get('/:id/tasks/new', async (req, res) => {
    try {
        let task = new Task();
        res.status(200).render('tasks/new', { checklistId: req.params.id, task: task});
    } catch (e) {
        res.status(422).render('pages/error', { error: 'Erro ao carregar o formulário', en: e});
    }
});

simpleRouter.delete('/:id', async(req, res) => {
    try {
        let task = await Task.findByIdAndDelete(req.params.id);
        let checklist = await Checklist.findById(task.checklist);
        let taskToRemove = checklist.tasks.indexOf(task._id);
        checklist.tasks.splice(taskToRemove, 1);
        checklist.save();
        res.redirect(`/checklists/${checklist._id}`);
    } catch (e) {
        res.status(422).render('pages/error', { error: 'Erro ao remover uma tarefa', en: e});
    }
});

checklistDepedentRoute.post('/:id/tasks', async (req, res) => {
    let { name } = req.body.task;
    let task = new Task({ name, checklist: req.params.id });
    try {
        await task.save();
        let checklistId = await Checklist.findById(req.params.id);
        checklistId.tasks.push(task);
        await checklistId.save();
        res.redirect(`/checklists/${req.params.id}`);
    } catch (e) {
        let errors = error.errors;
        res.status(422).render('pages/error', { error: 'Erro ao carregar o formulário', en: e});
    }
})

simpleRouter.put('/:id', async (req, res) => {
    let task = await Task.findById(req.params.id);
    try {
        task.set(req.body.task);
        await task.save();
        res.status(200).json({ task });
    } catch (e) {
        let errors = e.errors;
        res.status(422).json({ task: {...errors}});
    }
});

module.exports = {
    checklistDepent: checklistDepedentRoute,
    simple: simpleRouter
}