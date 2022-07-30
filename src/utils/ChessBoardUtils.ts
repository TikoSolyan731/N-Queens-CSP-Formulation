import * as _ from "lodash";

export class ChessBoardUtils {
    static generateChessBoardDomain(n: number): Set<string> {
        return new Set(
            _.range(1, n + 1)
                .flatMap(
                    x => _.range(1, n + 1).map(y => `${x}:${y}`)
                )
        );
    }

    static areTwoQueensAttackingEachOther(firstQueenPos: string, secondQueenPos: string): boolean {
        if (firstQueenPos === secondQueenPos) return true;

        const [firstQueenX, firstQueenY] = firstQueenPos.split(':').map(pos => +pos);
        const [secondQueenX, secondQueenY] = secondQueenPos.split(':').map(pos => +pos);

        if (firstQueenX === secondQueenX) return true;
        if (firstQueenY === secondQueenY) return true;

        return (firstQueenX - firstQueenY === secondQueenX - secondQueenY) ||
            (firstQueenX + firstQueenY === secondQueenX + secondQueenY);
    }

    static numberOfPiecesOnTheSameDiagonal(positions: number[]): {pos: {}, neg: {}} {
        const diagonalData = {
            pos: {},
            neg: {},
        };

        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i] - i;
            const neg = positions[i] + i;

            const posDiagonalNumber = pos + 7;
            const negDiagonalNumber = neg - 2;

            diagonalData.pos[posDiagonalNumber] = (diagonalData.pos[posDiagonalNumber] || 0) + 1;
            diagonalData.neg[negDiagonalNumber] = (diagonalData.neg[negDiagonalNumber] || 0) + 1;
        }

        return diagonalData;
    }
}