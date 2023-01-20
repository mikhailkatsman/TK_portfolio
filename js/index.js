/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// Initialize Swup and listen to transition events
const swup = new Swup()
document.addEventListener('swup:animationInStart', manipulateHeader)
document.addEventListener('swup:popState', manipulateHeader)
document.addEventListener('swup:pageView', initMasonry)

// Run functions once on page reload
manipulateHeader()
initMasonry()

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

        let media = gridItem.querySelector('img, video')
        if (media.nodeName === 'IMG') {
            if(!media.complete) {
                media.addEventListener('load', function () {
                    media.classList.add("data-loaded")
                    console.log(`img ${i} loaded`)
                })
            } else {
                media.classList.add("data-loaded")
                console.log(`img ${i} already loaded`)
            }
        }
        else if (media.nodeName === 'VIDEO') {
            media.addEventListener('loadeddata', function () {
                media.classList.add("data-loaded")
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
