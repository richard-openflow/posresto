import { StyleSheet, Dimensions, PixelRatio, Platform } from "react-native"
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';


const FONTS = {
    POPPINS_100: "Poppins-Thin",
    POPPINS_200: "Poppins-ExtraLight",
    POPPINS_300: "Poppins-Light",
    POPPINS_400: "Poppins-Regular",
    POPPINS_500: "Poppins-Medium",
    POPPINS_600: "Poppins-SemiBold",
    POPPINS_700: "Poppins-Bold",
    POPPINS_800: "Poppins-ExtraBold",
}

const COLORS = {
    PRIMARY: "#270B36",
    WHITE: "#FFFFFF",
    BLACK: "#000000",
    BACKGROUND: "#FFFFFF",
    GREY: "#d3d3d3",
    DANGER: "#bb2124",
    SUCCESS: "#00AB2C",
    ORANGE: "#fc9208"
}

const COMMON_STYLES = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND
    },
    center_: {
        justifyContent: 'center',
        alignItems: 'center'
    },
})

const SIZE = {
    WIDTH : Dimensions.get('screen').width,
    HEIGHT : Dimensions.get('screen').height,
}

// based on iphone 5s's scale
const scale = SIZE.WIDTH / 320;

const normalize = (size) => {
    const newSize = size * scale
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        // return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    }
}

export {
    wp,
    hp,
    FONTS,
    COLORS,
    COMMON_STYLES,
    normalize
}