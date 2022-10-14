Function.lenient = {};
Function.lenient.caller = function() {
    const { stack } = new Error();
    return stack.split(/\s+/).slice(5, 6)[0];
};

export default Function.lenient.caller;