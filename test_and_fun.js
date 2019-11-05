const StateMachine = require('javascript-state-machine');
const Signal = require('signal-js');

Sig
console.log(Signal);
console.log(StateMachine);



//console.log(s);


//const { signal } = require('signal-js');
//import signal from 'signal-js';

//import signal from 'signal-js';



//import { range } from 'rxjs';
//import { map, filter } from 'rxjs/operators';
/*
const rxjs = require('rxjs');
const { range } = require('rxjs');
const { map, filter } = require('rxjs/operators');
*/

let fsm = new StateMachine({
    init: 'solid',
    transitions: [
        {name: 'melt', from: 'solid', to: 'liquid'},
        {name: 'freeze', from: 'liquid', to: 'solid'},
        {name: 'vaporize', from: 'liquid', to: 'gas'},
        {name: 'condense', from: 'gas', to: 'liquid'}
    ],
    methods: {
        onMelt: function () {
            console.log('I melted')
        },
        onFreeze: function () {
            console.log('I froze')
        },
        onVaporize: function () {
            console.log('I vaporized')
        },
        onCondense: function () {
            console.log('I condensed')
        }
    }
});

console.log("START");

fsm.state;             // 'solid'
fsm.melt();
fsm.state;             // 'liquid'
fsm.vaporize();
fsm.state;             // 'gas'

console.log("END");

//console.log(signal);
//signal.on('basic', arg => console.log(arg));

//signal.emit('basic', 1);

/*
const myObservable = new rxjs.Subject();
myObservable.subscribe(value => console.log(value));
myObservable.next('foo');
myObservable.next(3);
let r = myObservable.observers();

class WrapObservable {
    constructor(observable) {
        this.observable = observable;
    }

    set value(val) {
        this.observable.next(val);
    }

    get value() {
        return this.observable.getValue();
    }
}

let myO = new WrapObservable(myObservable);
myO.value = 15;
console.log(myO.value);

/*
range(1, 200).pipe(
    filter(x => x % 2 === 1),
    map(x => x + x)
).subscribe(x => console.log(x));
*/
