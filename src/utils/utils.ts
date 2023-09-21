import { useStore } from '@/stores/user'
// localstorage的读取、设置、删除
interface storageValueData {
    data: any,
    time: number
}
export const storage = function (key: string, value: unknown = null, ms: number = 0) {
    const Storage = window.localStorage, length = arguments.length;
    if (length > 0) {
        if (length == 1) { //读取
            let data: string = Storage[key];
            if (data) {
                const value: storageValueData = JSON.parse(data);
                if (value.time !== 0 && value.time <= Date.now()) { //过期   等于0时表示永远不过期
                    Storage.removeItem(key);
                    return false;
                }
                return value.data;
            }
            return null;
        } else {
            if (value === null) {//删除
                Storage.removeItem(key)
            } else { //设置
                var obj = {
                    data: value,
                    time: ms === 0 ? 0 : (Date.now() + ms) //过期时间 等于0时表示永远不过期
                }
                Storage[key] = JSON.stringify(obj);
            }
            return true;
        }
    }
};

// 获取时间（任意格式'yyyy-MM-dd hh:mm:ss'）
export const getDate = (fmt = "yyyy-MM-dd", timestamp: string | number = new Date().getTime()) => {
    const date = new Date(timestamp);
    let o: any = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
        "W+": getYearWeek(date), //周数
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
}

// 获取当前是第几周
const getYearWeek = (date: Date): number => {
    var date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var date2 = new Date(date.getFullYear(), 0, 1);

    //获取1月1号星期（以周一为第一天，0周一~6周日）
    var dateWeekNum = date2.getDay() - 1;
    if (dateWeekNum < 0) {
        dateWeekNum = 6;
    }
    if (dateWeekNum < 4) {
        //前移日期
        date2.setDate(date2.getDate() - dateWeekNum);
    } else {
        //后移日期
        date2.setDate(date2.getDate() + 7 - dateWeekNum);
    }
    var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    if (d < 0) {
        var date3 = new Date(date1.getFullYear() - 1, 11, 31);
        return getYearWeek(date3);
    } else {
        //得到年数周数
        var year = date1.getFullYear();
        var week = Math.ceil((d + 1) / 7);
        return week;
    }
}

/**
 *  获取时间戳或者将日期转化为时间戳
 *  @param {string} value 是需要进行深度复制的对象或数组
 *  @return {number} 返回已经排序好的数组
 */
export const getTime = (value?: string) => {
    const date = value ? new Date(value.replace(/-/g, '/')) : new Date();
    const timestamp = date.getTime();
    return timestamp;
}


/**
 *  对数组进行复制
 *  @param {Array|Object} obj 是需要进行深度复制的对象或数组
 *  @return {Array|Object} 返回已经排序好的数组
 */
export const deepClone = (obj: any) => {
    if (obj === null) { // 如果是null则直接返回
        return obj;
    }
    let copy: any = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                copy[key] = deepClone(obj[key]);
            } else {
                copy[key] = obj[key];
            }
        }
    }
    return copy;
}

/**
 *  对数组进行排序
 *  @param {Array} array 是需要进行排序的数组
 *  @param {String} key 是根据哪一项值进行比较排序
 *  @return {Array} 返回已经排序好的数组
 */
export const sort = (array: any[], key: string = '') => {
    return array.sort(function (a: any, b: any) {
        return key ? a[key] - b[key] : a - b;
    })
}




const view = (param: String) => {
    return () => import(`@/views/${param}/${param}.vue`)
}

/**
 *  对返回的权限列表进行格式化
 *  前提：这里假设接口返回的数据没有经过格式化，是个一维数组（所有父子菜单、按钮都在同一级返回）
 *  @param {Array} array 是需要进行格式化的权限列表
 *  @return {Array} 返回已经格式化好的数组
 */
export const permissionsMenu = (array: any): permissions[] => {
    let object: any = {};
    let menu: any = {};
    const list = sort(array, 'sort')
    for (let i = 0; i < array.length; i++) {
        let current = array[i];
        if (object[current.id]) { // ①添加当前节点时，需要先判断是否已经存在，因为有可能在②步骤的时候临时添加一个空的节点替代。
            // 把临时数据放到正式数据里面
            current.children = object[current.id].children;
        }
        object[current.id] = current;
        // ② 判断这个父节点是否已经添加，没有就先临时添加一个空对象{}
        //   然后就把当前节点push到父节点的children上
        object[current.parentId] = object[current.parentId] || {};
        let parent = object[current.parentId];
        parent.children = parent.children || [];
        parent.children.push(current);
        current.meta = {
            label: current.label,
            isMenu: current.isMenu,
            type: current.type,
            status: current.status,
            icon: current.icon,
            auth: current.auth,
        }
        // 等于1时表示菜单目录，2时表示为菜单，3时为按钮
        if (current.meta.type == 2) {
            current.component = view(current.name);
        }
    }
    return object[0].children;
}

/**
 *  对返回的权限列表进行格式化，筛选出只有路由菜单的列表
 *  前提：这里假设返回的数据没有经过格式化，是个权限列表（包含菜单、目录、按钮）
 *  @param {Array} array 是需要进行格式化的菜单数组
 *  @return {Array} 返回已经格式化好的数组
 */
export const formatMenu = (array: any): permissions[] => {
    let list = array.filter((item: any) => {
        if (item.status == 1 && item.type != 3) {
            let data = item;
            if (item.children?.length > 0) {
                data.children = formatMenu(item.children)
            }
            return data
        }
    })
    return list;
}


