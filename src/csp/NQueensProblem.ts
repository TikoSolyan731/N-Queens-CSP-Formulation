import * as _ from 'lodash';

import {CspAssignment, CspConstraint, CspProblem, CspVariable, CspVariableDomain} from "./CspProblem";
import {ChessBoardUtils} from "../utils/ChessBoardUtils";

export class NQueensProblem implements CspProblem<string> {
    readonly constraints: CspConstraint<string>[] = [];
    readonly domains: CspVariableDomain<string>[] = [];
    readonly variables: CspVariable<string>[] = [];

    readonly conflictedVariables: CspVariable<string>[] = [];

    readonly numberOfQueens: number;
    readonly chessBoardDomain: Set<string>;

    constructor(numberOfQueens: number) {
        this.numberOfQueens = numberOfQueens;
        this.chessBoardDomain = ChessBoardUtils.generateChessBoardDomain(this.numberOfQueens);

        this.initDomainsAndVariables();
        this.initConstraints();
    }

    public isCurrentAssignmentSolution(): boolean {
        return this.constraints.every(constraint => constraint.isSatisfied());
    }

    public generateRandomAssignment(): void {
        const occupiedPositions = [];

        this.variables.forEach(variable => {
            variable.value = this.generateSafeValue();
            occupiedPositions.push(variable.value);
        });

        this.variables.forEach(variable => {
            variable.domain.values = new Set(_.difference([...variable.domain.values], occupiedPositions));
        });

        this.initConflictedVariables();
    }

    public generateRandomPermutationOfAssignments(): void {
        const range = _.range(1, this.numberOfQueens + 1);
        const permutation = _.shuffle(range);
        const positions = [];

        this.variables.forEach((variable, index) => {
            const position = `${permutation[index]}:${index + 1}`;
            variable.value = position;
            positions.push(position);
        });

        this.variables.forEach(variable => {
            variable.domain.values = new Set(_.difference([...variable.domain.values], positions));
        });

        this.initConflictedVariables();
    }

    public randomConflictedVariable(): CspVariable<string> {
        return this.conflictedVariables[Math.floor(Math.random() * this.conflictedVariables.length)];
    }

    public applyAssignment(variable: CspVariable<string>, value: string): void {
        const oldValue = variable.value;
        variable.value = value;

        this.variables.forEach(v => {
            v.domain.values.add(oldValue);
            v.domain.values.delete(value);
        });

        this.variables.forEach(variable => {
            if (variable.constraintsWithOtherVariables.some(constraint => !constraint.isSatisfied()) &&
                this.conflictedVariables.indexOf(variable) === -1) {
                this.conflictedVariables.push(variable);
            }

            if (variable.constraintsWithOtherVariables.every(constraint => constraint.isSatisfied()) &&
                this.conflictedVariables.indexOf(variable) !== -1) {
                _.remove(this.conflictedVariables, (conflicted) => variable === conflicted);
            }
        });
    }

    public numberOfConflictingVariables(varsAndValues: {variable: CspVariable<string>, value: string, oldValue?: string}[]): number {
        varsAndValues.forEach(({ variable, value }, index) => {
            const oldValue = variable.value;
            variable.value = value;
            varsAndValues[index].oldValue = oldValue;
        });

        const conflictedVariables = [...this.conflictedVariables];
        this.variables.forEach(variable => {
            if (variable.constraintsWithOtherVariables.some(constraint => !constraint.isSatisfied()) &&
                conflictedVariables.indexOf(variable) === -1) {
                conflictedVariables.push(variable);
            }

            if (variable.constraintsWithOtherVariables.every(constraint => constraint.isSatisfied()) &&
                conflictedVariables.indexOf(variable) !== -1) {
                _.remove(conflictedVariables, (conflicted) => variable === conflicted);
            }
        });

        varsAndValues.forEach(({ variable, oldValue }) => {
            variable.value = oldValue;
        });
        return conflictedVariables.length;
    }

    public currentAssignment(): CspAssignment<string> {
        return this.variables.reduce((assignment, variable) => {
            assignment[variable.name] = variable.value;

            return assignment;
        }, {} as CspAssignment<string>);
    }


    private initDomainsAndVariables() {
        _.range(this.numberOfQueens).forEach(index => {
            const domain: CspVariableDomain<string> = {
                values: this.chessBoardDomain,
            };
            const variable: CspVariable<string> = {
                name: `queen-${index + 1}`,
                domain: domain,
                value: undefined,
                constraintsWithOtherVariables: [],
            };

            this.domains.push(domain);
            this.variables.push(variable);
        });
    }

    private initConstraints() {
        this.variables.forEach(variable => {
            _.without(this.variables, variable).forEach(otherVariable => {
                if (this.areConstrained(variable, otherVariable)) return;

                const constraint: CspConstraint<string> = {
                    variables: [variable, otherVariable],
                    isSatisfied: () => {
                        return !ChessBoardUtils.areTwoQueensAttackingEachOther(
                            constraint.variables[0].value,
                            constraint.variables[1].value,
                        );
                    }
                };

                this.constraints.push(constraint);
                variable.constraintsWithOtherVariables.push(constraint);
                otherVariable.constraintsWithOtherVariables.push(constraint);
            });
        });
    }

    private initConflictedVariables() {
        this.constraints
            .filter(constraint =>
                !constraint.isSatisfied()
            )
            .forEach(constraint => {
                const variablesToInsert = [...constraint.variables].filter(
                    variable => this.conflictedVariables.indexOf(variable) === -1
                );

                this.conflictedVariables.push(...variablesToInsert);
            });
    }

    private areConstrained(firstVariable: CspVariable<string>, secondVariable: CspVariable<string>): boolean {
        return this.constraints.some(
            constraint =>
                constraint.variables.indexOf(firstVariable) !== -1 &&
                constraint.variables.indexOf(secondVariable) !== -1
        );
    }

    private generateSafeValue(): string {
        const domainSize = this.chessBoardDomain.size;
        const alreadyUsedDomainValues = this.variables.map(it => it.value).filter(Boolean);

        let randomValue = null;
        while (randomValue === null || alreadyUsedDomainValues.indexOf(randomValue) !== -1) {
            randomValue = [...this.chessBoardDomain][Math.floor(Math.random() * domainSize)];
        }
        return randomValue;
    }
}

