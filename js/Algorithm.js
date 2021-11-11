class Algorithm {
    constructor(N) {
        this.n = N;
        this.row = Array.from(new Array(N), () => 0);
        this.col = Array.from(new Array(N), () => 0);
        this.c1 = Array.from(new Array(2 * N - 1), () => 0);
        this.c2 = Array.from(new Array(2 * N - 1), () => 0);
    }

    listAnswer() {
        this.ans = [];
        this.temp = Array.from(new Array(N), () => -1);
        this.NQueen(0);
        return this.ans;
    }

    NQueen(i) {
        for (let j = 0; j < this.n; j++) {
            if (this.row[i] == 0 && this.col[j] == 0 && this.c1[i - j + (N - 1)] == 0 && this.c2[i + j] == 0) {
                // console.log(i, ' ', j);
                this.temp[i] = j;
                this.row[i] = 1;
                this.col[j] = 1;
                this.c1[i - j + (N - 1)] = 1;
                this.c2[i + j] = 1;
                if (i == this.n - 1) {
                    this.ans[this.ans.length] = Array.from(new Array(N), () => 0);
                    for (let index = 0; index < N; index++)
                        this.ans[this.ans.length - 1][index] = this.temp[index];
                } else {
                    this.NQueen(i + 1);
                }
                this.row[i] = 0;
                this.col[j] = 0;
                this.c1[i - j + (N - 1)] = 0;
                this.c2[i + j] = 0;
            }
        }
    }
}