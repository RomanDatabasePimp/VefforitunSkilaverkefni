/* Requires START */
const util = require('util');
const fs = require('fs');
const parser = require('markdown-parse');
/* Requires END */

/* Variables Start */
const articleNames =[];
const readFileAsync = util.promisify(fs.readFile);
const article='';
/* Variables Start */

/* Fastyrðing lýkkju 
   Fyrir :
         fs.readdirSync("articles") > 0  fjöldi staka i articles möppu
         file er núverandi stack i atricles möppu
         articleNames = null  er tómt fylki
   Eftir : 
         articleName = [n0,n1,...,nk]
         þar sem n er skrá i.e þriðja seinasta stakið er .   
*/
fs.readdirSync('articles').forEach(file => {
  /* file.len - 3 = \.\  => articleNames[i] = file  */
  if(file[file.length-3] == '.') {
    articleNames.push(file);
  }
})

/*  
   -articlenames = fylki af nafn á .md skráum sem þarf að lesa
   -article = er núverandi stack úr articlenames[i]
   -data = i-ta .md skjalið lesið úr möppu articles 
    Fyrir hvert stack i articlenames það er lesið þvi í articles möppu
    Async style og prentað út html og breytur sem hun hefur 
*/
articleNames.forEach(article => {
  readFileAsync('articles/'+article)
  .then(data => {
    parser(data.toString('utf8'), function(err, result){
      console.log('the html:')
      console.log(result.html)
      console.log('the front matter:')
      console.dir(result.attributes)
  })
  })
  .catch(err => {
    console.error(err);
  });
});

