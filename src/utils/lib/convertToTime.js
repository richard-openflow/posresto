
const convertToTime = (number) => {
    let hour = Math.floor(number);
    let minute = (number % 1) * 60;
    minute = Math.round(minute);
    if (minute === 60) {
      hour += 1;
      minute = 0;
    }
    return hour + ":" + String(minute).padStart(2, "0");
  };

 


export {convertToTime}