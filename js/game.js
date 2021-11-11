game_W = 0, game_H = 0;
sizeChess = sizeBlock = 0;
Xalignment = Yalignment = 0;

let QueenIM = new Image();
QueenIM.src = "images/queen.png";
let AutoIM = new Image();
AutoIM.src = "images/auto.png";
let preIM = new Image();
preIM.src = "images/pre.png";
let nextIM = new Image();
nextIM.src = "images/next.png";
let reloadIM = new Image();
reloadIM.src = "images/reload.png";
xQueen = yQueen = 3;
xQueen2 = yQueen2 = preX = preY = 0;
typeMove = 0;
N = 4;
ans = [];
data = Array.from(new Array(N), () => Array.from(new Array(N), () => 0));
win = false;
auto = false;
index = 0;

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
        this.createData();

        this.loop();

        this.listenMouse();
        this.listenTouch();
    }

    listenTouch() {
        document.addEventListener("touchmove", evt => {
            var y = evt.touches[0].pageY;
            var x = evt.touches[0].pageX;
            this.mouseMove(x, y);
        })

        document.addEventListener("touchstart", evt => {
            var y = evt.touches[0].pageY;
            var x = evt.touches[0].pageX;
            this.moveDown(x, y);
        })

        document.addEventListener("touchend", evt => {
            this.moveUp();
        })
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;

            this.moveDown(x, y);
            this.preNextAuto(x, y);
        })

        document.addEventListener("mousemove", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            this.mouseMove(x, y);

        })

        document.addEventListener("mouseup", evt => {
            this.moveUp();
        })
    }

    moveUp() {
        if (win || auto)
            return;
        let Y = Math.floor((xQueen2 - Xalignment) / sizeBlock);
        let X = Math.floor((yQueen2 - Yalignment) / sizeBlock);

        if (typeMove == 1) {
            if (data[X][Y] == 0) {
                xQueen = X;
                yQueen = Y;
                data[X][Y] = 1;
            } else {
                data[preX][preY] = 1;
            }
        }
        typeMove = 0;
        let k = this.check();
        this.draw();
        if (k.length == 0) {
            window.alert("Win");
            N++;
            this.canvas.width = 0;
            this.render();
            this.createData();
        }
    }

    preNextAuto(x, y) {
        if (x < Xalignment) {
            index--;
            if (index < 0)
                index = ans.length - 1;
            return;
        }
        if (x > Xalignment + sizeChess) {
            index++;
            if (index >= ans.length)
                index = 0;
            return;
        }
    }

    moveDown(x, y) {
        if (x > game_W - sizeBlock && y < sizeBlock) {
            auto = false;
            this.createData();
            return;
        }


        let w = 1.2 * sizeBlock;
        let h = sizeBlock / 2;
        let X = game_W / 2 - w / 2;
        let Y = Yalignment + sizeChess + sizeBlock / 13;
        if (x >= X && x <= X + w && y >= Y - h && y < Y + h) {
            auto = true;
        }

        if (win || auto)
            return;
        Y = Math.floor((x - Xalignment) / sizeBlock);
        X = Math.floor((y - Yalignment) / sizeBlock);

        if (data[X][Y] == 1) {
            typeMove = 1;
            xQueen2 = x;
            yQueen2 = y;
            preY = Y;
            preX = X;
            data[preX][preY] = 0;
        }
    }

    mouseMove(x, y) {
        if (win || auto)
            return;
        if (x <= Xalignment + sizeBlock / 2)
            x = Xalignment + sizeBlock / 2;
        if (y <= Yalignment + sizeBlock / 2)
            y = Yalignment + sizeBlock / 2;
        if (x >= Xalignment + sizeChess - sizeBlock / 2)
            x = Xalignment + sizeChess - sizeBlock / 2;
        if (y >= Yalignment + sizeChess)
            y = Yalignment + sizeChess - sizeBlock / 2;
        if (typeMove == 1) {
            xQueen2 = x;
            yQueen2 = y;
        }
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
        if (auto) {
            data = Array.from(new Array(N), () => Array.from(new Array(N), () => 0));
            for (let i = 0; i < N; i++)
                data[i][ans[index][i]] = 1;

        }
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

    check() {
        let row = Array.from(new Array(N), () => 0);
        let col = Array.from(new Array(N), () => 0);
        let c1 = Array.from(new Array(2 * N - 1), () => 0);
        let c2 = Array.from(new Array(2 * N - 1), () => 0);
        for (let i = 0; i < N; i++)
            for (let j = 0; j < N; j++)
                if (data[i][j] == 1) {
                    row[i]++;
                    col[j]++;
                    c1[i - j + (N - 1)]++;
                    c2[i + j]++;
                }
        let ans = [];
        for (let i = 0; i < N; i++)
            for (let j = 0; j < N; j++)
                if (data[i][j] == 1 && (row[i] > 1 || col[j] > 1 || c1[i - j + (N - 1)] > 1 || c2[i + j] > 1))
                    ans.push({ x: i, y: j });
        return ans;
    }

    createData() {
        data = Array.from(new Array(N), () => Array.from(new Array(N), () => 0));
        for (let i = 0; i < N; i++)
            data[i][i] = 1;
        ans = new Algorithm(N).listAnswer();
    }

    draw() {
        this.clearScreen();
        this.chessBoard.draw();
        this.drawBackground();
        this.drawQueen(typeMove);
        this.drawText();
        this.drawAuto();
    }

    drawBackground() {
        let k = this.check();
        this.context.fillStyle = "red";
        for (let i = 0; i < k.length; i++) {
            let R = sizeBlock / 2.35;
            let X = Xalignment + k[i].y * sizeBlock + sizeBlock / 2;
            let Y = Yalignment + k[i].x * sizeBlock + sizeBlock / 2;

            this.context.beginPath();
            this.context.arc(X, Y, R, 0, 2 * Math.PI);
            this.context.fill();
        }
    }

    drawAuto() {
        if (!auto) {
            let w = 1.2 * sizeBlock;
            let h = sizeBlock / 2;
            let X = game_W / 2 - w / 2;
            let Y = Yalignment + sizeChess + sizeBlock / 13;
            this.context.drawImage(AutoIM, X, Y, w, h);
        } else {
            this.context.font = this.getSize() / 3 + 'px Arial Black';
            this.context.fillStyle = "#FF00CC";
            this.context.textAlign = "center";
            this.context.fillText((index + 1) + " / " + ans.length, game_W / 2, Yalignment + sizeChess + sizeBlock / 3);
            this.context.drawImage(preIM, Xalignment - sizeBlock * 1.1, Yalignment + sizeChess / 2 - sizeBlock, sizeBlock, sizeBlock * 2);
            this.context.drawImage(nextIM, Xalignment + sizeChess + sizeBlock * 0.1, Yalignment + sizeChess / 2 - sizeBlock, sizeBlock, sizeBlock * 2);
        }
        this.context.drawImage(reloadIM, game_W - sizeBlock, 0, sizeBlock, sizeBlock);
    }

    drawText() {
        this.context.font = this.getSize() / 1.5 + 'px Arial Black';
        this.context.fillStyle = "#FF00CC";

        this.context.textAlign = "center";
        this.context.fillText("Arrange " + N + " queens", game_W / 2, Yalignment / 2);
        this.context.fillText("so that they do not eat each other.", game_W / 2, Yalignment / 2 + this.getSize() / 1.5);
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