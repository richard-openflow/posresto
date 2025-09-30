function getTodayBookings(arr, {startOfDay, endOfDay, _id}) {
  return arr.filter(b =>{
    return b.STime  >= startOfDay && b.STime <= endOfDay && ""+b.pointOfSale === _id
    
    //pointOfSale._id == $0 AND STime >= $1 AND STime <= $2
  })
 
}

export {getTodayBookings};
