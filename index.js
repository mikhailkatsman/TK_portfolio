// Initialize Swup and listen to transition events
const swup = new Swup();
document.addEventListener('swup:animationInStart', manipulateHeader);
document.addEventListener('swup:popState', manipulateHeader);
document.addEventListener('swup:contentReplaced', initMasonry);

// Run functions once on page reload
manipulateHeader();
initMasonry();

// initialise Minimasonry plugin
function initMasonry() {
    if(!document.querySelector('.portfolio-grid')){
        return;
    }

    console.log('portfolio grid detected');
    var masonry = new MiniMasonry({
        container: '.portfolio-grid',
        baseWidth: calcItemWidth(),
        gutter: 3,
        surroundingGutter: false,
    });

    console.log('MiniMasonry initialized');

    loadGridImgs();
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

// Nav Button operation
const btnNavElement = document.querySelector(".btn-mobile-nav");
const headerElement = document.querySelector(".header");

btnNavElement.addEventListener("click", function () {
  headerElement.classList.toggle("nav-open");
  headerElement.classList.toggle("header--tall");
});