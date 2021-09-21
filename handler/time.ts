module.exports = {
    name: 'time',
    execute () {
        var day = new Date();
        var h = String(day.getHours()).padStart(2, '0');
        var mi = String(day.getMinutes()).padStart(2, '0');
        var s = String(day.getSeconds()).padStart(2, '0');
        var d = String(day.getDate()).padStart(2, '0');
        var mo = String(day.getMonth() + 1).padStart(2, '0');
        var y = String(day.getFullYear()).padStart(2, '0');
        return [h,mi,s,d,mo,y];
    }
};

