/* eslint-disable no-console */
const express = require('express')
const request = require('request')
const path = require('path')
const http = require('http')
const fs = require('fs-extra')
const PROJECT_CONSTANTS = require('../../project.constants')

const app = express()


app.set('port', process.env.SERVER_PORT)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(express.static(PROJECT_CONSTANTS.PATH_BASE_DIR))

app.route('/favicon.ico')
	.get((req, res) => {
		res.end()
	})

const pageRouter = (req, res) => {
	res.render('main', {
		env: process.env.NODE_ENV,
		buildHash: process.env.BUILD_HASH,
		PROJECT_CONSTANTS,
	})
}

app.route('/(:route)?').get(pageRouter)
app.use(`${PROJECT_CONSTANTS.BE_PROXY_PREFIX}/`, (req, res) => {
	const deployConfig = fs.readJSONFileSync(path.join(__dirname, 'deployConfigs', `${process.env.DEPLOY_CONFIG}.json`))

	let url = deployConfig && deployConfig.oysterApi || 'http://api.oyster.jemelik.eu'
	url += req.originalUrl.substring(PROJECT_CONSTANTS.BE_PROXY_PREFIX.length)

	console.log('[BE PROXY]', url)
	req.pipe(request(url)).pipe(res)
})

http.createServer(app).listen(app.get('port'), () => {
	console.log(`[EXPRESS] Server listening on port ${app.get('port')}`)
})
