import io from 'socket.io-client';
let url = 'https://socket.openflow.pro'
//let url = 'http://192.168.1.7:9933'
let socket = null
const getSocket = () => {
    if (socket == null)
        return socket = io(url);
    return socket
}

export {
    getSocket
}