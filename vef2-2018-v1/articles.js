
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

function ReadFilesAsync(NamesOfFiles){
  NamesOfFiles.forEach(article => {
    readFileAsync('articles/'+article)
    .then(data => {
      parser(data.toString('utf8'),(err, result)=>{
          console.log('the front matter:')
          console.dir(result.attributes)
          console.log('the html:')
          console.log(result.html)
    })
    })
  })
}

ReadFilesNamesAsync('articles').then(data => ReadFilesAsync(GetMdFiles(data)));

