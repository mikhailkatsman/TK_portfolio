// Initialize Swup and listen to page transition events
const swup = new Swup();
document.addEventListener('swup:animationInStart', manipulateHeader);
document.addEventListener('swup:popState', manipulateHeader);
document.addEventListener('swup:contentReplaced', function() {
    if (window.location.pathname.includes('/portfolio.html')) {
        console.log('portfolio page detected');
        initMasonry();
        loadGridImgs();
    }
});

// Run functions once on page reload
manipulateHeader();
initMasonry();
loadGridImgs();

// initialise Minimasonry plugin
function initMasonry() {
    var masonry = new MiniMasonry({
        container: '.portfolio-grid',
        baseWidth: calcItemWidth(),
        gutter: 3,
        surroundingGutter: false,
    });

    console.log('masonry grid initialized');
}

// Show header if page is not '/index.html'
// And hide header if page is '/index.html' or '/'
function manipulateHeader() {
    document.getElementById('header')
        .classList.toggle(
            'header--active', 
            !(window.location.pathname.includes('/index.html') 
            || window.location.pathname === '/')
    );
}

// Load image data into the grid
function loadGridImgs() {
    for (let i = 1; i <= 32; i++) {
        let imgPath = `img/grid-img/${i}.webp`;
        let gridItem = document.getElementById(`grid-item-${i}`);
        let itemSpan = document.getElementById(`item-span-${i}`);

        let preloaderImg = document.createElement('img');
        preloaderImg.src = imgPath;
        
        preloaderImg.addEventListener('load', function() {
            gridItem.style.backgroundImage = `url(${imgPath})`;
            itemSpan.style.opacity = '0';
            preloaderImg = null;
        });
    }

    console.log('imgs loaded');
}

function calcItemWidth() {
    // calculate viewport width 
    const vw = Math.max(
        document.documentElement.clientWidth || 0, 
        window.innerWidth || 0
    );

    // calculate grid item width
    let itemWidth;
    switch (true) {
        case vw < 430:
            itemWidth = 90;
            break;
        case vw < 600:
            itemWidth = 130;
            break;
        case vw < 900:
            itemWidth = 200;
            break;
        default:
            itemWidth = 300;
    }

    return itemWidth;
}