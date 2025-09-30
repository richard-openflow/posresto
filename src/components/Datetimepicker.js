import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const DateTimePickerTextInput = ({ onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const showDateTimePicker = () => {
    if (!showPicker) {
      setShowPicker(true);
    }
  };

  const hideDateTimePicker = () => {
    setShowPicker(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    hideDateTimePicker();
    onChange(currentDate);
  };

  const formattedDate = moment(date).format('DD-MM-YY');

  return (
    <View style={styles.MainContainer}>
      <TouchableOpacity onPress={showDateTimePicker}>
        <Text style={styles.text}>{formattedDate}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 0,
    padding: 4,
    alignItems: 'center',
  },

  text: {
    fontSize: 16,
    color: 'black',
    padding: 5,
    textAlign: 'center',
    borderColor: 'black',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    width: 250,
  },
});

export default DateTimePickerTextInput;






// import React, { useState } from "react";
// import { Button, SafeAreaView, StyleSheet, Text, View, Platform } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const Datetimepicker = () => {
//     const [datePicker, setDatePicker] = useState(false);
//     const [date, setDate] = useState(new Date());
  
//     const showDatePicker = () => {
//         setDatePicker(true);
//     };
      
//     const onDateSelected = (event, value) => {
//         if (event.type === 'set') {
//             setDate(value);
//         }
//         setDatePicker(false);
//     };
    
//     return (
//         <SafeAreaView style={{ flex: 1 }}>
//             <View style={styles.MainContainer}>
//                 <Text style={styles.text}>Date = {date.toDateString()}</Text>

//                 {datePicker && (
//                     <DateTimePicker
//                         value={date}
//                         mode="datetime"
//                         display={Platform.OS === 'android' ? 'spinner' : 'default'}
//                         is24Hour={true}
//                         onChange={onDateSelected}
//                         style={styles.datePicker}
//                     />
//                 )}

//                 {!datePicker && (
//                     <View style={{ margin: 10 }}>
//                         <Button title="Show Date Picker" color="green" onPress={showDatePicker} />
//                     </View>
//                 )}
//             </View>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     MainContainer: {
//         flex: 1,
//         padding: 6,
//         alignItems: 'center',
//         backgroundColor: 'white'
//     },
  
//     text: {
//    fontSize: 20,
// color: 'black',
// padding: 20,
// textAlign: 'center',
// borderColor:'black',
// borderWidth:1,
// borderRadius:2
//     },
  
//     // Style for iOS ONLY...
//     datePicker: {
//         justifyContent: 'center',
//         alignItems: 'flex-start',
//         width: 320,
//         height: 260,
//         display: 'flex',
//     },
// });

// export default Datetimepicker;
