document.addEventListener("DOMContentLoaded", () => {
    function loadImages(sources, callback) {
        var assetDir = "../images/puzzle_terraria/";
        var images = {};
        var loadedImages = 0;
        var numImages = 0;
        for (var src in sources) {
            numImages++;
        }
        for (var src in sources) {
            images[src] = new Image();
            images[src].onload = function () {
                if (++loadedImages >= numImages) {
                    callback(images);
                }
            };
            images[src].src = assetDir + sources[src];
        }
    }

    function isNearOutline(obrazok, outline) {
        var a = obrazok;
        var o = outline;
        var ax = a.x();
        var ay = a.y();

        if (ax > o.x - 20 && ax < o.x + 20 && ay > o.y - 20 && ay < o.y + 20) {
            return true;
        } else {
            return false;
        }
    }

    function drawBackground(background, beachImg, text) {
        var context = background.getContext();
        context.drawImage(beachImg, 0, 0);
        context.setAttr('font', '20pt Calibri');
        context.setAttr('textAlign', 'center');
        context.setAttr('fillStyle', 'black');
        context.fillText(text, background.getStage().width() / 3, 40);
    }

    function initStage(images) {
        var stage = new Konva.Stage({
            container: 'kontainer',
            width: 920,
            height: 443,
        });
        var background = new Konva.Layer();
        var layer = new Konva.Layer();
        var Shapes = [];
        var score = 0;
        var control = 0;

        // image positions
        var obrazky = {
            island: {
                x: 770,
                y: 20,
            },
            mushroom: {
                x: 740,
                y: 20,
            },
            bush: {
                x: 740,
                y: 20,
            },
            flower: {
                x: 740,
                y: 20,
            },
            tree: {
                x: 740,
                y: 20,
            },
            tree2: {
                x: 740,
                y: 20,
            },
            stone: {
                x: 740,
                y: 20,
            },
            island2: {
                x: 740,
                y: 20,
            },
        };

        var outlines = {
            island_black: {
                x: 420,
                y: 53,
            },
            mushroom_black: {
                x: 105,
                y: 397,
            },
            bush_black: {
                x: 558,
                y: 288,
            },
            flower_black: {
                x: 513,
                y: 369,
            },
            tree_black: {
                x: 145,
                y: 107,
            },
            tree2_black: {
                x: 442,
                y: 176,
            },
            stone_black: {
                x: 115,
                y: 285,
            },
            island2_black: {
                x: 80,
                y: 67,
            },


        };

        // create draggable animals
        for (var key in obrazky) {
            // anonymous function to induce scope
            (function () {
                var privKey = key;
                var anim = obrazky[key];

                var obrazok = new Konva.Image({
                    image: images[key],
                    x: anim.x,
                    y: anim.y,
                    draggable: true,
                });


                obrazok.on('dragstart', function () {
                    this.moveToTop();
                    layer.draw();
                    if (control === 0) {
                        console.log(control);
                        ticker.start();
                        control = 1;
                    }
                });

                obrazok.on('dragend', function () {
                    var outline = outlines[privKey + '_black'];
                    if (!obrazok.inRightPlace && isNearOutline(obrazok, outline)) {
                        obrazok.position({
                            x: outline.x,
                            y: outline.y,
                        });
                        layer.draw();
                        obrazok.inRightPlace = true;

                        if (++score >= 8) {
                            var text = 'Výhra po ' + justSomeNumber + ' sekundách';
                            ticker.stop();
                            drawBackground(background, images.pozadie, text);

                        }

                        // disable drag and drop
                        setTimeout(function () {
                            obrazok.draggable(false);
                        }, 50);
                    }
                });

                obrazok.on('mouseover', function () {
                    obrazok.image(images[privKey + '_glow']);
                    layer.draw();
                    document.body.style.cursor = 'pointer';
                });

                obrazok.on('mouseout', function () {
                    obrazok.image(images[privKey]);
                    layer.draw();
                    document.body.style.cursor = 'default';
                });

                obrazok.on('dragmove', function () {
                    document.body.style.cursor = 'pointer';
                });

                layer.add(obrazok);
                Shapes.push(obrazok);
            })();
        }


        for (var key in outlines) {

            (function () {
                var imageObj = images[key];
                var out = outlines[key];

                var outline = new Konva.Image({
                    image: imageObj,
                    x: out.x,
                    y: out.y,
                });

                layer.add(outline);
            })();
        }

        stage.add(background);
        stage.add(layer);

        drawBackground(
            background,
            images.pozadie,
            'Poskladaj obrázok'
        );

        function AdjustingInterval(workFunc, interval, errorFunc) {
            var that = this;
            var expected, timeout;
            this.interval = interval;

            this.start = function () {
                expected = Date.now() + this.interval;
                timeout = setTimeout(step, this.interval);
            }

            this.stop = function () {
                clearTimeout(timeout);
            }

            function step() {
                var drift = Date.now() - expected;
                if (drift > that.interval) {
                    // You could have some default stuff here too...
                    if (errorFunc) errorFunc();
                }
                workFunc();
                expected += that.interval;
                timeout = setTimeout(step, Math.max(0, that.interval - drift));
            }
        }

        var justSomeNumber = 0;

        // Define the work to be done
        var doWork = function () {
            drawBackground(
                background,
                images.pozadie,
                ++justSomeNumber
            );
        };

        // Define what to do if something goes wrong
        var doError = function () {
            console.warn('The drift exceeded the interval.');
        };
        // (The third argument is optional)
        var ticker = new AdjustingInterval(doWork, 1000, doError);


    }

    var sources = {
        pozadie: 'terraria4.png',
        island: 'island.png',
        island_glow: 'island_glow.png',
        island_black: 'island_black.png',
        mushroom: 'mushroom.png',
        mushroom_glow: 'mushroom_glow.png',
        mushroom_black: 'mushroom_black.png',
        bush: 'bush.png',
        bush_glow: 'bush_glow.png',
        bush_black: 'bush_black.png',
        flower: 'flower.png',
        flower_glow: 'flower_glow.png',
        flower_black: 'flower_black.png',
        island2: 'island2.png',
        island2_glow: 'island2_glow.png',
        island2_black: 'island2_black.png',
        stone: 'stone.png',
        stone_glow: 'stone_glow.png',
        stone_black: 'stone_black.png',
        tree: 'tree.png',
        tree_glow: 'tree_glow.png',
        tree_black: 'tree_black.png',
        tree2: 'tree2.png',
        tree2_glow: 'tree2_glow.png',
        tree2_black: 'tree2_black.png',
    };
    loadImages(sources, initStage);
})
