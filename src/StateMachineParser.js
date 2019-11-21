const SM = require('./StateMachine');

function StateMachineParser(exp) {
    return exp;
}

StateMachineParser.getSMExp = function (exp) {
    let results = exp.match(/\$.*?\$/g);
    if (results !== null) {
        results = results.map(function (result) {
            return result.substring(1, result.length - 1);
        });
    } else {
        results = [];
    }
    return results;
};

StateMachineParser.removeSMExp = function (exp) {
    return exp.replace(/\$.*?\$/g, "");
};

StateMachineParser.replaceSmexpWithSM = function (exp, sms, patternSMS, contextObjectName) {
    sms.forEach(function (sm, index) {
        //todo: think how to remove "$"
        exp = exp.replace("$" + sm.expression + "$", patternSMS + index + "(" + contextObjectName + ")");
    });
    return exp;
};

StateMachineParser.createFromExp = function (sexp) {
    let stexp = StateMachineParser.parse(sexp);
    let smexp;
    try {
        with (SM) {
            smexp = eval(stexp);
        }
    } catch (e) {
        console.error(stexp);
        throw "ERROR PARSING MACHINE:" + error;
    }
    return SM(smexp, sexp);
};

StateMachineParser.parse = function (code) {
    return StateMachineParser._transformer(StateMachineParser._parse(StateMachineParser._lex(code)));
};

StateMachineParser._lex = function (string) {
    //var tokens = string.match(/\(|\)|\|\d+(\.\d+)?|\w+|[+*\/-]/g);
    let tokens = string.match(/\(|\)|\|\||-->|->|>|<|&&|!|=|\d+(\.\d+)?|\w+|[+*\/-]/g);
    return tokens.map(function (token) {
        return /^\d/.test(token) ? parseFloat(token) : token;
    });
};

StateMachineParser._parse = function (tokens) {
    let nodes = [];
    tokens.shift();
    while (token = tokens.shift()) {
        if (token === "(") {
            tokens.unshift(token);
            nodes.push(StateMachineParser._parse(tokens));
        } else if (token === ")") {
            return nodes;
        } else {
            nodes.push(token);
        }
    }
    return nodes;
};

StateMachineParser._transformer = function (node) {
    if (!Array.isArray(node)) return "exp('" + node + "')";
    switch (node[0]) {
        case "||":
            return "or(" + StateMachineParser._transformer(node[1]) + "," + StateMachineParser._transformer(node[2]) + ")";
        case "->":
            return "seq(" + StateMachineParser._transformer(node[1]) + "," + StateMachineParser._transformer(node[2]) + ")";
        case "-->":
            return "seqN([" + node.splice(1).map(innerNode => StateMachineParser._transformer(innerNode)).join(",").slice(0, -1) + ")])";
        case "*":
            return "star(" + StateMachineParser._transformer(node[1]) + ")";
        case "+":
            return "plus(" + StateMachineParser._transformer(node[1]) + ")";
        default:
            return "exp('" + node.join("") + "')";
    }
};

module.exports = StateMachineParser;