const fs = require('fs/promises');
const layout = require('./layout.js');

getData().then(async function(data) {
    // buildGridTemplate(data);
    buildShootsTemplates(data);
});

async function getData () {
    // Reads a specified directory and creates an array of objects
    let shoots = await fs.readdir(
        `${__dirname}/../assets/projects`, 
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
            `${__dirname}/../assets/projects/${name}`,
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
    let shootsDir = `${__dirname}/../templates/shoots`;

    // Creates a folder if one doesn't exist at specified path
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
        `;

        const headerEnd = layout.indexOf("</header>") + 9; // +9 to specify end of tag
        const bodyEnd = layout.indexOf("</body>");
        const ShootContent = layout.slice(0, headerEnd) + mainContent + layout.slice(bodyEnd);
        
        await fs.writeFile(
            `${shootsDir}/${name}.html`, 
            ShootContent, 
            { overwrite: false, flag: 'wx' }, 
            err => {
                if (err) {
                    console.error(err);
                }
            }
        )
    }
}