
function expressionInterpreter(expresion, contextObj) {
    let result;

    try {
        with (contextObj) {
            result = eval(expresion);
        }
    } catch (error) {
        if (error instanceof ReferenceError) {
            return false; //return false when it is not possible to evaluate
        } else {
            throw error; //other error
        }
    }
    return result;
}


module.exports = expressionInterpreter;