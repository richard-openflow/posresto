import moment from 'moment-timezone';




const convertToTimezone = (t, posTz = "Etc/Gmt") => {
    // const tzLocal = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // const nowInTimezone1 = moment(moment().clone().tz(tzLocal).format("YYYY/MM/DD HH:mm:ss"), "YYYY/MM/DD HH:mm:ss");
    // const nowInTimezone2 = moment(moment().clone().tz(
    //     posTz.replace(/[+\-]/g,
    //         (match) => match === '+' ? '-' : '+'
    //     )).format("YYYY/MM/DD HH:mm:ss"), "YYYY/MM/DD HH:mm:ss");
    // const offsetHours = nowInTimezone1.diff(nowInTimezone2, 'hours');
    // const ff = Math.abs(offsetHours);


    // if (ff == 0) {
    //     return new Date(moment(t).clone().tz(posTz).format("YYYY/MM/DD HH:mm:ss"));
    // }

    // new Date(
        
       return moment(t).clone()
        // .tz(Etc/Gmt${(ff > 0 ? "-" : "+")}${ff})
        .tz(
            posTz.replace(/[+\-]/g,
                (match) => match === '+' ? '-' : '+'
            )
        )
        // .format("YYYY/MM/DD HH:mm:ss")
        
        // );
}


const convertToTimezone2 = (time, tz = "Etc/Gmt", inverse = false) => {

    const Time = moment(parseInt(time)).clone().tz(
        tz
            .replace(/[+\-]/g, function (match) {
                if (inverse)
                    return match
                return match === '+' ? '-' : '+';
            })
    )
        .valueOf()


    return Time
}



export {convertToTimezone, convertToTimezone2}

