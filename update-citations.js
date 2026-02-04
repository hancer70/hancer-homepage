const playwright = require('playwright');
const fs = require('fs');
const path = require('path');

async function updateCitations() {
    console.log('Starting citation update...');

    const browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Navigate to Google Scholar profile
        const scholarUrl = 'https://scholar.google.com/citations?user=oAwWBRYAAAAJ&hl=en';
        console.log(`Fetching data from: ${scholarUrl}`);

        await page.goto(scholarUrl, { waitUntil: 'networkidle' });

        // Wait for the page to load
        await page.waitForSelector('#gsc_rsb_st', { timeout: 10000 });

        // Extract citation metrics
        const metrics = await page.evaluate(() => {
            const rows = document.querySelectorAll('#gsc_rsb_st tbody tr');
            const data = {};

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const label = cells[0].textContent.trim();
                    const value = cells[1].textContent.trim();

                    if (label === 'Citations') {
                        data.citations = parseInt(value.replace(/,/g, ''));
                    } else if (label === 'h-index') {
                        data.hIndex = parseInt(value);
                    } else if (label === 'i10-index') {
                        data.i10Index = parseInt(value);
                    }
                }
            });

            return data;
        });

        console.log('Extracted metrics:', metrics);

        // Read the HTML file
        const htmlPath = path.join(__dirname, 'index.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        // Update the metrics in the HTML
        // Update citations
        htmlContent = htmlContent.replace(
            /<div class="metric-value" data-target="\d+" data-metric="citations">0<\/div>/,
            `<div class="metric-value" data-target="${metrics.citations}" data-metric="citations">0</div>`
        );

        // Update h-index
        htmlContent = htmlContent.replace(
            /<div class="metric-value" data-target="\d+" data-metric="h-index">0<\/div>/,
            `<div class="metric-value" data-target="${metrics.hIndex}" data-metric="h-index">0</div>`
        );

        // Update i10-index
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
        console.error('Error updating citations:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

updateCitations();
