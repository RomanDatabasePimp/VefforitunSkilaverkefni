/* Requires START */
const express = require('express');
const path = require('path');
/* Requires END */

/* Variables init START */
const app = express();

const hostname = '127.0.0.1';
const port = 3000;
/* Variables init END */

/* Tengjum css skjali við */
app.use(express.static(path.join(__dirname, 'public')));

/* Tengja views möppu og viljum sjá .ejs skjöl */
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
  res.status(500).render('notfound', { title: '500' ,headder: 'Villa'});
}

app.use(notFoundHandler);
app.use(errorHandler);



app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
/* ----------------------------------------------------------------------------------------------------------------- */
const util = require('util');
const fs = require('fs');
const parser = require('markdown-parse');

const readNamesAsync = util.promisify(fs.readdir);
const readFileAsync = util.promisify(fs.readFile);


function ReadFilesNamesAsync(FolderLoc) {
  return readNamesAsync(FolderLoc)
}
function GetMdFiles(FileNames){
  const tempArr = [];
  FileNames.forEach(item => { if(item.substr(item.length-3,item.length) == '.md'){tempArr.push(item);}})
  return tempArr;
}
function ReadFilesAsync(NameOfFile){
  return readFileAsync('articles/'+NameOfFile)
}

async function GetFiles(FileToBeRead){
  
}
ReadFilesNamesAsync('articles').then(FileNames => { 
  GetMdFiles(FileNames).forEach(item => {
    ReadFilesAsync(item).then(data => {

    });
  })
})


/*
          console.log('the front matter:')
          console.dir(result.attributes)
          console.log('the html:')
          console.log(result.html)
          .forEach(item => { 
      ReadFilesAsync(item)
      .then(data => {
        parser(data.toString('utf8'),(err, result) => {
          temp.push("h");
        })
      })
    
    })
          
          
          */
