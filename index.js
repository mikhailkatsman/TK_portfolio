// Initialize Swup and listen to page transition events
const swup = new Swup();
console.log('Swup initialized');

// Run init once on page load
init();

// Run init when swup transition occurs, to detect for grids
document.addEventListener('swup:contentReplaced', init);

function init() {
    // Display header if it is currently hidden
    const headerElement = document.getElementById('header');
    const headerStyle = getComputedStyle(headerElement);
    if (window.location.pathname != '/index.html') {
        if (headerStyle.display == 'none') {
            headerElement.style.display = 'flex';
            console.log('Header revealed');
        }
    } 
    // Hide header if /index.html mounts
    else {
        if (headerStyle.display == 'flex') {
            headerElement.style.display = 'none';
            console.log('Header hidden');
        } 
    }

    if (window.location.pathname == '/portfolio.html') {
        console.log('portfolio page detected');

        // calculate viewport width 
        // for grid element positions
        const vw = Math.max(
            document.documentElement.clientWidth || 0, 
            window.innerWidth || 0
        );

        let itemWidth = calcWidth(vw);

        function calcWidth(vw) {
            if (vw < 600) {
                return 130;
            } else return 300;
        }

        // initialise Minimasonry plugin with 
        // appropriate grid-item widths
        var masonry = new MiniMasonry({
            container: '.portfolio-grid',
            baseWidth: itemWidth,
            gutter: 3,
            surroundingGutter: false,
        });

        console.log('masonry grid initialized');

        //load imgs
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

        console.log('imgs loaded')
    }

    else {
        console.log('no grid detected');
    }
}