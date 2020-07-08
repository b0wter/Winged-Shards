import ClampedValue from './ClampedValue';

export default class ClampedNumber extends ClampedValue<number>
{

    constructor(max: number, min?: number, current?: number)
    {
        super(
            min ?? 0,
            max, 
            current ?? max,
            function(a: number, b: number) { return a + b},
            function(a: number, b: number) { return a - b},
            function(a: number, b: number) { return a * b},
            function(a: number, b: number) { return a / b },
            function(a: number, b: number) { return a <= b},
            function(a: number, b: number) { return a >= b }
        )
    }
}