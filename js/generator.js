const fs = require('fs/promises')
const path = require('node:path')
const layout = require('./layout.js')
const sharp = require('sharp')
const ffprobe = require('ffprobe')
const ffprobeStatic = require('ffprobe-static')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const extractFrame = require('ffmpeg-extract-frame')

// Set absolute path to project src
const srcPath = path.resolve(__dirname, '..')

// Specifies the file extension for later
// Makes sure that if we drop something stupid in folder it will not cause any trouble
const extRegex = /\.(jpg|mp4)$/i
const jpgRegex = /\.jpg$/i

// Gets data and then generates templates
getData().then(async function (data) {
    buildShootsTemplates(data)
    buildGridTemplate(data)
})

async function getData () {
    // Reads a specified directory and creates an array of objects
    let shoots = await fs.readdir(
        `${srcPath}/assets/projects`,
        { withFileTypes: true }
    )

    shoots = shoots
    // Checks if the entries are directories, and discards if not
        .filter((entry) => entry.isDirectory())
    // Extracts the name property of each directory in the array
        .map((dir) => dir.name)
        .sort((a, b) => a - b)

    // Declares a new empty array
    const data = []

    // Iterates through the 'shoots' directory array
    for (const name of shoots) {
    // Reads each entry into a single var
        let files = await fs.readdir(
            `${srcPath}/assets/projects/${name}`,
            { withFileTypes: true }
        )

        files = files
        // Maps new filepaths to files
            .map(file => `/assets/projects/${name}/${file.name}`)
        // Filters out names of files if they don't conform to specified RegEx
            .filter(name => extRegex.test(name))
            .sort((a, b) => a - b)

        // Creates an entry in the new 'data' array, containing the name of the directory,
        // and the files contained in that directory
        data.push({ name, files })
    }

    return data
}

async function buildShootsTemplates (data) {
    const shootsDir = `${srcPath}/portfolio`

    // Creates a folder to store shoots directories at specified path
    await fs.mkdir(
        shootsDir,
        { recursive: true }
    )

    for (const { name, files } of data) {
        const mainContent = `
        <main id="swup" class="transition-fade">
            <div class="glry-container">
                <div id="canvas" class="canvas">
                    <div id="img-container" class="img-container">
                    ${files.map(function (file, index) {
            return `
                        <img src="${file}" alt="${file}" />
                        `
        }).join('')}
                    </div>

                    <div id="dots-container" class="dots-container">
                        ${files.map(function (file, index) {
            return `
                        <span id="dot-${index}"></span>
                        `
        }).join('')}
                    </div>

                    <div class="glry-controls">
                        <label id="left-control" class="prev-slide">
                            <img src="/assets/svg/chevron-back-sharp.svg" alt="back-arrow">
                        </label>
                        <label id="right-control" class="next-slide">
                            <img src="/assets/svg/chevron-forward-sharp.svg" alt="forward-arrow">
                        </label>
                    </div>
                </div>
            </div>
        </main>
    `

        await fs.writeFile(
            `${shootsDir}/${name}.html`,
            sliceLayout(mainContent, layout),
            { overwrite: true, flag: 'wx' },
            err => {
                if (err) {
                    console.error(err)
                }
            }
        )
    }
}

async function buildGridTemplate (data) {
    const gridImgsDir = `${srcPath}/assets/grid-img`

    // Creates a folder to store all the compressed img data for grid-view
    await fs.mkdir(
        gridImgsDir,
        { recursive: true }
    )

    // Iterates through directories in 'data' array,
    // and extracts first file in each directory
    const firstFiles = data.map(dir => dir.files[0])

    // Declares array to store calculated aspect ratios
    const aspectRatios = []

    // Iterates through each file in 'firstFiles' array
    for (let i = 0; i < firstFiles.length; i++) {
        // Retrieve file
        const file = await fs.readFile(`${srcPath}/${firstFiles[i]}`)

        // For .jpg
        if (jpgRegex.test(firstFiles[i])) {
            // Calculate img aspect ratio
            const metadata = await sharp(file).metadata()

            aspectRatios.push({ width: metadata.width, height: metadata.height })

            // Resize file, save new file in new directory
            await sharp(file)
                .resize({ width: 750 })
                .toFile(`${gridImgsDir}/${i + 1}.jpg`)
                .catch(err => {
                    console.log(err)
                })
        }

        // For .mp4
        else {
            // Calculate video aspect ratio
            await ffprobe(
                `${srcPath}/${firstFiles[i]}`,
                { path: ffprobeStatic.path })
                .then(metadata => aspectRatios.push({
                    width: metadata.streams[0].width,
                    height: metadata.streams[0].height
                })
            )

            await fs.writeFile(
                `${gridImgsDir}/${i + 1}.mp4`,
                file,
                { overwrite: true, flag: 'wx' },
                err => {
                    if (err) {
                        console.error(err)
                    }
                }
            )

            await extractFrame({
                input: `${srcPath}/${firstFiles[i]}`,
                output: `${gridImgsDir}/${i + 1}-poster.jpg`,
                offset: 30,
            })
        }
    }

    const shootsHtml = firstFiles.map((file, index) => {
        return `<div id="grid-item-${index + 1}" class="grid-item">` +
            (path.extname(file) === '.mp4'
                ? `     
                        <video 
                            class="grid-video" 
                            src="/assets/grid-img/${index + 1}.mp4"
                            poster="/assets/grid-img/${index + 1}-poster.jpg"
                            width="${aspectRatios[index].width}"
                            height="${aspectRatios[index].height}"
                            muted autoplay playsinline loop>
                        </video>
                    `
                : `     
                        <a href="/portfolio/${index + 1}.html" class="grid-link">
                            <img 
                                class="grid-img"
                                loading="lazy" 
                                src="/assets/grid-img/${index + 1}.jpg" 
                                width="${aspectRatios[index].width}"
                                height="${aspectRatios[index].height}"
                                alt="Image ${index + 1}"
                            >
                        </a>
                    `) +
            `</div>
                    `
    }).join('')

    const mainContent = `
        <main id="swup" class="transition-fade">
            <div class="portfolio-container">
                <div id="portfolio-grid" class="portfolio-grid">
                    <div class="grid-sizer"></div>
                    <div class="gutter-sizer"></div>
                    ${shootsHtml}
                </div>
            </div>
        </main>
    `

    await fs.writeFile(
        `${srcPath}/portfolio.html`,
        sliceLayout(mainContent, layout),
        { overwrite: true, flag: 'wx' },
        err => {
            if (err) {
                console.error(err)
            }
        }
    )
}

function sliceLayout (mainContent, layout) {
    const headerEnd = layout.indexOf('</header>') + 9 // +9 to specify end of tag
    const bodyEnd = layout.indexOf('</body>')
    const newContent = layout.slice(0, headerEnd) + mainContent + layout.slice(bodyEnd)
    return newContent
}
