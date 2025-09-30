import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import { COLORS, FONTS, hp, wp } from '../assets/styles/styleGuide';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { toggleDrawer } from '../utils';

const ZoneSelector = ({
  selectedZone,
  setselectedZone,
  showingNext,
  SethowingNext,
  Zone = [],
  navigation,

}) => {
  const handleSelectZone = nameSlug => {
    setselectedZone(nameSlug);
  };

  return (
    <View style={styles.main}>
      <FlatList
        horizontal
        data={Zone}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSelectZone(item.nameSlug)}
              style={[
                styles.btn,
                {
                  backgroundColor:
                    selectedZone == item.nameSlug ? 'red' : 'black',
                },
              ]}
            >
              <Text
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={[
                  styles.btnTxt,
                  {
                    color:
                      selectedZone == item.nameSlug ? COLORS.WHITE : 'white',
                  },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item?._id}

      />

      <TouchableHighlight
        underlayColor
        style={{ paddingHorizontal: 17, paddingVertical: 5 }}
        onPress={() => {
          SethowingNext(e => !e);
        }}
      >
        <>
          <MaterialCommunityIcons name={'dip-switch'} color={'black'} size={25} />
        </>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor
        style={{ paddingHorizontal: 17, paddingVertical: 5 }}
        onPress={() => {
          toggleDrawer();
        }}
      >
        <>
          <Feather name={'menu'} color={'black'} size={25} />
        </>
      </TouchableHighlight>
    </View>
  );
};

export default ZoneSelector;

const styles = StyleSheet.create({
  main: {
    // height:95,
    flexDirection: "row",
 
    borderColor: COLORS.GREY,
  },
  btn: {
    height: 40,
    borderColor: 'black',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(10),
    // borderBottomWidth: 1,
    // borderRightWidth: 1,

  },
  btnTxt: {
    fontFamily: FONTS.POPPINS_500,
    color: 'black',
    fontSize: hp(1.6),
  },
});
