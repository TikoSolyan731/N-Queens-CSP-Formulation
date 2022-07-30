import * as _ from "lodash";

import {CspProblem, CspVariable} from "../csp/CspProblem";

export class MinConflictsSolver {
    public static solve(problem: CspProblem<any>, threshold: number) {
        const startTime = Date.now();
        problem.generateRandomAssignment();

        for (let i = 0; i < threshold; i++) {
            console.log("STEP " + (i + 1));
            if (problem.isCurrentAssignmentSolution()) {
                console.log("Found a solution");
                console.log(JSON.stringify(problem.currentAssignment(), null, 2));
                console.log('EXECUTION TIME: ' + (Date.now() - startTime) + 'ms');
                return;
            }
            console.log("No solution yet");

            const conflictedVariable = problem.randomConflictedVariable();
            const valuesAndConflictCounts: { value: any, conflicts: number }[] = [];
            conflictedVariable.domain.values.forEach(possibleValue => {
                valuesAndConflictCounts.push({
                    value: possibleValue,
                    conflicts: MinConflictsSolver.conflicts(problem, conflictedVariable, possibleValue)
                });
            });

            const minConflictValue = _.minBy(valuesAndConflictCounts, ({conflicts}) => conflicts).value;
            problem.applyAssignment(conflictedVariable, minConflictValue);
        }
        console.log('EXECUTION TIME: ' + (Date.now() - startTime) + 'ms');
    }

    private static conflicts(problem: CspProblem<any>, variable: CspVariable<any>, value: any): number {
        return problem.numberOfConflictingVariables([{variable, value}]);
    }
}