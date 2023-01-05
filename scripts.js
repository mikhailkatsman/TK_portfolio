const swup = new Swup();

init();

document.addEventListener('swup:contentReplaced', init);

function init() {
    if (document.querySelector('.portfolio-grid')) {
        console.log('grid detected');

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

        var masonry = new MiniMasonry({
            container: '.portfolio-grid',
            baseWidth: itemWidth,
            gutter: 3,
            surroundingGutter: false
        });

        console.log('masonry loaded!');
    }

    else {
        console.log('no grid detected');
    }
}


