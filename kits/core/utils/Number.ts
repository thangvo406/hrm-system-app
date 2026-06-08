
function nextUUID() {
    function _pattern(t, s) {
        const p = (`${(t ? (Date.now()) : (Math.random())).toString(16)}0000000`).slice(2, 10);
        return s ? `-${p.slice(0, 4)}-${p.slice(4, 8)}` : p;
    }

    return _pattern(true) + _pattern(false, true) + _pattern(false, true) + _pattern();
}

const isNumber = (text: string) => {
    const reg = new RegExp(String.raw`^\d+$`);
    return reg.test(text);
 };


export default {
    nextUUID,
    isNumber,
};
