const subsetFont = require('subset-font');
const fs = require('fs')
const font2base64 = require('node-font2base64')

const mySfntFontBuffer = fs.readFileSync('../site/static/NotoSansMono-Medium.ttf')

subsetFont(mySfntFontBuffer, `
abcdefghijklmnopqrstuvwxyz
ABCDEFGHIJKLMNOPQRSTUVWXYZ
0123456789
!"£$%^&*()_+=-{}][]~@:;'#<>?,./\|
`, {
  targetFormat: 'woff2',
}).then(subsetBuffer => {
    fs.writeFileSync('./optimised.woff2', subsetBuffer)
    return font2base64.encodeToDataUrl('./optimised.woff2')

}).then((uri) => {
    fs.writeFileSync('./asbase64.txt', uri)
})
.then(() => {
    console.log('done')
}, e => {
    console.error(e)
});
