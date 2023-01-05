const swup = new Swup();

init();

document.addEventListener('swup:contentReplaced', init);

function init() {
    if (document.querySelector('.portfolio-grid')) {
        console.log('grid detected');

        //load imgs
        for (let i = 1; i <= 32; i++) {
            let imgPath = `img/grid-img/${i}.webp`;
            let gridItem = document.getElementById(`grid-item-${i}`);
            gridItem.style.setProperty('background-image', `url(${imgPath})`);
        }

        console.log('imgs loaded')

        // calculate viewport width 
        // for grid element positions
        const vw = Math.max(
            document.documentElement.clientWidth || 0, 
            window.innerWidth || 0
        );

        let itemWidth = calcWidth(vw);

        function calcWidth(vw) {
            if (vw < 600) {
                return 150;
            } else return 300;
        }

        // initialise Minimasonry plugin with 
        // appropriate grid-item widths
        var masonry = new MiniMasonry({
            container: '.portfolio-grid',
            baseWidth: itemWidth,
            gutter: 3,
            surroundingGutter: false,
            wedge: false
        });

        console.log('masonry loaded!');
    }

    else {
        console.log('no grid detected');
    }
}


