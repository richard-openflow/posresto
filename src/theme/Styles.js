

export const colors = {
    primary: '#270a36',
    new: 'limegreen',
    inprogress: "orange",
    awaiting: 'red',
    done: "blue",
    cancel: "black",

    buttons: "#8AB364",
    grey1: '#43484d',
    grey2: '#5e6977',
    grey3: '#86939e',
    cardComment: '#86939e',
    backgroundColor: '#FFA07A',


}
export const getColor = (status) => {
    if (status == 'new')
        return colors.new
    if (status == 'inprogress')
        return colors.inprogress
    if (status == 'awaiting')
        return colors.awaiting
    if (status == 'cancel')
        return 'grey'
    if (status == 'done')
        return colors.done
    return 'white'
}
export const parameters = {
    buttonHeight: 50,

}