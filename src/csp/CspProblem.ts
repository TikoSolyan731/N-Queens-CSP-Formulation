export interface CspProblem<T> {
    variables: CspVariable<T>[];
    conflictedVariables: CspVariable<T>[];

    domains: CspVariableDomain<T>[];
    constraints: CspConstraint<T>[];

    numberOfQueens: number;

    isCurrentAssignmentSolution: () => boolean;

    generateRandomAssignment: () => void;
    generateRandomPermutationOfAssignments: () => void;

    randomConflictedVariable: () => CspVariable<T>;
    applyAssignment: (variable: CspVariable<T>, value: T) => void;
    numberOfConflictingVariables: (varsAndValues: {variable: CspVariable<string>, value: string, oldValue?: string}[]) => number;
    currentAssignment: () => CspAssignment<T>;
}

export interface CspVariable<T> {
    name: string;
    value: T;
    domain: CspVariableDomain<T>;
    constraintsWithOtherVariables: CspConstraint<T>[];
}

export function isCspVariableConflicted<T>(variable: CspVariable<T>): boolean {
    return variable.constraintsWithOtherVariables.some(constraint => !constraint.isSatisfied());
}

export interface CspVariableDomain<T> {
    values: Set<T>;
}

export interface CspConstraint<T> {
    variables: CspVariable<T>[];
    isSatisfied: () => boolean;
}

export interface CspAssignment<T> {
    [variableName: string]: T
}

export class AllDiffConstraint implements CspConstraint<any> {
    variables: CspVariable<any>[];

    isSatisfied(): boolean {
        const variableValues = this.variables.map(it => it.value);
        return variableValues.length === (new Set(variableValues)).size;
    }
}

export function values<T>(variables: CspVariable<T>[]): T[] {
    return variables.map(variable => variable.value);
}