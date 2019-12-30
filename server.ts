import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as cookieParser from 'cookie-parser';
import { readFileSync } from 'fs';
import * as express from 'express';
import { join } from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();
const PORTssl = 443;
const PORT = process.env.PORT || 80;
const DIST_FOLDER = join(process.cwd(), 'dist');

const fs = require('fs');
const https = require('https');
const http = require('http');
const keys_dir = '/etc/letsencrypt/live/SSL/';
const server_options = {
  key: fs.readFileSync(keys_dir + 'privkey.pem'),
  ca: fs.readFileSync(keys_dir + 'chain.pem'),
  cert: fs.readFileSync(keys_dir + 'cert.pem')
};

// Our index.html we'll use as our template
const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

app.use(cookieParser('hpDWTicMrv')); // token secreto quando se usa secure:true nos cookies
// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// TODO: implement data requests securely
// app.get('/api/*', (req, res) => {
//   res.status(404).send('data requests are not supported');
// });

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

app.all('*', ensureSecure); // at top of routing calls

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  global['window'] = global;
  global['document'] = template;
  global['navigator'] = req['headers']['user-agent'];
  global['CSS'] = null;
  res.render('index', { req });
});

https.createServer(server_options, app).listen(PORTssl, () => {
  console.log(`Node Express server listening on http://localhost:${PORTssl}`);
});

http.createServer(app).listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});

function ensureSecure(req, res, next) {
  if (req.secure) {
    return next();
  }
  res.redirect('https://' + req.hostname + req.url); // express 4.x
}
