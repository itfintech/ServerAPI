const config = require('./config.json');
const chalk = require('chalk');
const exec = require('child_process').exec;
const fastify = require('fastify')({ logger: false });

fastify.post('/api/ping/:ip', function (request, reply) {
  authAction(request.ip);
  let n = 3;
  if (request.query.n) {
    if (request.query.n < 1) {
      reply.code(400);
      throw new Error();
    }
    n = request.query.n;
  }
  var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (!request.params.ip.match(ipformat)) {
    reply.code(400);
    throw new Error();
  }
  cliMsg(`${request.params.ip} ping`);
  exec(`ping -n ${n} ${request.params.ip}`, (error, stdout, stderr) => { reply.send(stdout) });
});

function cliMsg(msg, type) {
  if (type !== 1) {
    console.log(chalk.black.bgWhite("server-api") + " " + msg)
  } else {
    console.log(chalk.black.bgWhite("server-api") + " " + chalk.white.bgRed.bold(msg))
  }
}

function authAction(ip) {
  if (config.allowedHosts.includes(ip)) {
    return true;
  }
  if (config.allowedHosts.includes("*")) {
    return true;
  }
  cliMsg(`${ip} denied access, please note this activity.`);
  return false;
}

fastify.listen(config.listen.port, config.listen.host, err => {
  if (err) throw err;
  cliMsg(`Now listening on ${config.listen.host}:${fastify.server.address().port}`)
});