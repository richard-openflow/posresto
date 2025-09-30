import { View, Text } from 'react-native'
import { UnitDesing } from './UnitDesing'

const ShapeUnitDesign = ({ unitNumber,seatsNumber,shape, color='gray' }) => {
   
    return (
        <View style={{ position: "relative",width:150}}>
            <Text style={[{ position: "absolute", left: 25, top: 25, zIndex: 10, color: "white", fontSize: 34 }, { ...(shape == "round" ? { left: 0, textAlign: "center", width: "100%" } : {}) }]}>T{unitNumber}</Text>
            <Text style={[{ position: "absolute", right: 25, bottom: 25, zIndex: 10, color: "white", fontSize: 24 }, { ...(shape == "round" ? { left: 0, textAlign: "center", width: "100%" } : {}) }]}>{seatsNumber}P</Text>
            <UnitDesing shape={shape} color={color} />
        </View>
    )
}

export { ShapeUnitDesign }
