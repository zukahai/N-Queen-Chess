game_W = 0, game_H = 0;
sizeChess = sizeBlock = 0;
Xalignment = Yalignment = 0;

let QueenIM = new Image();
QueenIM.src = "images/queen.png";
xQueen = yQueen = 3;
xQueen2 = yQueen2 = 0;
typeMove = 0;
N = 8;
data = Array.from(new Array(N), () => Array.from(new Array(N), () => 0));
win = false;
step = 1;


class game {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.init();
    }

    init() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.chessBoard = new chessboard(this);
        this.render();
        this.randomData();

        this.loop();

        this.listenMouse();
        this.listenTouch();
    }

    listenTouch() {
        document.addEventListener("touchmove", evt => {

        })

        document.addEventListener("touchstart", evt => {

        })

        document.addEventListener("touchend", evt => {

        })
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            if (win)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            let Y = Math.floor((x - Xalignment) / sizeBlock);
            let X = Math.floor((y - Yalignment) / sizeBlock);
            console.log(X, ' ', Y);
            if (data[X][Y] == 1) {
                console.log("Hello");
                typeMove = 1;
                xQueen2 = x;
                yQueen2 = y;
            }
        })

        document.addEventListener("mousemove", evt => {
            if (win)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            if (x <= Xalignment + sizeBlock / 2)
                x = Xalignment + sizeBlock / 2;
            if (y <= Yalignment + sizeBlock / 2)
                y = Yalignment + sizeBlock / 2;
            if (x >= Xalignment + sizeChess - sizeBlock / 2)
                x = Xalignment + sizeChess - sizeBlock / 2;
            if (y >= Yalignment + sizeChess)
                y = Yalignment + sizeChess - sizeBlock / 2;
            console.log(typeMove);
            if (typeMove == 1) {
                xQueen2 = x;
                yQueen2 = y;
            }
        })

        document.addEventListener("mouseup", evt => {
            if (win)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            let Y = Math.floor((xQueen2 - Xalignment) / sizeBlock);
            let X = Math.floor((yQueen2 - Yalignment) / sizeBlock);

            // console.log(X, ' ', Y, ' ', xKNight, ' ', yKNight);

            if (typeMove == 1 && data[X][Y] == 0) {
                xQueen = X;
                yQueen = Y;
                data[X][Y] = 1;
            }
            typeMove = 0;
        })
    }

    isPoint(x, y) {
        if (x < 0)
            return false;
        if (y < 0)
            return false;
        if (x >= N)
            return false;
        if (y >= N)
            return false;
        return true;
    }

    loop() {
        this.update();
        this.draw();
        setTimeout(() => this.loop(), 30);
    }

    update() {
        this.render();
    }

    render() {
        if (this.canvas.width != document.documentElement.clientWidth || this.canvas.height != document.documentElement.clientHeight) {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
            game_W = this.canvas.width;
            game_H = this.canvas.height;

            let min = this.canvas.width;
            if (this.canvas.height < min)
                min = this.canvas.height;

            sizeBlock = min / (N + 2);
            sizeChess = N * sizeBlock;

            Xalignment = (game_W - min) / 2 + sizeBlock;
            Yalignment = (game_H - min) / 2 + 3 * sizeBlock / 2;
            if (game_W < game_H)
                Yalignment = (game_H - min) / 2 + sizeBlock;
        }
    }

    randomData() {
        data = Array.from(new Array(N), () => Array.from(new Array(N), () => 0));
        data[0] = Array.from(new Array(N), () => 1);
        console.log(data);
    }

    draw() {
        this.clearScreen();
        this.chessBoard.draw();
        this.drawQueen(typeMove);
        this.drawText();
    }
    drawText() {
        this.context.font = this.getSize() / 1.5 + 'px Arial Black';
        this.context.fillStyle = "#FF00CC";
        let s = " steps"
        if (step < 2)
            s = " step"
        this.context.textAlign = "center";
        this.context.fillText(step + s + " left to get to the red box", game_W / 2, Yalignment - sizeBlock / 2);
    }

    drawQueen(type) {
        let R = sizeBlock / 1.2;
        for (let i = 0; i < N; i++)
            for (let j = 0; j < N; j++)
                if (data[i][j] == 1) {
                    let X = Xalignment + j * sizeBlock + (sizeBlock - R) / 2;
                    let Y = Yalignment + i * sizeBlock + (sizeBlock - R) / 2;
                    this.context.drawImage(QueenIM, X, Y, R, R);
                }
        if (type == 1) {
            this.context.drawImage(QueenIM, xQueen2 - R / 2, yQueen2 - R / 2, R, R);
        }

    }

    clearScreen() {
        this.context.clearRect(0, 0, game_W, game_H);
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, game_W, game_H);
    }

    getSize() {
        var area = game_W * game_H;
        return Math.sqrt(area / 300);
    }
}

var g = new game();