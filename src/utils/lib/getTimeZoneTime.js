import axios from 'axios';

async function getNtpServerTime(tz = 'f') {
    if (tz == 'f') return null
    const ntpServerUrl = `https://worldtimeapi.org/api/timezone/${tz}`; // Replace with an NTP server of your choice

    const { data: { unixtime } } = await axios.get(ntpServerUrl)
 
    return unixtime * 1000
}

export {getNtpServerTime}
 