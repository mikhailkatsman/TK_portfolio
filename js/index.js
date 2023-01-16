// Initialize Swup and listen to transition events
const swup = new Swup()
document.addEventListener('swup:animationInStart', manipulateHeader)
document.addEventListener('swup:popState', manipulateHeader)
document.addEventListener('swup:contentReplaced', initMasonry)

// Run functions once on page reload
manipulateHeader()
initMasonry()

// initialise Minimasonry plugin
function initMasonry () {
    if (!document.querySelector('.portfolio-grid')) {
        return
    }

    console.log('portfolio grid detected')
    var msnry = new window.Masonry('.portfolio-grid', {
        itemSelector: '.portfolio-grid__item',
    })
    console.log('MiniMasonry initialized')

    // loadGridImgs();
}

// Show header if page has no .index-container present
function manipulateHeader () {
    document
        .getElementById('header')
        .classList.toggle(
        'header--active',
        !(window.location.pathname.includes('/index.html')
            || window.location.pathname === '/')
    )
}

function calcItemWidth () {
    // calculate viewport width
    const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
    )

    // calculate grid item width
    let itemWidth
    switch (true) {
        case vw < 430:
            itemWidth = 90
            break
        case vw < 600:
            itemWidth = 130
            break
        case vw < 900:
            itemWidth = 200
            break
        default:
            itemWidth = 300
    }

    return itemWidth
}

// // Load image data into the grid
// function loadGridImgs() {
//     let extRegex = /\.(webp|mp4)$/i;

//     for (let i = 1; i <= 32; i++) { // 32 is hardcoded, would prefer to read length of directory
//         let gridItem = document.getElementById(`grid-item-${i}`);
//         let itemSpan = document.getElementById(`item-span-${i}`);

//         let preloaderImg = new Image();
//         preloaderImg.src = `../assets/grid-img/${i}.webp`;

//         preloaderImg.addEventListener('load', function() {
//             gridItem.style.backgroundImage = `url(${preloaderImg.src})`;
//             itemSpan.style.opacity = '0';
//             preloaderImg = null;
//         });
//     }

//     console.log('imgs loaded');
// }

// Nav Button operation
const btnNavElement = document.querySelector('.btn-mobile-nav')
const headerElement = document.querySelector('.header')

btnNavElement.addEventListener('click', function () {
    headerElement.classList.toggle('nav-open')
    headerElement.classList.toggle('header--tall')
})
