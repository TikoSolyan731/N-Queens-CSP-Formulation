import {CspProblem} from "./csp/CspProblem";
import {NQueensProblem} from "./csp/NQueensProblem";
import {ImprovedMinConflictsSolver} from "./solvers/ImprovedMinConflictsSolver";
import {MinConflictsSolver} from "./solvers/MinConflictsSolver";
import * as yargs from "yargs";
import {hideBin} from "yargs/helpers";


function main() {
    const args = yargs(hideBin(process.argv)).argv;

    const numberOfQueens = args['queens'] || 8;
    const algorithm = args['algorithm'] || 'minConflicts';
    const threshold = args['threshold'] || 100;

    if (algorithm === 'minConflicts') {
        const problem: CspProblem<string> = new NQueensProblem(numberOfQueens);
        MinConflictsSolver.solve(problem, threshold);
    } else if (algorithm === 'minConflictsImproved') {
        const solver: ImprovedMinConflictsSolver = new ImprovedMinConflictsSolver(numberOfQueens);
        solver.solve();
    }
}

main();