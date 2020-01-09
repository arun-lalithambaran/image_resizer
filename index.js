const Jimp = require('jimp');
const fs = require('fs');

const inputPath = './target/';
const outputPath = './output/';
const extentionArray = ["png", "jpeg", "jpg"];

fs.readdir(inputPath, (err, files) => {
    let count = 0;
    let errorCount = [];
    let skippedCount = [];
    
    files.forEach(item => {
        let extArr = item.split('.');
        let ext = extArr[extArr.length - 1].toLocaleLowerCase();
        if (extentionArray.includes(ext)) {
            resizeImage(item).then(() => {
                count++;
                console.log(`Completed ${count} of ${files.length}`);
            }).catch(err => {
                errorCount.push(item);
            }).finally(() => {
                if (files.length === (count + errorCount.length + skippedCount.length)) {
                    console.log('Finished!!!');
                    console.log(`Success : ${count}, Failed : ${errorCount.length}, Skipped : ${skippedCount.length}`);
                    console.log('Failed items : ', errorCount);
                    console.log('Skipped items : ', skippedCount);
                    let outputLog = {
                        skippedFiles: skippedCount,
                        failedFiles: errorCount
                    }
                    fs.writeFile('./output_log.json', JSON.stringify(outputLog), err => {
                        console.log('output_log.json created....');
                    })
                }
            })
        } else {
            skippedCount.push(item);
        }
    })
})

function resizeImage(filename) {
    return new Promise((resolve, reject) => {
        Jimp.read(inputPath + filename).then(item => {
            resolve(true);
            return item
                .resize(600, Jimp.AUTO) // resize
                .quality(50)
                .write(outputPath + filename); // save
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    })
}
