let fs = require("fs");
const jsdom = require("jsdom");

fs.readFile(__dirname + '/vkData/messages23450.html', 'utf-8', function (err, html) {
    if (err) {
        throw err;
    }

    const root = new jsdom.JSDOM(html);
    let data = root.window.document.querySelectorAll('.message__header+div');
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
    // fs.writeFile('helloworld.txt', JSON.stringify(query),function (err) {
    //     if (err) return console.log(err);
    // });
});