/* Requires START */
const express = require('express');
const path = require('path');
/* Requires END */

/* Variables init START */
const app = express();

const hostname = '127.0.0.1';
const port = 3000;
/* Variables init END */
/* Tengja Css skjal(i/um) */
app.use(express.static(path.join(__dirname, 'public')));
/* Tengja views */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* Default fyrir fyrir heimasiðu er byrt index */
app.get('/', (req, res) => {
  res.render('index', { title: 'Forsíða' ,headder: 'Greinasafnið'});
});
/* Til að henda fólk i villu */
app.get('/error', (req, res) => {
  res.render('error', { title: 'Villa' ,headder: 'Villa kom upp'});
});
/* Ef eitthvað er ekki til */
function notFoundHandler(req, res, next) {
  res.status(404).render('notfound', { title: '404' ,headder: 'Fanst ekki'});
}

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).send('Villa!');
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
