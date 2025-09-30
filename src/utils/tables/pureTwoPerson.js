import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import { COLORS, FONTS, hp } from '../../assets/styles/styleGuide';
import { getAssetColor, getTableTxtStyle } from '../myUtils';
import { BOOK_STATUS } from '../../assets/enums';
import moment from 'moment';
import { convertToTimeZoneManual } from '../lib/convertToTimezoneGlobal';

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

const PureTwoPerson = React.memo(
    ({
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
        affectTable,
        selectedBooking,
        showingNext,
    }) => {
        const getSize = () => {
            if (defaultSize) {
                return defaultSize;
            } else {
                return hp(size + tableSize);
            }
        };

        const styles = useMemo(() => styles_(getSize(), disabled, data, isRound), [
            size,
            disabled,
            data,
            isRound,
            defaultSize,
            tableSize,
        ]);
        const heatColor = i => {
            if (i >= 0 && i <= 1) {
                return 'green';
            } else if (i > 1 && i <= 2) {
                return 'orange';
            } else if (i > 2 && i <= 4) {
                return 'red';
            } else return 'gray';
        };
        return (
            <View
                style={[
                    styles.main,
                    tableSelected
                        ? { borderBottomColor: 'blue', borderBottomWidth: 5 }
                        : {},
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
                                fontSize: 10 + size * 1.7,
                                lineHeight: 10 + size * 1.7 + 3,
                                color: 'white' //COLORS.BLACK,// has been changed
                            },
                        ]}
                    >
                        {showingNext
                            ? data.seatsNumber
                            : reletedBooking?.length > 0
                                ? moment(
                                    convertToTimeZoneManual(
                                        reletedBooking[0]?.STime,
                                        pointOfSale?.timezone,
                                        true,
                                    ),
                                ).format('HH:mm')
                                : '-'}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.table,
                        affectTable && selectedBooking?.nbrPeople <= data.seatsNumber
                            ? {
                                // backgroundColor: heatColor(-selectedBooking.nbrPeople + data.seatsNumber),
                                borderColor: heatColor(
                                    -selectedBooking?.nbrPeople + data.seatsNumber,
                                ),
                                borderWidth: 2,
                            }
                            : {},
                    ]}
                    onPress={() => {
                        onPressTable()
                       // data?.tableStatus !== '#ff6d00' ? onPressTable() : alert("table already check-in")
                    }}
                    onLongPress={onLongPressTable}
                    disabled={disabled}
                >
                    {data.tableStatus != BOOK_STATUS.EMPTY && !disabled && (
                        <Text
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                            style={[styles.txt, getTableTxtStyle(size * 5),
                                //has been changed
                                {
                                    color:'white'
                                }
                            ]}
                        >
                            {data.unitNumber}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    },
);

export default PureTwoPerson;