const path = require('node:path');

// Set absolute path to project src
const srcPath = path.resolve(__dirname, '..');

// Master HTML layout
let layout = `
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
        
        <link rel="stylesheet" href="${srcPath}/css/styles.css" />
        <link rel="stylesheet" href="${srcPath}/css/queries.css" />

        <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
        <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>

        <script defer src="https://unpkg.com/swup@latest/dist/swup.min.js"></script>
        <script defer src="https://unpkg.com/minimasonry@latest/build/minimasonry.min.js"></script>
        <script defer src="${srcPath}/js/index.js"></script>

        <title>Tomila Katsman</title>
    </head>
    <body>
        <header id="header" class="header">
            <a class="header-logo-link" href="${srcPath}/portfolio.html">Tomila Katsman</a>
            <nav class="nav">
                <ul class="nav-list">
                    <li><a class="nav-link" href="/templates/about.html">About</a></li>
                    <li><a class="nav-link" href="/templates/contact.html">Contact</a></li>
                    <li>
                        <a class="nav-link" href="https://www.instagram.com/tomilakatsman/?hl=en">
                            <img class="instagram-logo" src="${srcPath}/assets/svg/logo-instagram.svg" alt="Instagram link">
                        </a>
                    </li>
                </ul>
            </nav>
            <button class="btn-mobile-nav">
                <img src="${srcPath}/assets/svg/menu-sharp.svg" class="icon-mobile-nav" alt="menu-sharp" />
                <img src="${srcPath}/assets/svg/close-sharp.svg" class="icon-mobile-nav" alt="close-sharp" />
            </button>
        </header>
    </body>
</html>
`;

module.exports = layout;