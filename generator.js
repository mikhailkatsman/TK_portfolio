const fs = require('fs/promises')

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
                .map(file => `/shoots/${name}/${file.name}`)
                // Filters out names of files if they don't conform to specified RegEx
                .filter(name => extRegex.test(name));

        // Creates an entry in the new 'data' array, containing the name of the directory,
        // and the files contained in that directory
        data.push({ name, files });
    }

    return data;
}

getData().then(async function (data) {

    let shootsDir = `${__dirname}/shoots`;

    // Creates a folder if one doesn't exist at specified path
    await fs.mkdir(
        shootsDir, 
        { recursive: true }
    );

    for (const { name, files } of data) {
        let content = `
        <html>
        <head></head>
        <body>
            ${files.map(function (file) {
            return `<img src="${file}"/>`
        }).join('')}
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
})


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