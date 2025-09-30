


function convertTZ(date, tzString) {
    let tz = tzString?.replace(/[+\-]/g,
        (match) => match === '+' ? '-' : '+'
    )
    return new Date((typeof date === "string" ? new Date(date) : date)); //.toLocaleString("en-US", { timeZone: tz }));
}


module.exports = convertTZ