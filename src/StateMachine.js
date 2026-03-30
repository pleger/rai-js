const expInter = require('./ExpressionInterpreter');

function StateMachine(exp, smexp) {
    let tst = [exp];
    let resultSM = false;

    let sm = function (inputs) {
        tst = tst.filter(el => el !== true);
        tst = tst.map(function (st) {
            return st(inputs);
        });

        let first = exp(inputs);

        if (resultSM === true) {
            tst = [exp];
            if (first !== exp) {
                resultSM = false;
            }
        }
        if (first !== exp) {
            tst.push(first);
        }

        resultSM = resultSM || tst.some(val => val === true);
        return resultSM;
    };

    sm.addingContextObject = function (obj) {
        sm.contextObject = obj;
    };

    sm.expression = smexp || "_"; // it is just used to debugging
    return sm;
}

//this method is used only for tests
StateMachine.sym = function (id) {
    return function innerSym(s) {
        return s === id ? true : innerSym;
    }
};

StateMachine.exp = function (expression) {
    return function innerExp(contextObj) {
        return expInter(expression, contextObj) === true ? true : innerExp;
    }
};

StateMachine.seq = function (l1, l2) {
    return function innerSeq(s) {
        let r = l1(s);
        return r === true ? l2 : r === l1 ? innerSeq : StateMachine.seq(r, l2);
    }
};

StateMachine.seqN = function (list) {
    return list.reduce(function (acc, el) {
        return StateMachine.seq(acc, el);
    })
};

StateMachine.or = function (l1, l2) {
    return function innerOr(s) {
        let r1 = l1(s);
        let r2 = l2(s);

        return r1 === true || r2 === true ? true : r1 === l1 && r2 === l2 ? innerOr : StateMachine.or(r1, r2);
    }
};

StateMachine.star = function (l) {
    return function innerStar(s) {
        return l(s) === true ? innerStar : true;
    }
};

StateMachine.plus = function (l) {
    return StateMachine.seq(l, StateMachine.star(l));
};

module.exports = StateMachine;