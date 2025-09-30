
import { primaryBookTableColor } from '@theme';
const getUnitColor = (unitBooked) => { 
  
    if (unitBooked?.isBooked?.length >= 1) {
 
      const status = unitBooked?.isBooked[unitBooked?.isBooked.length-1]?.status
      if (status == "waiting")
        return  '#000'
      if (status == "coming")
        return '#d50000'
      if (status == 'check-in')
        return '#ff6d00'
      if (status == "check-out")
        return '#ffd600'
      if (status == "cancel")
        return primaryBookTableColor
      if (status == "no-show")
        return primaryBookTableColor
  
  
      return '#d50000'
    }
    else
      return primaryBookTableColor
  }



export {
    getUnitColor
}