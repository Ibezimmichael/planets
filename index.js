const { parse } = require('csv-parse');
const fs = require('fs');
const csvWriteStream = require('csv-write-stream')

function habitable(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' 
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.12
    && planet['koi_prad'] < 1.6; 
}
const liveable = [];
const output = fs.createWriteStream('habitable.csv', 'utf8');
const csvWriter = csvWriteStream();
csvWriter.pipe(output);
fs.createReadStream('kepler_data.csv', 'utf8')
    .pipe(parse({
        comment: '#',
        columns: true,
    }))
    .on('data', (data) => {
        if (habitable(data)) {
            csvWriter.write(data)
        }
    })
    .on('error', (err) => {
        console.log(err);
    })
    .on('end', () => {
        csvWriter.end()
    });


