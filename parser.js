let fs = require("fs");
const parse = require('node-html-parser').parse;

fs.readFile(__dirname + '/vkData/messages23450.html', 'utf-8', function (err, html) {
    if (err) {
        throw err;
    }

    const root = parse(html);
    let data = root.querySelectorAll('.message__header+div');
    console.log(data);
    let query = [];

    for (let x = 0; x < data.length; x++) {
        let stringData;
        let imgBlock;
        let imgArray = [];

        stringData = data[x].textContent.split(/\r?\n/)[0].split(/[.]+/);

        imgBlock = data[x].textContent.split(/\r?\n/);
        for (let y = 0; y < imgBlock.length; y++) {
            if (imgBlock[y].includes('http')) {
                imgArray.push(imgBlock[y].replace(/\s/g, ''));
            }
        }

        query.push({
            address: stringData[0],
            apartment: stringData[1],
            price: stringData[2],
            district: stringData[3],
            phone: stringData[4],
            imgs: imgArray
        });
    }

    console.log(query);
    fs.writeFile('helloworld.txt', query,function (err) {
        if (err) return console.log(err);
    });
});