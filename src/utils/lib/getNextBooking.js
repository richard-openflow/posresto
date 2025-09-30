import { convertToTimezone } from "./convertToTimezone"

const getNextBooking = ({ bookings, selectedHour }) => { 

    const timePerBooking = 60 * 60000//selectedShift.timePerBooking
    const b = bookings?.
        sort((a, b) => a.STime - b.STime)?.
        filter(e => e.STime - timePerBooking > selectedHour)?.
        filter(e => ['coming', 'check-in', 'waiting'].some(ss => ss == e.status))?.
        map(f => convertToTimezone(f?.STime, 'Etc/Gmt').format('HH:mm'))


    // if (b.length > 0) {
    //     const x = moment(b[0], 'HH:mm')
    //     const y = moment(selectedHour)
    //     const c = moment.duration(x.diff(y))
    //     const v = moment(convertTZ(new Date(c.asMilliseconds()), 'ETC/GMT')).format('HH:mm')
    //     return v
    // }
    return b[0] || false
}



const getBookingChecking = ({ bookings , object = false  }) => {
    const b = bookings?.
        sort((a, b) => a.STime - b.STime)?.
        // filter(e => e.STime - timePerBooking > tt)?.
        filter(e => ['check-in'].some(ss => ss == e.status))//?.
    //map(f => moment(convertTZ(new Date(f?.STime), 'ETC/GMT')).format('HH:mm'))

    // if (b.length > 0) {
    //     const x = moment(b[0], 'HH:mm')
    //     const y = moment(selectedHour)
    //     const c = moment.duration(x.diff(y))
    //     const v = moment(convertTZ(new Date(c.asMilliseconds()), 'ETC/GMT')).format('HH:mm')
    //     return v
    // }
    if (object)
        return b.length > 0 ? b[0] : {}

    return {isChecking: b.length > 0 || false, booking: b.length > 0 ? b[0] : {}}
}

 
export {
    getNextBooking,
    getBookingChecking
}