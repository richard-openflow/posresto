import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { COLORS, FONTS, hp, wp } from '../assets/styles/styleGuide';

const ZoneSelector = ({ selectedZone, setselectedZone, zone = [] }) => {
  const handleSelectZone = nameSlug => {
    setselectedZone(nameSlug);
  };

  return (
    <View style={styles.main}>

      <FlatList
        horizontal
        data={zone}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSelectZone(item.nameSlug)}
              style={[
                styles.btn,
                {
                  backgroundColor:
                    selectedZone == item.nameSlug
                      ? 'black'
                      : COLORS.BACKGROUND,
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
                      selectedZone == item.nameSlug
                        ? COLORS.WHITE
                        : 'black',
                  },
                ]}
              >
                {item?.name}
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item?._id}
      />
    </View>

  );
};

export default ZoneSelector;

const styles = StyleSheet.create({
  main: {

  },
  btn: {
    height: hp(8),
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(10),
  },
  btnTxt: {
    fontFamily: FONTS.POPPINS_500,
    color: COLORS.PRIMARY,
    fontSize: hp(1.6),
  },
});
