const divMatch = document.getElementById("match");

let intervalId;
let index = 0;
let pressedPlayButton = 1;
let pressedReplayButton = 0;

let pieces = [];
let leftTopCoords = [];
const finalPositions = [
    { X: 525, Y: 178 },
    { X: 280, Y: 231 },
    { X: 482, Y: 327 },
    { X: 507, Y: 255 },
    { X: 422, Y: 233 },
    { X: 465, Y: 137 },
    { X: 367, Y: 180 },
    { X: 466, Y: 221 },
    { X: 404, Y: 404 },
    { X: 359, Y: 309 },
    { X: 553, Y: 399 },
    { X: 343, Y: 249 }
];
const euclideanDistances = [
    115.00434774390054,
    142.01408380861386,
    112.05802068571441,
    87.80091115700337,
    0,
    105.19030373565806,
    75.66372975210778,
    46.84015371452148,
    171.8429515575195,
    98.54195795277518,
    211.463944917331,
    80.60397012554654,
];

document.getElementById("animate").addEventListener("click", moveImageToFinalPosition);
document.getElementById("replay").addEventListener("click", replayGame);
document.getElementById("play").addEventListener("click", playGame);

function playGame() {
    if (pressedPlayButton) {
        document.getElementById("finish").innerHTML = "Úlohou je poskladať mapu Francúzska";

        initGame();
        startTimeout();
        pressedPlayButton = 0;
    }
}

function startTimeout()
{
    let sec = 0;

    intervalId = setInterval( function() {
        document.getElementById("timer").innerHTML = "<span id=\"minutes\"></span>:<span id=\"seconds\"></span>";
        document.getElementById("seconds").innerHTML = generateClock(sec++ % 60);
        document.getElementById("minutes").innerHTML = generateClock(parseInt(sec / 60,10).toString());
    }, 1000);

}

function generateClock (val)
{
    return val > 9 ? val : "0" + val;
}

function stopTimeout() {
    clearInterval(intervalId);
}

function fillDiv() {
    for (let i = 0; i < 12; i++) {
        divMatch.appendChild(pieces[i]);
    }
}

function regenerateCoords() {
    for(let i = 0; i < pieces.length; i++) {
        const randomCoords = calculateRandomCoords(pieces[i]);

        if (window.innerWidth <= 490) {
            pieces[i].style.top = (280 + randomCoords[1]) + 'px';
        } else {
            pieces[i].style.top = (140 + randomCoords[1]) + 'px';
        }
        pieces[i].style.left = (50 + randomCoords[0]) + 'px';

    }
}

function fillPuzzlePieces() {
    pieces = [];

    for (let i = 0; i < 12; i++) {
        const image = document.createElement("img");
        const randomCoords = calculateRandomCoords(image);

        image.id = i.toString();
        image.className = "piece";
        image.alt = "France";
        if (window.innerWidth <= 490) {
            image.style.top = (260 + randomCoords[1]) + 'px';
        } else {
            image.style.top = (140 + randomCoords[1]) + 'px';
        }
        image.style.left = (50 + randomCoords[0]) + 'px';
        image.setAttribute("draggable", "true");

        pieces.push(image);
    }

    pieces[0].src = "../images/puzzle_france/grand-est.png";
    pieces[1].src = "../images/puzzle_france/brittany.png";
    pieces[2].src = "../images/puzzle_france/auvergne-rhone-alpes.png";
    pieces[3].src = "../images/puzzle_france/bourgogne.png";
    pieces[4].src = "../images/puzzle_france/centre-val-de-loire.png";
    pieces[5].src = "../images/puzzle_france/hauts-de-france.png";
    pieces[6].src = "../images/puzzle_france/normandy.png";
    pieces[7].src = "../images/puzzle_france/paris.png";
    pieces[8].src = "../images/puzzle_france/occitanie.png";
    pieces[9].src = "../images/puzzle_france/nouvelle-acquitaine.png";
    pieces[10].src = "../images/puzzle_france/provence-alpes-cote.png";
    pieces[11].src = "../images/puzzle_france/pays-de-la-loire.png";
}

function calculateRandomCoords()
{
    const x = Math.floor(Math.random() * (window.innerWidth/1.3));
    const y = Math.floor( 60 + Math.random() * (window.innerHeight/1.9));

    return [ x , y ];
}

function initGame()
{
    fillPuzzlePieces();
    fillDiv();
    fillArrayOfLeftTopCoords(pieces);

    for (let index = 0; index < pieces.length; index++) {
        pieces[index].onmousedown = function (event) {

            let shiftX = event.clientX - pieces[index].getBoundingClientRect().left;
            let shiftY = event.clientY - pieces[index].getBoundingClientRect().top;

            document.body.append(pieces[index]);

            moveAt(event.pageX, event.pageY);

            function moveAt(pageX, pageY) {
                pieces[index].style.left = pageX - shiftX + 'px';
                pieces[index].style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            pieces[index].onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                pieces[index].onmouseup = null;

                fillArrayOfLeftTopCoords(pieces);

                const calculatedDistances = calculateEuclideanDistanceFromCenter();
                checkRightPositions(calculatedDistances);
            };

        };
        pieces[index].ondragstart = function () {
            return false;
        };
    }
}

function fillArrayOfLeftTopCoords(pieces)
{
    leftTopCoords = [];

    for(let index = 0; index < pieces.length; index++) {
        const coords = getImageCoords(pieces[index]);
        leftTopCoords.push({ X: coords.X, Y: coords.Y });
    }
    return leftTopCoords;
}

function replayGame()
{
    pressedReplayButton = 1;
    document.getElementById("finish").innerHTML = "Úlohou je poskladať mapu Francúzska";
    stopTimeout();
    regenerateCoords();
    startTimeout();
}

function moveImageToFinalPosition()
{
    if (index === leftTopCoords.length) {
        index = 0;
        return;
    }
    fillArrayOfLeftTopCoords(pieces);

    if (pressedReplayButton) {
        pressedReplayButton = 0;
        index = 0;
    }
    let elem = pieces[index];

    const id = setInterval(() => {
        if (leftTopCoords[index].X === finalPositions[index].X && leftTopCoords[index].Y === finalPositions[index].Y) {
            clearInterval(id);
            index++;
            moveImageToFinalPosition();
        } else {

            if ((leftTopCoords[index].Y - finalPositions[index].Y > 0)) {
                leftTopCoords[index].Y--;
                elem.style.top = leftTopCoords[index].Y + 'px';
            }
            if ((leftTopCoords[index].Y - finalPositions[index].Y < 0)) {
                leftTopCoords[index].Y++;
                elem.style.top = leftTopCoords[index].Y + 'px';
            } else if (leftTopCoords[index].X - finalPositions[index].X > 0) {
                leftTopCoords[index].X--;
                elem.style.left = leftTopCoords[index].X + 'px';
            } else if (leftTopCoords[index].X - finalPositions[index].X < 0) {
                leftTopCoords[index].X++;
                elem.style.left = leftTopCoords[index].X + 'px';
            }
        }
    }, 3);

    if (pressedPlayButton) {
        document.getElementById("finish").innerHTML = "Úlohou je poskladať mapu Francúzska";
    } else {
        document.getElementById("finish").innerHTML = "Nápoveda";
    }
    stopTimeout();
}

function calculateEuclideanDistanceFromCenter()
{
    let distances = [];
    const centreCoords = leftTopCoords[4];

    for(let index = 0; index < leftTopCoords.length; index++) {
        const diffX = Math.pow(centreCoords.X - leftTopCoords[index].X, 2);
        const diffY = Math.pow(centreCoords.Y - leftTopCoords[index].Y, 2);

        distances.push(Math.sqrt(diffX + diffY));
    }
    return distances;
}

function checkRightPositions(array)
{
    let counter = 0;

    for(let i = 0; i < euclideanDistances.length; i++) {
        const roundedValue = Math.round(euclideanDistances[i]);

        if ((array[i] <= roundedValue + 6) && (array[i] >= roundedValue - 6)) {
            counter++;
            console.log(pieces[i])
            if (counter === 12) {
                document.getElementById("finish").innerHTML = "Hra skončená!";
                stopTimeout();
            } else {
                document.getElementById("finish").innerHTML = "Úlohou je poskladať mapu Francúzska";
            }
        }
    }
}

function getImageCoords(obj)
{
    let left = 0;
    let top = 0;

    if (obj.offsetParent) {
        do {
            left += obj.offsetLeft;
            top += obj.offsetTop;
        } while (obj === obj.offsetParent);

        return { X: left, Y: top };
    }
}

