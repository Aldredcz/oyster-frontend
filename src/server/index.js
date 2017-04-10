const express = require('express')
const request = require('request')
const path = require('path')
const http = require('http')
const fs = require('fs-extra')
const PROJECT_CONSTANTS = require('../../project.constants')

const app = express()

const isDev = process.env.NODE_ENV === 'development'
const __root = path.join(__dirname, '..', '..')


app.set('port', PROJECT_CONSTANTS.EXPRESS_SERVER_PORT)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(express.static(__root))

app.route('/favicon.ico')
	.get((req, res) => {
		res.end()
	})

const pageRouter = (req, res) => {
	res.render('main', {
		env: process.env.NODE_ENV,
		PROJECT_CONSTANTS,
	})
}

app.route('/(:route)?').get(pageRouter)
app.use(`${PROJECT_CONSTANTS.BE_PROXY_PREFIX}/`, (req, res) => {
	const url = `http://api.oyster.jemelik.eu${req.originalUrl.substring(PROJECT_CONSTANTS.BE_PROXY_PREFIX.length)}`
	console.log('[BE PROXY]', url)
	req.pipe(request(url)).pipe(res)
})

http.createServer(app).listen(app.get('port'), () => {
	console.log(`[EXPRESS] Server listening on port ${app.get('port')}`)
})
