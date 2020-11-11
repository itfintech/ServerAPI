const config = require('./config.json');
const chalk = require('chalk');
const exec = require('child_process').exec;
const fastify = require('fastify')({ logger: false });
const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const win32 = 'win32';
const linux = 'linux';

fastify.post('/api/ping/:ip', function (request, reply) {
  authAction(request.ip);
  let n = 3;
  if (request.query.n) {
    n = checkEchoRequestsCount(request.query.n, reply);
  }
  const ip = request.params.ip;
  validateIp(ip, reply);
  cliMsg(`${ip} ping`);

  const platform = process.platform;
  if (platform === win32) {
    exec(`ping -n ${n} -w 1000 ${ip}`, (error, stdout, stderr) => { reply.send(stdout) });
  } else if (platform === linux) {
    exec(`ping -O ${ip} -W 1 -c ${parseInt(n) + 1}`, (error, stdout, stderr) => { reply.send(stdout) });
  }
});

checkEchoRequestsCount = (n, reply) => {
  if (n < 1 || n > 100) {
    reply.code(400);
    throw new Error();
  }
  return n;
}

validateIp = (ip, reply) => {
  var ipformat = ipRegex;
  if (!ip.match(ipformat)) {
    reply.code(400);
    throw new Error();
  }
}

cliMsg = (msg, type) => {
  if (type !== 1) {
    console.log(chalk.black.bgWhite("server-api") + " " + msg)
  } else {
    console.log(chalk.black.bgWhite("server-api") + " " + chalk.white.bgRed.bold(msg))
  }
}

authAction = (ip) => {
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