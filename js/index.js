/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// initialise Minimasonry plugin
function initMasonry () {
    if (!document.querySelector('.portfolio-grid')) {
        return
    }

    console.log('portfolio grid detected')
    const msnry = new Masonry('.portfolio-grid', {
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer',
        itemSelector: '.grid-item',
        percentPosition: true
    })
    console.log('Masonry initialized')

    displayGridData()
}

// Show header if page has no .index-container present
function manipulateHeader () {
    document
        .getElementById('header')
        .classList.toggle(
            'header--active',
            !(window.location.pathname.includes('/index.html') ||
            window.location.pathname.includes('/submit.html') ||
            window.location.pathname.includes('/submit') ||
            window.location.pathname === '/')
        )
}

// Enable smooth transition for loaded elements
function displayGridData () {
    const portfolioGrid = document.getElementById('portfolio-grid')
    for (let i = 1; i <= portfolioGrid.children.length - 2; i++) {
        const gridItem = document.getElementById(`grid-item-${i}`)
        const gridSpan = document.getElementById(`grid-span-${i}`)

        const media = gridItem.querySelector('img, video')
        if (media.nodeName === 'IMG') {
            media.addEventListener('load', function () {
                gridSpan.classList.add("data-loaded")
                console.log(`img ${i} loaded`)
            })
        }
        else if (media.nodeName === 'VIDEO') {
            media.addEventListener('loadeddata', function () {
                gridSpan.classList.add("data-loaded")
                console.log(`video ${i} loaded`)
            })
        }
    }
}

// Nav Button operation
const btnNavElement = document.querySelector('.btn-mobile-nav')
const headerElement = document.querySelector('.header')

btnNavElement.addEventListener('click', function () {
    headerElement.classList.toggle('nav-open')
    headerElement.classList.toggle('header--tall')
})

// Initialize Swup and listen to transition events
const swup = new Swup()
document.addEventListener('swup:animationInStart', manipulateHeader)
document.addEventListener('swup:popState', manipulateHeader, animateBackdrop)
document.addEventListener('swup:contentReplaced', initMasonry)

function animateBackdrop () {
    if (!document.querySelector('.backdrop')) {
        return
    }
    window.setTimeout(function () {
        document.querySelector('.backdrop').classList.add('animate--backdrop');
    }, 500);
}

// Run functions once on page reload
animateBackdrop()
manipulateHeader()
initMasonry()
