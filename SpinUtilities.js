// Name: SpinUtilities
// ID: SpinUtilities
// Description: Utility blocks for various things
// By: Spin4team4096

// Version v1.0.0

class SpinUtilities {
    getInfo() {
        return {
            id: 'SpinUtilities',
            name: 'SpinUtilities',
            color1: '#ff2929',
            color2: '#de2323',
            blocks: [
                {opcode: 'isEven', blockType: Scratch.BlockType.BOOLEAN, text: 'is [NUM] even?', arguments: {
                    NUM: {type: Scratch.ArgumentType.NUMBER, defaultValue: 2},
                }},
                {opcode: 'roundToDecimalPlaces', blockType: Scratch.BlockType.REPORTER, text: 'round [NUM] to [PLACES] decimal places', arguments: {
                    NUM: {type: Scratch.ArgumentType.NUMBER, defaultValue: 3.14159265},
                    PLACES: {type: Scratch.ArgumentType.NUMBER, defaultValue: 2},
                }},
                {opcode: 'degreesToRadians', blockType: Scratch.BlockType.REPORTER, text: 'degrees [DEG] to radians', arguments: {
                    DEG: {type: Scratch.ArgumentType.NUMBER, defaultValue: 90},
                }},
                {opcode: 'radiansToDegrees', blockType: Scratch.BlockType.REPORTER, text: 'radians [RAD] to degrees', arguments: {
                    RAD: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1.5707963267948966},
                }},
                {opcode: 'typeOfValue', blockType: Scratch.BlockType.REPORTER, text: 'value type of [INPUT]', arguments: {
                    INPUT: {type: Scratch.ArgumentType.STRING, defaultValue: "hello4096"},
                }},
                {opcode: 'evaluate', blockType: Scratch.BlockType.REPORTER, text: 'evaluate [EXPRESSION]', arguments: {
                    EXPRESSION: {type: Scratch.ArgumentType.STRING, defaultValue: "((1+(14/2))*(4-2)^9)"},
                }},
            ]

        }
    }

    isEven(args) {
        return args.NUM % 2 == 0;
    }

    roundToDecimalPlaces(args) {
        return Math.round(args.NUM * 10 ** args.PLACES) / 10 ** args.PLACES;
    }

    degreesToRadians(args) {
        return args.DEG * (Math.PI / 180)
    }

    radiansToDegrees(args) {
        return args.RAD * (180 / Math.PI)
    }

    typeOfValue(args) {
        if (!isNaN(parseFloat(args.INPUT)) && isFinite(args.INPUT)) {
            return "number"
        } else if (args.INPUT == "true" || args.INPUT == "false") {
            return "boolean"
        } else {
            return "string"
        }
    }

    evaluate(args) {
        // Tokenise everything ugghh
        let tokens = [];
        let current = '';
        let i = 0;

        for (i=0; i < args.EXPRESSION.length; i+=1) {
            let char = args.EXPRESSION[i];

            if ((char >= '0' && char <= '9') || char === '.') {
                current += char;
            } else if ('()^*/+-'.includes(char)) {
                if (current !== '') {
                    tokens.push(current);
                    current = '';
                }
                tokens.push(char);
            } else if (char === ' ') {
                if (current !== '') {
                    tokens.push(current);
                    current = '';
                    console.warn("I don't like spaces. DO NOT add spaces in the middle of a number");
                }
            } else {
                console.log("Error during tokenisation");
                console.error(`This is some strange character bro: ${char}`);
                console.log("We only accept these: ()^*/+-");
                return("Invalid character - check console for details");
            }
        }

        if (current !== '') {
            tokens.push(parseFloat(current));
        }
        // Converting to postfix notation using Shunting Yard. Thanks to @mattbatwings for his video on it
        let operators = [];
        let output = [];
        for (i=0; i<tokens.length; i+=1) {
            if ('()^*/+-'.includes(tokens[i])) {
                if (tokens[i] == '^') { 
                    // I DESPISE powers, this took so long
                    while (operators.length > 0 && operators[operators.length - 1] === '^') output.push(operators.pop());
                    operators.push(tokens[i]);
                } else if ('*/'.includes(tokens[i])) {
                    while (operators.length > 0 && !'(+-'.includes(operators[operators.length - 1])) {
                        output.push(operators.pop());
                    }
                    operators.push(tokens[i]);
                } else if ('+-'.includes(tokens[i])) {
                    while (operators.length > 0 && !'('.includes(operators[operators.length - 1])) {
                        output.push(operators.pop());
                    }
                    operators.push(tokens[i]);
                } else if (tokens[i] == '(') {
                    operators.push(tokens[i]);
                } else if (tokens[i] == ')') {
                    while (operators.length > 0 && !'('.includes(operators[operators.length - 1])) {
                        output.push(operators.pop());
                    }
                    operators.pop();
                }
            } else {
                output.push(tokens[i]);
            }
        }
        while (operators.length > 0) {
            output.push(operators.pop());
        }
        // FINALLY I CAN EVALUATE EVERYTHING
        let result = [];
        for (i=0; i<output.length; i+=1) {
            if ('()^*/+-'.includes(output[i])) {
                if (output[i] == "+") {
                    let a = result.pop();
                    let b = result.pop();
                    result.push(b+a);
                } else if (output[i] == "-") {
                    let a = result.pop();
                    let b = result.pop();
                    result.push(b-a);
                } else if (output[i] == "*") {
                    let a = result.pop();
                    let b = result.pop();
                    result.push(b*a);
                } else if (output[i] == "/") {
                    let a = result.pop();
                    let b = result.pop();
                    result.push(b/a);
                } else if (output[i] == "^") {
                    let a = result.pop();
                    let b = result.pop();
                    result.push(b**a);
                } else {
                    console.log("Error during postfix evaluation");
                    console.log("Achievement earned: How did we get here? How tf does a character skip tokenisation errors lol");
                    console.error(`This is some strange character bro: ${tokens[i]}`);
                    return("Invalid character - Check console for details");
                }
            } else {
                result.push(parseFloat(output[i]));
            }
        }
        return result[0];
    }


    
}

Scratch.extensions.register(new SpinUtilities());
