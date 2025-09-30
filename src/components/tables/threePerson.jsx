import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { COLORS, FONTS, hp } from '../../assets/styles/styleGuide'
import { getAssetColor, getChairColor, getTableTxtStyle } from '../../utils/myUtils'; 
import { BOOK_STATUS } from '../../assets/enums';


const ThreePerson = (props) => {
    const {
        size = 7,
        disabled = false,
        onPressTable = () => { },
        data = {},
        onPressChair = () => { },
        defaultSize,
        isRound = false,
        tableSize= 3

    } = props

    const getSize = () => {
        if (defaultSize) {
            return defaultSize
        } else {
            return hp(size + tableSize)
        }
    }

    const styles = styles_(getSize(), disabled, data, isRound)

    return (
        <View style={styles.main}>

            <TouchableOpacity
                style={[styles.chair, {
                    backgroundColor: disabled ? COLORS.BLACK : getChairColor(data, 0),
                }]}
                onPress={() => onPressChair(0)}
                hitSlop={{ top: 10, bottom: 0, left: 5, right: 5 }}
                disabled={disabled}
            >
            </TouchableOpacity>

            <View style={styles.row}>

                <TouchableOpacity
                    style={styles.table}
                    onPress={() => onPressTable()}
                    disabled={disabled}
                >
                     {/* {(!disabled) &&
                        <Text
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                            style={[styles.txt, getTableTxtStyle(size)]}>{data.id}</Text>
                    } */}

                    {(data.tableStatus != BOOK_STATUS.EMPTY && !disabled) &&
                        <Text
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                            style={[styles.txt, getTableTxtStyle(size * 3)]}>{data.unitNumber}</Text>
                    }

                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.chair2, {
                        backgroundColor: disabled ? COLORS.BLACK : getChairColor(data, 1),
                    }]}
                    onPress={() => onPressChair(1)}
                    hitSlop={{ top: 0, bottom: 0, left: 0, right: 10 }}
                    disabled={disabled}
                >
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.chair, {
                    backgroundColor: disabled ? COLORS.BLACK : getChairColor(data, 2),
                }]}
                onPress={() => onPressChair(2)}
                hitSlop={{ top: 0, bottom: 10, left: 5, right: 5 }}
                disabled={disabled}
            >
            </TouchableOpacity>

        </View>
    )
}

export default ThreePerson

const styles_ = (size, disabled, data, isRound) => StyleSheet.create({
    main: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    table: {
        width: size,
        height: size,
        borderRadius: isRound ? size : 0,
        backgroundColor: disabled ? COLORS.BLACK : getAssetColor(data?.tableStatus),
        margin: size * 0.1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row'
    },
    chair: {
        width: size * 0.6,
        height: size * 0.1,
        backgroundColor: disabled ? COLORS.BLACK : COLORS.SUCCESS,
        alignSelf: 'center',
    },
    chair2: {
        width: size * 0.1,
        height: size * 0.6,
        backgroundColor: disabled ? COLORS.BLACK : COLORS.SUCCESS,
        alignSelf: 'center'
    },
    txt: {
        fontFamily: FONTS.POPPINS_500,
        color: COLORS.WHITE,
        fontSize: 16
    }
})