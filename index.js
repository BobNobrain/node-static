const static = require('serve-static');
const finalhandler = require('finalhandler');
const http = require('http');

const config = require('./config.js');

const setPort = s =>
{
	let port = +s;
	if (!Number.isNaN(port))
	{
		config.port = port;
	}
};
const setDir = s =>
{
	// TODO: some checks?
	config.directory = s;
};

const processArgs = (acc, item) =>
{
	if (item === '-p')
		return '-p';
	if (acc === '-p')
	{
		// argument is port
		setPort(item);
	}
	else
	{
		setDir(item);
	}
};

if (process.argv.length > 1)
{
	if (process.argv[1] === '--help')
	{
		console.log('Usage: node index.js [<dir>] [-p <port>]');
		process.exit(0);
	}
	process.argv.slice(1).reduce(processArgs, null);
}

const serve = static(config.directory, { 'index': [ 'index.html', 'index.htm' ] });
const server = http.createServer(function onRequest(req, res)
{
	console.log(`${req.method} ${req.url}`);
	serve(req, res, finalhandler(req, res));
});
server.on('listening', function ()
{
	console.log(server.address());
	console.log(`Starting static server for '${config.directory}' at ${server.address().address}:${config.port}`);
});
server.listen(config.port);
