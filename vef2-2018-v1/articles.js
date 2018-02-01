/* Brjóta verkefni niður
 * 1) setja shit upp
 *  1.1) setja upp Node og npm
 *  1.2) sækja github frá honum óla
 *
 * 2) Undirbúa gögn
 *  2.1) Lesa innihald articles möppunar
 *  2.2) vinna úr hverja skrá úr sig (fá js hlut)
 *
 * 3) ákveða uppbygginguna
 *  3.1) skilgreina routes
 *    3.1.1) Rót
 *    3.1.2) fyrir hverja grein
 *    3.1.3) fyror hverja villu (404,500)
 *
 * 4) skrifa templets .ejs
 *
 * 5) skrifa css fyrir þetta
 */

/* -------------------------- REQUIRES START --------------------------  */

const util = require('util');
const fs = require('fs');
const parser = require('markdown-parse');
const express = require('express');
const IPS = require('img-placeholder-src');

const router = express.Router();

/* -------------------------- REQUIRES END ---------------------------  */

/* -------------------------- Variables START --------------------------  */
const readNamesAsync = util.promisify(fs.readdir);
const readFileAsync = util.promisify(fs.readFile);

/* By til placeholder mynd fyrir þau articles sem eru ekki með myndir */
const imageData = {
  height: 795,
  width: 1200,
  background: 666,
  text: ' ',
};
const ips = new IPS();
const srcset = ips.src(imageData, 'placeholdit');

/* -------------------------- Variables END --------------------------  */

/* Notkun = ReadFilesAsync(NameOfFile)
   Fyrir  = NameOfFile er strengur sem er nafn af skrá i articles möppu
   Eftir  = Skilar loforði að skila innihald skrár  NameOfFile */
async function ReadFilesAsync(NameOfFile) {
  const files = await readFileAsync(`articles/${NameOfFile}`).catch((err) => { throw new Error(err); });
  return files;
}

/* Notkun : GetMdFiles(FileNames)
   Fyrir  : FileNames er fylki af strengjum
   Eftir  : skilar tempArr sem eru strengir sem hafa ".md" endinguna */
function GetMdFiles(FileNames) {
  const tempArr = [];
  FileNames.forEach((item) => {
    if (item.substr(item.length - 3, item.length) === '.md') {
      tempArr.push(item);
    }
  });
  return tempArr;
}

/* Notkun : SlugToHtml(files)
   Fyrir  : files listi af strengjum á yaml og markdown formi
   Eftir  : tempArr þar sem bendill er slug á fylki á formi [title,html] */
function SlugToHtml(files) {
  const tempArr = [];
  files.forEach((item) => {
    parser(item.toString('utf8'), (err, result) => {
      tempArr[result.attributes.slug] = [result.attributes.title, result.html];
    });
  });
  return tempArr;
}

/* Notkun = GetFiles(FileToBeRead)
   Fyrir  = FileToBeRead er strengur sem er slóð á möppu
   Eftir  = skilar loforðafylki af skráum sem á að lesa */
async function GetFiles(FileToBeRead) {
  const files = await readNamesAsync(FileToBeRead).then(ReadFiles => GetMdFiles(ReadFiles));
  const promiseArr = [];
  files.forEach((item) => {
    promiseArr.push(ReadFilesAsync(item).catch((err) => { throw new Error(err); }));
  });
  return Promise.all(promiseArr);
}

/* Notkun =  GetSortedDates(Files)
   Fyrir  = Files fylki af strengjum
   Eftir  = skilar fylki af json obj sem eru röðuð eftir dagsetningu */
function GetSortedDates(Files) {
  const tempArr = [];

  Files.forEach((item) => {
    parser(item.toString('utf8'), (err, result) => {
      tempArr.push({
        title: result.attributes.title,
        slug: result.attributes.slug,
        date: result.attributes.date,
        image: result.attributes.image,
      });
    });
  });

  tempArr.sort((a, b) => {
    const c = new Date(a.date);
    const d = new Date(b.date);
    return d - c;
  });

  return tempArr;
}
/*
  HTML Uppsetning
  <main>
   <div class="wrapper">                   --- wrapper start
      <div class="wrapper__img">           ---wrapper__img start
          <img scr="....">
      </div>                               ---wrapper__img end
      <div class="wrapper__content">       ---wrapper__content  start
          <h3>......</h3>
          <p>.......</p>
      </div>                               ---wrapper__content  END
   <div>                                   ---wrapper end
  <main>
*/
function CreateHtml(files) {
  let html = '<main>';
  files.forEach((item) => {
    html += `<div class="wrapper"><a href="${item.slug}">`;// ---------Wrapper start
    html += '<div class="wrapper__img">';// ----- Wrapper__img START
    if (typeof (item.image) === 'undefined') {
      html += `<img src="${srcset}">`;
    } else {
      html += `<img src="${item.image}">`;
    }
    html += '</div>'; // ----- Wrapper__img end
    html += '<div class="wrapper__content">';// ----- Wrapper__content START
    html += `<h3>${item.title}</h3>`;
    const date = new Date(item.date);
    html += `<p>${date.getDate()}.${date.getMonth()}.${date.getFullYear()}</p>`;
    html += '</div>';// ----- Wrapper__content END
    html += '</a></div>';// --------------------------Wrapper END
  });
  html += '</main>';
  return html;
}

router.get('/', (req, res) => {
  GetFiles('articles').then((fileArr) => {
    const data = GetSortedDates(fileArr);
    res.render('index', { title: 'Forsiða', headder: 'Greinasafnið', content: CreateHtml(data) });
  });
});

router.get('/:slug', (req, res) => {
  GetFiles('articles').then((fileArr) => {
    const data = SlugToHtml(fileArr);
    const [slug] = [req.params.slug];
    if (!data[slug]) {
      res.status(404).render('error', { title: 'Villa', headder: 'Fannst ekki', content: '<main><div class="error"><h3 class="error__text"> Ó nei efnið fanst ekki! </h3><a class="error__refferal" href="../">Til baka</a></div></main>' });
    } else {
      res.render('article', { title: data[slug][0], headder: data[slug][0], content: data[slug][1] });
    }
  });
});

module.exports = router;
