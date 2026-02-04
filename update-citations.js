const https = require('https');
const fs = require('fs');
const path = require('path');

async function updateCitations() {
    console.log('Starting citation update with SerpApi...');

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
        console.error('Error: SERPAPI_KEY environment variable not set');
        process.exit(1);
    }

    const scholarId = 'oAwWBRYAAAAJ';
    const url = `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${scholarId}&api_key=${apiKey}`;

    console.log('Fetching data from SerpApi...');

    try {
        const data = await fetchData(url);
        const result = JSON.parse(data);

        if (result.error) {
            console.error('SerpApi Error:', result.error);
            process.exit(1);
        }

        // Extract citation metrics
        const citedBy = result.cited_by || {};
        const metrics = {
            citations: citedBy.table?.[0]?.citations?.all || 0,
            hIndex: citedBy.table?.[1]?.h_index?.all || 0,
            i10Index: citedBy.table?.[2]?.i10_index?.all || 0
        };

        console.log('Extracted metrics:', metrics);

        // Read the HTML file
        const htmlPath = path.join(__dirname, 'index.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        // Update the metrics in the HTML
        htmlContent = htmlContent.replace(
            /<div class="metric-value" data-target="\d+" data-metric="citations">0<\/div>/,
            `<div class="metric-value" data-target="${metrics.citations}" data-metric="citations">0</div>`
        );

        htmlContent = htmlContent.replace(
            /<div class="metric-value" data-target="\d+" data-metric="h-index">0<\/div>/,
            `<div class="metric-value" data-target="${metrics.hIndex}" data-metric="h-index">0</div>`
        );

        htmlContent = htmlContent.replace(
            /<div class="metric-value" data-target="\d+" data-metric="i10-index">0<\/div>/,
            `<div class="metric-value" data-target="${metrics.i10Index}" data-metric="i10-index">0</div>`
        );

        // Update hero subtitle
        const heroSubtitleRegex = /Internationally recognized scholar with <strong>[\d,]+\+ citations<\/strong>/;
        htmlContent = htmlContent.replace(
            heroSubtitleRegex,
            `Internationally recognized scholar with <strong>${metrics.citations.toLocaleString()}+ citations</strong>`
        );

        // Write the updated HTML back
        fs.writeFileSync(htmlPath, htmlContent, 'utf8');

        console.log('✅ Successfully updated citations!');
        console.log(`   Total Citations: ${metrics.citations}`);
        console.log(`   h-index: ${metrics.hIndex}`);
        console.log(`   i10-index: ${metrics.i10Index}`);

        // Create a log file with the update timestamp
        const logData = {
            lastUpdated: new Date().toISOString(),
            metrics: metrics
        };
        fs.writeFileSync(
            path.join(__dirname, 'citation-update-log.json'),
            JSON.stringify(logData, null, 2)
        );

    } catch (error) {
        console.error('Error updating citations:', error.message);
        process.exit(1);
    }
}

function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(data);
            });

        }).on('error', (err) => {
            reject(err);
        });
    });
}

updateCitations();
