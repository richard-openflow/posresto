import { TableRound, TableSquare } from "../../assets";
const UnitDesing = ({ shape, color }) => {
   
    // const { currentBooking, shape } = self;

    // let color = "#76ff03"//primaryBookTableColor
    // if (currentBooking === null) {
    //     color = ('#76ff03'); //primaryBookTableColor
    // } else {
    //     if (currentBooking.bookingStatus === 'comming') {
    //         color = ('#ff7000');
    //     } else if (currentBooking.bookingStatus === 'check-in') {
    //         if (currentBooking.yellowTime === null) color = ('#ff1744');
    //         else color = ('#e8e800');
    //     }
    // }
    if (shape == "square")

        return <TableSquare color={color} width={150} height={150} style={{ margin: 5 }} />

    return <TableRound color={color} width={150} height={150} style={{ margin: 5 }} />
}
export { UnitDesing }