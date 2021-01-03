// let's think our stage virtual size will be 1000x1000px
// but the real size will be different to fit user's page
// so the stage will be 100% visible on any device
var width = window.innerWidth;
var height = window.innerHeight;

const timer = document.getElementById('stopwatch');

var hr = 0;
var min = 0;
var sec = 0;
var stoptime = true;

function startTimer() {
    if (stoptime == true) {
        stoptime = false;
        timerCycle();
    }
}
function stopTimer() {
    if (stoptime == false) {
        stoptime = true;
    }
}

function timerCycle() {
    if (stoptime == false) {
        sec = parseInt(sec);
        min = parseInt(min);
        hr = parseInt(hr);

        sec = sec + 1;

        if (sec == 60) {
            min = min + 1;
            sec = 0;
        }
        if (min == 60) {
            hr = hr + 1;
            min = 0;
            sec = 0;
        }

        if (sec < 10 || sec == 0) {
            sec = '0' + sec;
        }
        if (min < 10 || min == 0) {
            min = '0' + min;
        }
        if (hr < 10 || hr == 0) {
            hr = '0' + hr;
        }

        timer.innerHTML = hr + ':' + min + ':' + sec;

        setTimeout("timerCycle()", 1000);
    }
}

function resetTimer() {
    timer.innerHTML = '00:00:00';
}

var sources = {
    gumkac: "gumkac2.png",
    pierko: "pierko.png",
    pierko_glow: "pierko_glow.png",
    pierko_black: "pierko_black.png",
    usko: 'usko.png',
    usko_glow: 'usko_glow.png',
    usko_black: 'usko_black.png',
    bag: 'bag.png',
    bag_glow: 'bag_glow.png',
    bag_black: 'bag_black.png',
    rukav: 'rukav.png',
    rukav_glow: 'rukav_glow.png',
    rukav_black: 'rukav_black.png',
    usta: 'usta.png',
    usta_glow: 'usta_glow.png',
    usta_black: 'usta_black.png',
    ruka: 'ruka.png',
    ruka_glow: 'ruka_glow.png',
    ruka_black: 'ruka_black.png',
    slapka: 'slapka.png',
    slapka_glow: 'slapka_glow.png',
    slapka_black: 'slapka_black.png',
    noha: 'noha.png',
    noha_glow: 'noha_glow.png',
    noha_black: 'noha_black.png',
};
var gumkaci = {
    pierko: {
        x: 305,
        y: 280,
    },
    rukav: {
        x: 70,
        y: 450,
    },
    bag: {
        x: 275,
        y: 100,
    },
    usko: {
        x: 200,
        y: 475,
    },
    usta: {
        x: 245,
        y: 480,
    },
    ruka: {
        x: 10,
        y: 460,
    },
    slapka: {
        x: 130,
        y: 470,
    },
    noha: {
        x: 275,
        y: 190,
    },
};

var outlines = {
    pierko_black: {
        x: 124.5,
        y: 50,
    },
    rukav_black: {
        x: 21,
        y: 217,
    },
    bag_black: {
        x: 169,
        y: 310,
    },
    usko_black: {
        x: 158,
        y: 129,
    },
    usta_black: {
        x: 101,
        y: 191,
    },
    ruka_black: {
        x: 129,
        y: 233,
    },
    slapka_black: {
        x: 150,
        y: 411,
    },
    noha_black: {
        x: 69,
        y: 374,
    },
};

$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
})

function loadImages(sources, callback) {
    var assetDir = "../images/puzzle_gumkac/";
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
function isNearOutline(animal, outline) {
    var a = animal;
    var o = outline;
    var ax = a.x();
    var ay = a.y();

    if (ax > o.x - 20 && ax < o.x + 20 && ay > o.y - 20 && ay < o.y + 20) {
        return true;
    } else {
        return false;
    }
}
function drawBackground(background, gumkac, text) {
    var context = background.getContext();

    context.drawImage(gumkac, 20, 50);
    context.setAttr('font', '20pt Calibri');
    context.setAttr('textAlign', 'center');
    context.setAttr('fillStyle', 'black');
    context.fillText(text, background.getStage().width() / 2, 40);
}

function initStage(images) {
    var stage = new Konva.Stage({
        container: 'container',
        width: 358,
        height: 550,
    });
    var background = new Konva.Layer();
    var gumkacLayer = new Konva.Layer();
    var gumkacShapes = [];
    var score = 0;

    // image positions


    // create draggable animals
    for (var key in gumkaci) {
        // anonymous function to induce scope
        (function () {
            var privKey = key;
            var anim = gumkaci[key];

            var gumkac = new Konva.Image({
                image: images[key],
                name: key,
                x: anim.x,
                y: anim.y,
                draggable: true,
            });

            gumkac.on('dragstart', function () {
                startTimer()
                this.moveToTop();
                gumkacLayer.draw();
            });
            /*
             * check if animal is in the right spot and
             * snap into place if it is
             */
            gumkac.on('dragend', function () {
                var outline = outlines[privKey + '_black'];
                if (!gumkac.inRightPlace && isNearOutline(gumkac, outline)) {
                    gumkac.position({
                        x: outline.x,
                        y: outline.y,
                    });
                    gumkacLayer.draw();
                    gumkac.inRightPlace = true;

                    if (++score >= 8) {
                        stopTimer()
                        var text = 'Vyhral si!';

                        drawBackground(background, images.gumkac, text);
                    }

                    // disable drag and drop
                    setTimeout(function () {
                        gumkac.draggable(false);
                    }, 50);
                }
            });
            // make animal glow on mouseover
            gumkac.on('mouseover', function () {
                gumkac.image(images[privKey + '_glow']);
                gumkacLayer.draw();
                document.body.style.cursor = 'pointer';
            });
            // return animal on mouseout
            gumkac.on('mouseout', function () {
                gumkac.image(images[privKey]);
                gumkacLayer.draw();
                document.body.style.cursor = 'default';
            });

            gumkac.on('dragmove', function () {
                document.body.style.cursor = 'pointer';
            });

            gumkacLayer.add(gumkac);
            gumkacShapes.push(gumkac);


        })();


    }
    // var amplitude = 100;
    // var period = 2000;
    // // in ms
    // var centerX = stage.width() / 2;
    // var angularSpeed = 90;
    // for (var key in animals) {
    //     var outline = outlines[key + '_black']
    //     var orig = animals[key]
    //
    //     animalShapes.forEach((image, index) => {
    //         console.log(image.attrs.name)
    //         if (image.attrs.name == key){
    //             var anime = new Konva.Animation(function(frame) {
    //                 image.x(
    //                     amplitude * Math.sin((frame.time * 2 * Math.PI) / period) + outline.x
    //                 );
    //                 image.y(
    //                     amplitude * Math.sin((frame.time * 2 * Math.PI) / period) + outline.y
    //                 );
    //
    //             }, animalLayer);
    //
    //             anime.start();
    //             }
    //         })
    //     }




    // animalShapes.forEach((image, index) => {
    //
    //     var anime = new Konva.Animation(function(frame) {
    //     image.x(
    //         amplitude * Math.sin((frame.time * 2 * Math.PI) / period) + centerX
    //     );
    //
    //     }, animalLayer);
    //
    //     anime.start();
    // });
    // create animal outlines
    for (var key in outlines) {
        // anonymous function to induce scope
        (function () {
            var imageObj = images[key];
            var out = outlines[key];

            var outline = new Konva.Image({
                image: imageObj,
                x: out.x,
                y: out.y,
            });

            gumkacLayer.add(outline);
        })();
    }

    stage.add(background);
    stage.add(gumkacLayer);

    drawBackground(
        background,
        images.gumkac,
        ''
    );

}


loadImages(sources, initStage);
function myMove() {
    var elem = gumkaci.pierko
    var posx = elem.x
    var posy = elem.y
    var id = setInterval(frame, 10);
    function frame() {
        if (posx == outlines.pierko_black.x && posy == outlines.pierko_black.y) {
            console.log("som tam")
            clearInterval(id);
        } else {
            posx = calcMove(posx,outlines.pierko_black.x)
            posy = calcMove(posy,outlines.pierko_black.y)

            console.log()
            elem.x = posx + 'px';
            elem.y = posy + 'px';
            gumkaci.pierko.x = elem.x
            gumkaci.pierko.y = elem.y
        }
    }
}
function calcMove(pos,black_pos) {
    if (pos == black_pos){
        return pos;
    }
    if (pos < black_pos){
        pos =  0.5
    }
    else {
        pos = - 0.5
    }
    return pos;
}
var basicTimeline = anime.timeline({
    autoplay: false,
    easing: 'linear',
});


basicTimeline
    .add({
        targets: ".bag",
        duration: 500,
        translateX: -113,
        translateY: 95.5
    })
    .add({
        targets: ".noha",
        duration: 500,
        translateX: -294,
        translateY: 158
    })
    .add({
        targets: ".pierko",
        duration: 500,
        translateX: -321,
        translateY: -173.5
    })
    .add({
        targets: ".ruka",
        duration: 500,
        translateX: 108.5,
        translateY: -229.5

    })
    .add({
        targets: ".rukav",
        duration: 500,
        translateX: -52.5,
        translateY: -233
    })
    .add({
        targets: ".slapka",
        duration: 500,
        translateX: 10.5,
        translateY: -62
    })
    .add({
        targets: ".usko",
        duration: 500,
        translateX: -45.5,
        translateY: -341
    })
    .add({
        targets: ".usta",
        duration: 500,
        translateX: -135,
        translateY: -287
    })

$("#start").click(function () {
    basicTimeline.play();
});

var resetTimeline = anime.timeline({
    autoplay: false,
    duration: 0
});


resetTimeline
    .add({
        targets: ".bag",
        translateX: 0,
        translateY: 0
    })
    .add({
        targets: ".noha",
        translateX: 0,
        translateY: 0
    })
    .add({
        targets: ".pierko",
        translateX: 0,
        translateY: 0
    })
    .add({
        targets: ".ruka",
        translateX: 0,
        translateY: 0

    })
    .add({
        targets: ".rukav",
        translateX: 0,
        translateY: 0
    })
    .add({
        targets: ".slapka",
        translateX: 0,
        translateY: 0
    })
    .add({
        targets: ".usko",
        translateX: 0,
        translateY: 0
    })
    .add({
        targets: ".usta",
        translateX: 0,
        translateY: 0
    })
$("#reset").click(function () {
    resetTimeline.play();
});