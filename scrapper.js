const axios = require('axios');
const cheerio = require('cheerio');
const qna = require('@tensorflow-models/qna');


const db = {};

async function scrap(url = '') {
    const model = await qna.load();
    axios(url, {
        headers: {
            Cookie: ""
        }
    })
        .then(response => {
            db[url] = {};
            const html = response.data;
            const $ = cheerio.load(html);
            const aHyperLinks = $('a');
            aHyperLinks
                .map((link) => link.attribs[href])
                .filter((link) => link.contains('http'))
                .filter((link) => link.length < 2)
                .filter((link) => !db[link])
                .forEach((link) => {
                    scrap(link);
                });
        })
        .catch(console.error);
}

module.exports = scrap;
