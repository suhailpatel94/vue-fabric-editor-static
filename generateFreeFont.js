
const https = require('https');
const { writeFile } = require('fs').promises

const freeFontUrl = 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCak84RmCcPnHkSJBjK96QFIK8H7_fLVoE'
https.get(freeFontUrl, (response) => {
  let str = '';
  response.on('data', (chunk) => {
    str += chunk;
  });
  response.on('end', () => {
    // console.log(str)
    const data = JSON.parse(str)
    // 筛选可直接使用的字体
    // const list = Object.keys(data).filter(key => {
    //     return data[key].download.includes('.ttf')
    // })
    const list = data["items"]
    // 生成字体和json文件
    generateCSS(list, data)
    // generateLocalCSS(list, data)
    // generateJSON(list, data)
  });

}).on("error", (error) => {
  console.log("Error: " + error.message);
});
// 字符串转对象
function strToData(str){
    const basic = str.split('var fontsMap =')[1]
    const jsonStr = basic.substring(0, basic.length - 1);
    var data = eval("(" + jsonStr + ")");
    return data
}
// 生成css文件
function generateCSS(list,data){
    let freeFont = ''
    list.forEach(obj => {
      const newDownload = obj['files']['regular']
        freeFont += `@font-face {
            font-family: '${obj['family']}';
            src: url('${newDownload}');
          }
          `
    })
    writeFile('./font/free-font.css', freeFont, 'utf8')
}

function generateLocalCSS(list,data){
  let freeFont = ''
  list.forEach(key => {
      const src = data[key].download.replace('https://github.com/', 'http://localhost:3000/fontFile/')
      freeFont += `@font-face {
          font-family: '${data[key].name}';
          src: url('${src}');
        }
        `
  })
  writeFile('./font/free-font-local.css', freeFont, 'utf8')
}
// 生成JSON文件
function generateJSON(list,data){
    let newData = {}
    list.forEach(key => {
        newData[key] = data[key]
        newData[key].preview = 'https://wordshub.github.io/free-font/' + newData[key].preview
    })
    writeFile('./font/free-font.json', JSON.stringify(newData, null, 2), 'utf8')
}