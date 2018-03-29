export function Timebetween(date, type) {
    type = type.toUpperCase;
    date = new Date(date);

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;

    if (type === "END") {
        hours = 23;
        minutes = 59;
        seconds = 59;
        milliseconds = 999;
    }

    if (type === "START" || type == "END") {
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);
        date.setMilliseconds(milliseconds);
    }
    return date;
}

export function setAttribute(parent, name, value) {
    const arr = name.split('.');
    let i = 0;
    for (const len = arr.length - 1; i < len; i++) {
        if (parent[arr[i]] == void 0) {
            parent[arr[i]] = {};
        }
        parent = parent[arr[i]];
    }
    parent[arr[i]] = value;
}

/**
 * [getAttribute description]
 * @param  {[type]} parent [description]
 * @param  {[type]} name   [description]
 * @return {[type]}        [description]
 */
export function getAttribute(parent, name) {
    const arr = name.split(".");
    let i = 0;
    for (const len = arr.length - 1; i < len; i++) {
        if (parent[arr[i]] == void 0) {
            return parent[arr[i]];
        }
        parent = parent[arr[i]];
    }

    if (parent[arr[i]] === '') {
        return parent[arr[i]]
    }
    return parent[arr[i]] || null;
}

/**
 * [dataAdapter description]
 * @param  {[type]} dictionary  [数据字典]
 * @param  {[type]} origin_data [目标数据]
 * @param  {[type]} data        [原始数据]
 * @param  {Array}  [toJson=[]] [字符串转JSON数组]
 * @return {[type]}             [description]
 */
export function dataAdapter(dictionary, origin_data, data, toJson = []) {
    toJson = toJson || [];
    toJson.forEach(item => {
        try {
            setAttribute(data, item, JSON.parse(getAttribute(data, item)));
        } catch (e) {
            console.error(e);
        }
    });
    for (var key in dictionary) {
        let temp = getAttribute(data, dictionary[key]);
        setAttribute(origin_data, key, temp);
    };
}