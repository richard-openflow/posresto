import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
// const data = [
//   { label: 'Item 1', value: '1' },
//   { label: 'Item 2', value: '2' },
//   { label: 'Item 3', value: '3' },
//   { label: 'Item 4', value: '4' },
//   { label: 'Item 5', value: '5' },
//   { label: 'Item 6', value: '6' },
//   { label: 'Item 7', value: '7' },
//   { label: 'Item 8', value: '8' },
// ];
const DropdownComponent = ({ data = [], onChange, style = {} }) => {

  const [value, setValue] = useState(null);
  useEffect(() => {
    onChange(value
    )


  }, [value])

  return (
    <Dropdown
      style={[styles.dropdown, style]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      data={data?.map(e => { return { value: e._id, label: e.unitName } })}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Select table"
      searchPlaceholder="Search..."
      value={value}
      onChange={item => {
      
        setValue(item.value);
      }}

    />
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 20,
    borderBottomColor: 'gray',
    width: 190
  },

  placeholderStyle: {
    fontSize: 16,

  },
  selectedTextStyle: {
    fontSize: 16,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,

  },
});

