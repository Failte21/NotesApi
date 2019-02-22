const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const co = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE
})

const handleResponse = response => (err, result) => {
	if (err) {
		response.status(500).send(err)
	} else {
		response.send(result)
	}
}

const retrieveAllNotes = co => (req, response) => {
	queryStr = 'SELECT * from notes'
	co.query(queryStr, handleResponse(response))
}

const addNote = co => (req, response) => {
	const { title, description, date } = req.body
	//TODO: check informations 
	queryStr = `INSERT INTO notes (title, description, date) VALUES ('${title}', '${description}', '${date}')`
	co.query(queryStr, handleResponse(response))
}

const deleteNote = co => (req, response) => {
	const { title } = req.body //TODO: change to url params
	//TODO: check informations 
	queryStr = `DELETE FROM notes WHERE title = '${title}'`
	co.query(queryStr, handleResponse(response))
}

const updateNote = co => (req, response) => {
	const { title } = req.body.note //TODO: change to url params
	const { title: newTitle, description, date } = req.body.newInfos
	//TODO: check informations 
	//TODO: make sure missing informations are not updated with undefined
	queryStr = `UPDATE FROM notes SET title = '${newTitle}', description = '${description}', date='${date}' WHERE title = '${title}'`
	co.query(queryStr, handleResponse(response))
}

co.connect(err => {
	if (err) throw(err)
	app.get('/notes', retrieveAllNotes(co))
	app.post('/notes', addNote(co))
	app.delete('/notes', deleteNote(co))
	app.put('/notes', updadeNote(co))
	app.listen(3000)
})
