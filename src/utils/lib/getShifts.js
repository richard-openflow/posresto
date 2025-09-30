import moment from "moment"

const getShifts = ({ shifts, date }) => {
    const dayName = moment(date).format('dddd')
    const cDate = moment(moment(date).format('YYYY/MM/DD 00:00:00')).startOf('day').valueOf()
 
    if (shifts?.filter(e => e?.dayName == dayName?.toLowerCase() && e?.type == "special")?.some(e => new Date(moment(e.startDate).format('YYYY/MM/DD 00:00:00')).getTime() <= cDate && cDate <= new Date(moment(e.endDate).format('YYYY/MM/DD 00:00:00')).getTime()))
        return shifts?.filter(e => e?.dayName == dayName?.toLowerCase() && e?.type == "special")?.find(e => new Date(moment(e.startDate).format('YYYY/MM/DD 00:00:00')).getTime() <= cDate && cDate <= new Date(moment(e.endDate).format('YYYY/MM/DD 00:00:00')).getTime()).shift
    return shifts?.find(e => e?.dayName == dayName?.toLowerCase() && e?.type == 'normal')?.shift
}


export {
    getShifts
}