 
    const { ObjectId } = require('mongodb');
        const db = require('../connection');

        const getAllHistorys = async function (req, res) {
        let data = await db.get().collection('historys').find().toArray()
        res.render('pages/allhistorys',{data});
        }

        const getHistoryAddform = async function (req, res) {
        res.render('forms/addhistory');
        }

        const addHistory = async function (req, res) {
        let data = req.body
        await db.get().collection('historys').insertOne(data)
        res.render('pages/history', { data })
        }

        const getHistoryEditform = async function (req, res) {
        let id = req.params.id
        let data = await db.get().collection('historys').findOne({ _id: ObjectId(id) })
        res.render('forms/edithistory', { data });
        }

        const editHistory = async function (req, res) {
        let newdata = req.body
        let query = { _id: ObjectId(req.body.id) }
        var newvalues = { $set: { name: newdata.name,} };
        await db.get().collection('historys').updateOne(query, newvalues)
        res.redirect(`/historys/${req.body.id}`)
        }

        const deleteHistory = async function (req, res) {
        let id = req.params.id
        await db.get().collection('historys').deleteOne({ _id: ObjectId(id) })
        res.redirect('back')
        }

        const getHistoryById = async function (req, res) {
        let id = req.params.id
        let data = await db.get().collection('historys').findOne({ _id: ObjectId(id) })
        res.render('pages/history', { data });
        }

        exports.getAllHistorys = getAllHistorys;
        exports.getHistoryAddform = getHistoryAddform;
        exports.addHistory = addHistory;
        exports.getHistoryEditform = getHistoryEditform;
        exports.editHistory = editHistory;
        exports.deleteHistory = deleteHistory;
        exports.getHistoryById = getHistoryById;
    