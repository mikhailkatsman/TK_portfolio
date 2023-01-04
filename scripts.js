const options = {
    containers: [
    "#index-main",
    "#portfolio-glry"
    ],
};

const swup = new Swup(options);

document.addEventListener('swup:contentReplaced', init);
document.addEventListener('swup:willReplaceContent', unload);

function init() {
    if (document.querySelector('.portfolio-grid')) {
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
            gutter: 4,
            surroundingGutter: false
        });

        masonry.layout();
    }
}

function unload() {
    if (document.querySelector('.portfolio-grid')) {
        masonry.destroy();
    }
}


