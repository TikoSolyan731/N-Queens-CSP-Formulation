import * as _ from 'lodash';

import {ChessBoardUtils} from "../utils/ChessBoardUtils";

export class ImprovedMinConflictsSolver {
    readonly numberOfQueens: number;
    queens: number[] = [];

    readonly negativeDiagonalConflicts: number[];
    readonly positiveDiagonalConflicts: number[];

    constructor(numberOfQueens: number) {
        this.numberOfQueens = numberOfQueens;

        this.negativeDiagonalConflicts = _.range(0, 2 * numberOfQueens, 0);
        this.positiveDiagonalConflicts = _.range(0, 2 * numberOfQueens, 0);
    }

    public solve() {
        const startTime = Date.now();
        let restartCount = 0;
        while (true) {
            this.queens = this.generatePermutation();
            this.updateDiagonalConflicts();

            let numConflicts = this.getNumDiagonalConflicts();
            let numberOfSwaps = 0;

            if (numConflicts === 0) {
                console.log("Found a solution");
                console.log(this.queens);
                console.log('COMPLETED IN ' + numberOfSwaps + ' SWAPS');
                console.log('EXECUTION TIME: ' + (Date.now() - startTime) + 'ms');

                return;
            }

            for (let i = 0; i < this.queens.length; i++) {
                for (let j = i + 1; j < this.queens.length; j++) {
                    if (numConflicts === 0) {
                        console.log("Found a solution");
                        console.log(this.queens);
                        console.log(`COMPLETED IN ${numberOfSwaps} SWAPS AND ${restartCount} RESTARTS`);
                        console.log('EXECUTION TIME: ' + (Date.now() - startTime) + 'ms');

                        return;
                    }

                    if (
                        this.isQueenAttacked(this.queens[i], i) ||
                        this.isQueenAttacked(this.queens[j], j)
                    ) {
                        const temp = this.queens[i];
                        this.queens[i] = this.queens[j];
                        this.queens[j] = temp;

                        const { conflicts: newNumConflicts, diagonalData } = this.calculateNumDiagonalConflicts();
                        if (newNumConflicts < numConflicts) {
                            this.updateDiagonalConflicts(diagonalData);

                            numConflicts = newNumConflicts;
                            numberOfSwaps++;
                            console.log('SWAP ' + numberOfSwaps);
                        } else {
                            this.queens[j] = this.queens[i];
                            this.queens[i] = temp;
                        }
                    }
                }
            }

            restartCount++;
        }
    }

    private isQueenAttacked(col: number, row: number): boolean {
        return this.negativeDiagonalConflicts[col + row - 2] !== 0 || this.positiveDiagonalConflicts[col - row + 7] !== 0;
    }

    private updateDiagonalConflicts(diagonalData?: {pos: {}, neg: {}}) {
        const data = diagonalData !== undefined ? diagonalData : ChessBoardUtils.numberOfPiecesOnTheSameDiagonal(this.queens);
        Object.entries(data.neg).forEach(([index, numberOfQueens]) => {
            this.negativeDiagonalConflicts[index] = (numberOfQueens as number) - 1;
        });
        Object.entries(data.pos).forEach(([index, numberOfQueens]) => {
            this.positiveDiagonalConflicts[index] = (numberOfQueens as number) - 1;
        });
    }

    private getNumDiagonalConflicts(): number {
        let sum = 0;

        for (const num of this.positiveDiagonalConflicts) {
            if (!num) continue;

            sum += num;
        }
        for (const num of this.negativeDiagonalConflicts) {
            if (!num) continue;

            sum += num;
        }
        return sum;
    }

    private calculateNumDiagonalConflicts(): {
        conflicts: number,
        diagonalData: {
            neg: {},
            pos: {}
        }
    } {
        const diagonalData = ChessBoardUtils.numberOfPiecesOnTheSameDiagonal(this.queens);

        let sum = 0;
        for (const num of Object.values(diagonalData.neg)) {
            if (!num) continue;

            sum += ((num as number) - 1);
        }
        for (const num of Object.values(diagonalData.pos)) {
            if (!num) continue;

            sum += ((num as number) - 1);
        }

        return {
            conflicts: sum,
            diagonalData
        }
    }

    private generatePermutation(): number[] {
        const range = _.range(1, this.numberOfQueens + 1);
        return _.shuffle(range);
    }
}