const fs = require('fs/promises')

getData().then(async function(data) {
    buildShootsTemplates(data);
    // buildGridTemplate(data);
});

// Reads a specified directory and creates an array of objects
async function getData () {
    let shoots = await fs.readdir(
        `${__dirname}/assets/projects`, 
        { withFileTypes: true }
    );

    shoots = shoots
            // Checks if the entries are directories, and discards if not
            .filter((entry) => entry.isDirectory())
            // Extracts the name property of each directory in the array
            .map((dir) => dir.name);

    // Specifies the file extension for later
    // Makes sure that if we drop something stupid in folder it will not cause any trouble
    let extRegex = /\.(webp|mp4)$/i;

    // Declares a new empty array
    let data = [];

    // Iterates through the 'shoots' directory array
    for (const name of shoots) {
        // Reads each entry into a single var
        let files = await fs.readdir(
            `${__dirname}/assets/projects/${name}`,
            { withFileTypes: true }
        );

        files = files
                // Maps new filepaths to files
                .map(file => `/assets/projects/${name}/${file.name}`)
                // Filters out names of files if they don't conform to specified RegEx
                .filter(name => extRegex.test(name));

        // Creates an entry in the new 'data' array, containing the name of the directory,
        // and the files contained in that directory
        data.push({ name, files });
    }

    return data;
}

async function buildShootsTemplates(data) {
    let shootsDir = `${__dirname}/templates/shoots`;

    // Creates a folder if one doesn't exist at specified path
    await fs.mkdir(
        shootsDir, 
        { recursive: true }
    );

    for (const { name, files } of data) {
        let content = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <meta name="description" content="Tomila Katsman Photography Portfolio">

                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
                
                <link rel="stylesheet" href="styles.css" />
                <link rel="stylesheet" href="queries.css" />

                <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
                <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>

                <script defer src="https://unpkg.com/swup@latest/dist/swup.min.js"></script>
                <script defer src="https://unpkg.com/minimasonry@latest/build/minimasonry.min.js"></script>
                <script defer src="../../index.js"></script>

                <title>Tomila Katsman</title>
            </head>
            <body>
                <header id="header" class="header">
                    <a class="header-logo-link" href="../../portfolio.html">Tomila Katsman</a>
                    <nav class="nav">
                        <ul class="nav-list">
                            <li><a class="nav-link" href="/about.html">About</a></li>
                            <li><a class="nav-link" href="/contact.html">Contact</a></li>
                            <li>
                                <a class="nav-link" href="https://www.instagram.com/tomilakatsman/?hl=en">
                                    <img class="instagram-logo" src="../../assets/svg/logo-instagram.svg" alt="Instagram link">
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <button class="btn-mobile-nav">
                        <img src="../../assets/svg/menu-sharp.svg" class="icon-mobile-nav" alt="menu-sharp" />
                        <img src="../../assets/svg/close-sharp.svg" class="icon-mobile-nav" alt="close-sharp" />
                    </button>
                </header>
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
                                        <img src="../../assets/svg/chevron-back-sharp.svg" alt="back-arrow">
                                    </label>
                                    <label for="img-${(index + 1) % files.length + 1}" class="next-slide">
                                        <img src="../../assets/svg/chevron-forward-sharp.svg" alt="forward-arrow">
                                    </label>
                                </div>
                            </li>
                            `
                            }).join('')}
                            <div class="glry-dots">
                                ${files.map(function (file, index) {
                                   return `
                                   <label for="img-${index + 1}" class="glry-dot" id="img-dot-${index + 1}"></label>
                                   `
                                }).join('')}
                            </div>
                        </ul>
                    </div>
                </main>
            </body>
        </html>
        `
        
        await fs.writeFile(
            `${shootsDir}/${name}.html`, 
            content, 
            { overwrite: false, flag: 'wx' }, 
            err => {
                if (err) {
                    console.error(err);
                }
            }
        )
    }
}



// // separate file
// module.exports = ({ files }) => `
// <html>
//     <head></head>
//     <body>
//         ${files.map(function (file) {
//             return `<img src="${file}"/>`
//         }).join('')}
//     </body>
// </html>
// `

// // master template
// // layout.js
// module.exports = ({ content, title }) => {
//     return `
// <html>
//     <head>
//     <title>${title}</title>
// </head>
//     <body>
//     </body>
// </html>
//     `
// }
// // project.js
// import layout from './layout'

// module.exports = ({ files, projectName }) => layout({
//     content: `
//     <div>
//     ${files.map(function (file) {
//         return `<img src="${file}"/>`
//     }).join('')}
//     </div>`,
//     title:`${projectName} | Portfolio`
// })