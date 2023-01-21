/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// Initialize Swup and listen to transition events
const swup = new Swup()
document.addEventListener('swup:animationInStart', manipulateHeader)
document.addEventListener('swup:popState', manipulateHeader)
document.addEventListener('swup:contentReplaced', function () {
    initMasonry()
    initGlry()
})

// Run functions once on page reload
manipulateHeader()
initMasonry()
initGlry()

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
                    setTimeout(function () {
                        media.classList.add("data-loaded")
                    }, getRandomInt(0, 500))
                })
            } else {
                setTimeout(function () {
                    media.classList.add("data-loaded")
                }, getRandomInt(0, 500))
            }
        }
        else if (media.nodeName === 'VIDEO') {
            if(!media.complete) {
                media.addEventListener('loadeddata', function () {
                    media.classList.add("data-loaded")
                    console.log(`video ${i} loaded`)
                })
            } else {
                media.classList.add("data-loaded")
                console.log(`video ${i} loaded`)
            }
        }
    }
}

// Generate random integer
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

// Initialize touch controls for shoots view
function initGlry () {
    if (!document.querySelector('.glry-container')) {
        return
    }

    console.log("img-container detected")

    const imgContainer = document.getElementById('img-container')
    const dotsContainer = document.getElementById("dots-container")
    const leftControl = document.getElementById("left-control")
    const rightControl = document.getElementById("right-control")

    const canvas = document.getElementById("canvas")
    var hammer = new Hammer(canvas)
    hammer.on("swipeleft swiperight", function (event) {
        if (event.type === "swipeleft") {
            console.log("Swipe left detected")
            rightControl.click()
        }
        if (event.type === "swiperight") {
            console.log("Swipe right detected")
            leftControl.click()
        }
    })

    let currentIndex = 0;
    let currentImage = imgContainer.children[currentIndex]
    let currentDot = dotsContainer.children[currentIndex]

    currentImage.classList.add("visible")
    currentDot.classList.add("visible")

    leftControl.addEventListener("click", () => {
        currentIndex = Math.max(currentIndex - 1, 0)
        updateCarousel()
    });

    rightControl.addEventListener("click", () => {
        currentIndex = Math.min(currentIndex + 1, imgContainer.children.length - 1)
        updateCarousel()
    });

    function updateCarousel() {
        currentImage.classList.remove("visible")
        currentImage = imgContainer.children[currentIndex]
        currentImage.classList.add("visible")

        currentDot.classList.remove("visible")
        currentDot = dotsContainer.children[currentIndex]
        currentDot.classList.add("visible")
    }
}

// Nav Button operation
const btnNavElement = document.querySelector('.btn-mobile-nav')
const headerElement = document.querySelector('.header')

btnNavElement.addEventListener('click', function () {
    headerElement.classList.toggle('nav-open')
    headerElement.classList.toggle('header--tall')
})
