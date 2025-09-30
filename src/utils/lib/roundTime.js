import moment from "moment";

function roundTime(tz) {

    let hours = convertTZ(new Date(), tz).getHours()
    let mins = convertTZ(new Date(), tz).getMinutes();

    if (mins >= 15 && mins < 45)
        mins = 30;
    else {
        hours += mins > 45 ? 1 : 0;
        mins = 0;
    }
    // alert(moment().format(`HH:${new String(mins).padStart(2, '0')}`))
    return moment(convertTZ(new Date(), tz)).format(`${new String(hours).padStart(2, '0')}:${new String(mins).padStart(2, '0')}`)
}

function convertTZ(date, tzString) {
    let tz = tzString?.replace(/[+\-]/g,
        (match) => match === '+' ? '-' : '+'
    )
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tz }));
}

function parseTimeToNumber(date) {
    return parseInt(moment(date).format('HH')) + moment(date).format('mm') / 60
  }
export {
    roundTime,
    convertTZ,
    parseTimeToNumber
}