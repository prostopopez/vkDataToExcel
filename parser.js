const fs = require('fs');
const jsdom = require('jsdom');
const excel = require('excel4node');

let query = [];

fs.readdir('vkData/', function(err, filenames) {
    if (err) {
        throw(err);
    }

    filenames.forEach(function(filename) {
        fs.readFile('vkData/' + filename, function(err, html) {
            if (err) {
                throw err;
            }

            const root = new jsdom.JSDOM(html);
            let data = root.window.document.querySelectorAll('.message__header+div');

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

            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet('Данные', '');

            let mainStyle = workbook.createStyle({
                border: {
                    left: {
                        style: 'medium',
                        color: '000000',
                    },
                    right: {
                        style: 'medium',
                        color: '000000',
                    },
                    top: {
                        style: 'medium',
                        color: '000000',
                    },
                    bottom: {
                        style: 'medium',
                        color: '000000',
                    },
                },
                alignment: {
                    vertical: 'center'
                },
            });

            let headerStyle = workbook.createStyle({
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    fgColor: 'd2f8fa',
                },
                font: {
                    bold: true,
                    size: 16
                },
                alignment: {
                    horizontal: 'center'
                },
            });

            let textStyle = workbook.createStyle({
                font: {
                    size: 14
                },
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    fgColor: 'feffe7',
                },
                alignment: {
                    horizontal: 'left'
                },
            });

            let imgStyle = workbook.createStyle({
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    fgColor: 'ffffff',
                },
                font: {
                    color: '2800ff',
                    underline: false,
                    size: 16,
                    bold: true,
                },
            });

            worksheet.cell(1, 1).string('#').style(mainStyle).style(headerStyle);
            worksheet.cell(1, 2).string('Адрес').style(mainStyle).style(headerStyle);
            worksheet.cell(1, 3).string('Квартира').style(mainStyle).style(headerStyle);
            worksheet.cell(1, 4).string('Цена').style(mainStyle).style(headerStyle);
            worksheet.cell(1, 5).string('Район').style(mainStyle).style(headerStyle);
            worksheet.cell(1, 6).string('Телефон').style(mainStyle).style(headerStyle);
            worksheet.cell(1, 7, 1, 16, true).string('Фотографии').style(mainStyle).style(headerStyle);

            for (let x = 0; x < query.length; x++) {
                worksheet.cell(x + 2, 1).string(`${x}`).style(mainStyle).style(headerStyle);
                worksheet.cell(x + 2, 2).string(query[x].address).style(mainStyle).style(textStyle);
                worksheet.cell(x + 2, 3).string(query[x].apartment).style(mainStyle).style(textStyle);
                worksheet.cell(x + 2, 4).string(query[x].price).style(mainStyle).style(textStyle);
                worksheet.cell(x + 2, 5).string(query[x].district).style(mainStyle).style(textStyle);
                worksheet.cell(x + 2, 6).string(query[x].phone).style(mainStyle).style(textStyle);
                for (let y = 0; y < query[x].imgs.length; y++) {
                    worksheet.cell(x + 2, 7 + y).link(query[x].imgs[y], `№${y + 1}`).style(mainStyle).style(imgStyle);
                }

                worksheet.cell(x + 2, 7, x + 2, 16).style(imgStyle);
                worksheet.cell(x + 2, 16).style({border: {right: {style: 'medium', color: '000000'}}});
                if (x + 1 === query.length) {
                    worksheet.cell(x + 2, 7, x + 2, 16).style({border: {bottom: {style: 'medium', color: '000000'}}});
                }
            }

            workbook.write('Excel.xlsx');
        });
    });
});
