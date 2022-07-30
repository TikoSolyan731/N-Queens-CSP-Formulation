# CSP formulation with MinConflicts heuristic

`./src/csp/CspProblem.ts` file contains the interfaces for constructing
a CSP problem.\
\
`./src/csp/NQueensProblem.ts` implements the interfaces from the above file and 
defines the N-Queens problem.\
\
`./src/solvers` folder contains the two solvers corresponding to the two algorithms mentioned in the paper.\
\
`./src/utils` folder contains utilities, mainly chess board utility functions.

## How to run the code
1. Run `npm install -g typescript`
2. Run `npm ci`
3. Run `npm run build` to build the project first
4. Run `node dist/main.js` and pass in the arguments
   1. `--queens=4` to specify the number of queens
   2. `--algorithm=` to specify with what algorithm to run the code with (values are `minConflicts` and `minConflictsImproved`)
   3. `--threshold=100` to specify the threshold for the `minConflicts` algorithm
5. Enjoy the algorithm's results