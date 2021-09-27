export default function() {

    let nowDate = new Date();

    // 年月日
    let year = nowDate.getFullYear();
    let month = nowDate.getMonth() + 1;
    let day = nowDate.getDate();

    // 星期几
    let week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][nowDate.getDay()];

    // 时间
    let hour = nowDate.getHours();
    let minute = nowDate.getMinutes();

    return `${year}/${month}/${day} ${week}${hour}:${minute}`;
};
