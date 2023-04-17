const express = require('express');
const router = express.Router();
const Checklist = require('../models/checklist');
const Task = require('../models/task');

router.get('/', async (req, res) => {
    let { name } = req.body;

    try {
        let checklist = await Checklist.find({});
        res.status(200).render('checklists/index', { checklists: checklist});
    } catch (e) {
        res.status(422).render('pages/error/index', { error: 'Erro ao exibir listas'});
    }
});

router.post('/', async (req, res) => {
    let { name } = req.body.checklist;
    let checklist = new Checklist({name})

    try {
        await checklist.save();
        res.redirect('/checklists');
    } catch (e) {
        res.status(422).render('checklists/new', {checklists: {...checklist, error}});
    }
});

router.get('/new', async (req, res) => {
    try {
        let checklist = new Checklist();
        res.status(200).render('checklists/new', { checklistn: checklist});
    } catch (e) {
        res.status(500).render('pages/error/index', { error: 'Erro ao exibir listas'});
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id);
        res.status(200).render('checklists/edit', { checklist: checklist});
    } catch (e) {
        res.status(500).render('pages/error/index', { error: 'Erro ao exibir listas'});
    }
});

router.get('/:id', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id).populate('tasks');
        res.status(200).render('checklists/show', { checklists: checklist});
    } catch (e) {
        res.status(422).render('pages/error/index', { error: 'Erro ao exibir listas'});
    }
});

router.put('/:id', async (req, res) => {
    let { name } = req.body.checklist;
    let checklist = await Checklist.findById(req.params.id);

    try {
        await checklist.update({name});
        res.redirect('/checklists');
    } catch (e) {
        let erros = e.errors;
        res.status(422).render('checklists/edit', {checklist: {...checklist, erros}});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let checklist = await Checklist.findByIdAndDelete(req.params.id);
        for (let i in checklist.tasks) {
            let tasks = await Task.findByIdAndDelete(checklist.tasks[i]);
        }
        res.redirect('/checklists');
    } catch (e) {
        res.status(500).render('pages/error', {error: 'Erro ao deletar a lista de tarefas', en: e});
    }
});

module.exports = router;