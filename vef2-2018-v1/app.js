/* -------------------------- REQUIRES START -------------------------- */
const express = require('express');
const path = require('path');
const router = require('./articles');
/* -------------------------- REQUIRES END --------------------------  */

/* ------------------------ Variables init START ----------------------- */
const app = express();

const hostname = '127.0.0.1';
const port = 3000;
/* ------------------------ Variables init END ----------------------- */

/* ------------------------- Styllingar START------------------------- */

/* Banna til að opna .md skrár */
app.all('/*.md', (req, res, next) => {
  res.status(403).res.status(404).render('error', { title: 'Villa', headder: 'Fannst ekki', content: '<main><div class="error"><h3 class="error__text"> Ó nei efnið fanst ekki! </h3><a class="error__refferal" href="../">Til baka</a></div></main>' });
  next();
});

/* Tengja css skjali */
app.use(express.static(path.join(__dirname, 'public')));

/* Tengja articles skjal svo hægt að ná i myndir */
app.use(express.static(path.join(__dirname, 'articles')));

/* Tengja views möppu og nota sjá .ejs skjöl */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* ------------------------- Styllingar END------------------------- */
function notFoundHandler(req, res, next) {
  res.status(404).render('error', { title: 'Villa', headder: 'Fannst ekki', content: '<main><div class="error"><h3 class="error__text"> Ó nei efnið fanst ekki! </h3><a class="error__refferal" href="../">Til baka</a></div></main>' });
  next();
}

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).render('error', { title: 'Villa', headder: 'Villa kom up', content: '<main><div class="error"><a class="error__refferal" href="../">Til baka</a></div></main>' });
  next();
}

/* Notum routerinn og villu meðhölun */
app.use('/', router);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, hostname, () => {
  // console.log(`Server running at http://${hostname}:${port}/`);
});
