const fs = require('fs/promises');
const path = require('node:path');
const layout = require('./layout.js');
const sharp = require('sharp');
var ffprobe = require('ffprobe');
    ffprobeStatic = require('ffprobe-static');

// Set absolute path to project src
const srcPath = path.resolve(__dirname, '..');

// Specifies the file extension for later
// Makes sure that if we drop something stupid in folder it will not cause any trouble
let extRegex = /\.(webp|mp4)$/i;
let webpRegex = /\.webp$/i;

// Gets data and then generates templates
getData().then(async function(data) {
    buildShootsTemplates(data);
    buildGridTemplate(data);
});

async function getData () {
    // Reads a specified directory and creates an array of objects
    let shoots = await fs.readdir(
        `${srcPath}/assets/projects`, 
        { withFileTypes: true }
    );

    shoots = shoots
            // Checks if the entries are directories, and discards if not
            .filter((entry) => entry.isDirectory())
            // Extracts the name property of each directory in the array
            .map((dir) => dir.name)
            .sort((a, b) => a - b);

    // Declares a new empty array
    let data = [];

    // Iterates through the 'shoots' directory array
    for (const name of shoots) {
        // Reads each entry into a single var
        let files = await fs.readdir(
            `${srcPath}/assets/projects/${name}`,
            { withFileTypes: true }
        );

        files = files
                // Maps new filepaths to files
                .map(file => `/assets/projects/${name}/${file.name}`)
                // Filters out names of files if they don't conform to specified RegEx
                .filter(name => extRegex.test(name))
                .sort((a, b) => a - b);

        // Creates an entry in the new 'data' array, containing the name of the directory,
        // and the files contained in that directory
        data.push({ name, files });
    }

    return data;
}

async function buildShootsTemplates(data) {
    let shootsDir = `${srcPath}/shoots`;

    // Creates a folder to store shoots directories at specified path
    await fs.mkdir(
        shootsDir, 
        { recursive: true }
    );

    for (const { name, files } of data) {
        let mainContent = `
        <main id="swup" class="transition-fade">
            <div class="glry-container">
                <ul class="slides">
                    ${files.map(function (file, index) {
                    return `
                    <input 
                        type="radio" 
                        name="radio-buttons"
                        id="img-${index + 1}" ${index === 0 ? "checked" : ""}
                    />
                    <li class="slide-container">
                        <div class="slide-image">
                            <img src="${file}"/>
                        </div>
                        <div class="glry-controls">
                            <label for="img-${(index + files.length - 1) % files.length + 1}" class="prev-slide">
                                <img src="/assets/svg/chevron-back-sharp.svg" alt="back-arrow">
                            </label>
                            <label for="img-${(index + 1) % files.length + 1}" class="next-slide">
                                <img src="/assets/svg/chevron-forward-sharp.svg" alt="forward-arrow">
                            </label>
                        </div>
                    </li>
                    `
                    }).join('')}
                    <div class="glry-dots">
                        ${files.map(function (file, index) {
                            return `
                        <label for="img-${index + 1}" class="glry-dot" id="img-dot-${index + 1}"></label>
                        `;
                        }).join('')}
                    </div>
                </ul>
            </div>
        </main>
    `;
        
        await fs.writeFile(
            `${shootsDir}/${name}.html`, 
            sliceLayout(mainContent, layout), 
            { overwrite: true, flag: 'wx' }, 
            err => {
                if (err) {
                    console.error(err);
                }
            }
        );
    }
}

async function buildGridTemplate(data) {
    let gridImgsDir = `${srcPath}/assets/grid-img`;

    // Creates a folder to store all the compressed img data for grid-view
    await fs.mkdir(
        gridImgsDir, 
        { recursive: true }
    );

    // Iterates through directories in 'data' array,
    // and extracts first file in each directory
    const firstFiles = data.map(dir => dir.files[0]);

    // Declares array to store calculated aspect ratios
    let aspectRatios = [];

    // Iterates through each file in 'firstFiles' array
    for (let i = 0; i < firstFiles.length; i++) {

        // Retrieve file
        const file = await fs.readFile(`${srcPath}/${firstFiles[i]}`);

        // For .webp
        if (webpRegex.test(firstFiles[i])) {

            // Calculate img aspect ratio
            const metadata = await sharp(file).metadata();
            aspectRatios.push((metadata.width / metadata.height).toFixed(4));

            // Resize file, save new file in new directory
            await sharp(file)
                .resize({ width: 800 })
                .toFile(`${gridImgsDir}/${i + 1}.webp`)
                .catch(err => {
                    console.log(err);
                });
        } 
        // For .mp4
        else {
            // Calculate video aspect ratio
            await ffprobe(
                `${srcPath}/${firstFiles[i]}`,
                { path: ffprobeStatic.path })
            .then(metadata => {
                aspectRatios.push((metadata.streams[0].width / metadata.streams[0].height).toFixed(4));
            });

            await fs.writeFile(
                `${gridImgsDir}/${i + 1}.mp4`, 
                file, 
                { overwrite: true, flag: 'wx' }, 
                err => {
                    if (err) {
                        console.error(err);
                    }
                }
            );
        }
    }

    let mainContent = `
        <main id="swup" class="transition-fade">
            <div class="portfolio-container">
                <div class="portfolio-grid">
                    ${firstFiles.map((file, index) => {
                        return `
                    <div id="grid-item-${index + 1}" class="grid-item" style="aspect-ratio: ${aspectRatios[index]};">
                        <a href="/shoots/${index + 1}.html"><span id="item-span-${index + 1}"></span></a>
                    </div>
                    `;
                    }).join('')}
                </div>
            </div>
        </main>
    `;

    await fs.writeFile(
        `${srcPath}/portfolio.html`, 
        sliceLayout(mainContent, layout), 
        { overwrite: true, flag: 'wx' }, 
        err => {
            if (err) {
                console.error(err);
            }
        }
    );
}

function sliceLayout(mainContent, layout) {
    const headerEnd = layout.indexOf("</header>") + 9; // +9 to specify end of tag
    const bodyEnd = layout.indexOf("</body>");
    const newContent = layout.slice(0, headerEnd) + mainContent + layout.slice(bodyEnd);
    return newContent;
}