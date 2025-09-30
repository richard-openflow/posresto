import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { FC } from 'react';
import { COLORS, FONTS, hp } from '../../assets/styles/styleGuide';
import {
  getAssetColor,
  getTableTxtStyle,
} from '../../utils/myUtils';
import { BOOK_STATUS } from '../../assets/enums';
import moment from 'moment';
import { convertToTimeZoneManual } from '../lib/convertToTimezoneGlobal';

const TwoPerson = props => {
  const {
    size = 7,
    disabled = false,
    onPressTable = () => { },
    data = {},
    onPressChair = () => { },
    defaultSize,
    isRound = false,
    tableSize = 2,
    tableSelected,
    onLongPressTable = () => { },
    reletedBooking,
    pointOfSale,
    showingNext,
    selectedBooking,
    affectTable
  } = props;

  const getSize = () => {
    if (defaultSize) {
      return defaultSize;
    } else {
      return hp(size + tableSize);
    }
  };

  const styles = styles_(getSize(), disabled, data, isRound);
  const heatColor = (i) => {
   
    if (i >= 0 && i <= 1) {
      return 'green'
    } else if (i > 1 && i <= 2) {
      return 'orange'
    } else if (i > 2 && i <= 4) {
      return 'red'
    } else
      return 'gray'
  }
  return (
    <View
      style={[styles.main,
      tableSelected ? {
        borderBottomColor: "blue",
        borderBottomWidth: 5
      } : {},
      ]}
    >
      <View
        style={[styles.chair]}
        onPress={() => onPressChair(2)}
        hitSlop={{ top: 10, bottom: 0, left: 5, right: 5 }}
        disabled={disabled}
      >
        <Text
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          style={[
            styles.txt,
            {
              fontSize: 10 + (size * 1.7),
              lineHeight: 10 + (size * 1.7) + 3,
              color: COLORS.BLACK,
            },
          ]}
        >
          {showingNext ? (data.seatsNumber) : (reletedBooking?.length > 0 ? moment(convertToTimeZoneManual(reletedBooking[0]?.STime, pointOfSale?.timezone, true)).format('HH:mm') : '-')}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.table, (affectTable) ? {
          // backgroundColor: heatColor(-selectedBooking.nbrPeople + data.seatsNumber),
          borderColor: heatColor(-selectedBooking?.nbrPeople + data.seatsNumber),
          borderWidth: 3

        } : {}]}
        onPress={() => onPressTable()}
        onLongPress={() => onLongPressTable()}
        disabled={disabled}
      >
        {data.tableStatus != BOOK_STATUS.EMPTY && !disabled && (
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            style={[styles.txt, getTableTxtStyle(size * 3)]}
          >
            {data.unitNumber}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TwoPerson;

const styles_ = (size, disabled, data, isRound) =>
  StyleSheet.create({
    main: {
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 0,
    },
    table: {
      width: size * 2 - 14,
      height: size * 2 - 14,
      borderRadius: isRound ? size * 2.5 : size * 0.2,
      backgroundColor: disabled
        ? COLORS.BLACK
        : getAssetColor(data?.tableStatus),
      margin: size * 0.1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chair: {
      alignSelf: 'center',
    },
    txt: {
      fontFamily: FONTS.POPPINS_500,
      color: COLORS.WHITE,
      fontSize: 16,
    },
  });
