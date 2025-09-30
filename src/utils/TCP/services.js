

// import { store } from '@redux';

//import AsyncStorage from '@react-native-async-storage/async-storage';
// import BackgroundJob from 'react-native-background-actions';
import { ENDOFFILE, tcpPort } from '../config';
//import { ValidateIPaddress } from '../helpers';
var net = require('react-native-tcp');

let server = null
let clients = []
const createTCPServer = async (callback = () => {

}) => {
    if (server != null)
        return server;
    server = net.createServer((socket) => {

        socket.setKeepAlive();
        let chunk = ""
        socket.on('data', (data, da) => {

            const d = Buffer.from(data, 'base64').toString('utf8')
            chunk += d;

            if (d.slice(-ENDOFFILE.length) == ENDOFFILE) {
                const payload = JSON.parse(Buffer.from(chunk.split(ENDOFFILE)[0], 'base64').toString('utf8'));

                callback(payload)
                //let { event } = payload

                // if (event == ActionType.server.deviceType) {
                //     store.dispatch({ type: "SETCONNECTEDCLIENTINFO", payload })

                // } else if (event == ActionType.server.createLocalCommand) {
                //     const { command } = payload
                //     CommandController.create(command)

                // } else if (event == ActionType.server.createLocalBooking) {
                //     const { booking } = payload
                //     bookingController.CreateBookingRealm(booking)

                // } else if (event == ActionType.server.SendMenuToPeer) {
                //    
                // }
                // store.dispatch({ type: "REFERSHEDDATA" })
                chunk = ""
            }
            // else if (event == ActionType.server.newconnection) {
            //     const dd = data.client;
            //     store.dispatch({ type: "REFRESHCLIENT", payload: { client: dd } })
            // }

        });

        socket.on('error', (error) => {

        });

        socket.on("end", () => {

            // socket.destroy();
            // BackgroundJob.stop()
        })
        socket.on('close', (error) => {
            //socket.destroy();

        });



    }).listen(tcpPort, () => {

    });
    server.on('connection', async (client) => {
        // store.dispatch({ type: "ADDCONNECTEDCLIENT", payload: { client } });
        //     const RemoteHostIp = await AsyncStorage.getItem("RemoteHostIp");
        //     if (RemoteHostIp != "Master") {
        //         //client.connect()
        //     }
    });
    server.on('close', () => {

        // BackgroundJob.stop()
    });
    server.on('end', () => {

    });
    server.on('error', (e) => {

        if (e.code === 'EADDRINUSE') {

            setTimeout(() => {
                server.close();
                server.listen(tcpPort, () => {

                });
            }, 1000);
        }
    });
    return server;
};

const createClient = async (ip, data) => {
    if (clients[ip] == null) {
        clients[ip] = net.createConnection(tcpPort, ip, (socket) => {

            clients[ip].write(data, (err) => {

            })
            clients[ip].on('error', (err) => {

            })

        });
    } else {
        clients[ip].write(data)
    }
    // let chunk = ""
    // client.on('data', async (data) => {


    //     const d = Buffer.from(data, 'base64').toString('utf8')
    //     chunk += d;
    //     if (d.slice(-ENDOFFILE.length) == ENDOFFILE) {
    //         const payload = JSON.parse(Buffer.from(chunk.split(ENDOFFILE)[0], 'base64').toString('utf8'));
    //        
    //         // let { event } = payload
    //         // if (event == ActionType.client.deviceInfo) {
    //         //     const model = getModel()
    //         //     const brand = getBrand()
    //         //     const ip = await NetworkInfo.getIPV4Address();
    //         //     SendToMaster(ActionType.server.deviceType, { model, brand, ip })
    //         // } else if (event == ActionType.server.createLocalCommand) {
    //         //     const { command } = payload
    //         //     CommandController.create(command)

    //         // } else if (event == ActionType.server.createLocalBooking) {
    //         //     const { booking } = payload
    //         //     bookingController.CreateBookingRealm(booking)

    //         // } else if (event == ActionType.server.SendMenuToPeer) {
    //         //     
    //         // }
    //         // store.dispatch({ type: "REFERSHEDDATA" })
    //         chunk = ""
    //     }

    //     // const payload = JSON.parse(data);
    //     //
    //     // let { event } = payload
    //     // if (event == ActionType.client.deviceInfo) {
    //     //     const model = getModel()
    //     //     const brand = getBrand()
    //     //     const ip = await NetworkInfo.getIPV4Address();
    //     //     const d = JSON.stringify({ event: ActionType.server.deviceType, model, brand, ip })
    //     //     client.write(d)
    //     // }

    // });

    // client.on('error', (error) => {
    //    
    //     createClient(ip)
    //     client = null;
    // });

    // client.on('close', () => {
    //    
    //     client?.destroy();
    // });

    // client.on('end', () => {
    //    
    //     //  BackgroundJob.stop()
    // });

    // return client;
};

const getTcpServer = () => {
    return server
}
const getTcpClient = () => {
    return clients
}

// const isTcpConnected = async () => {
//     let hostip = null;
//     if (client == null) {
//         hostip = await AsyncStorage.getItem("RemoteHostIp")
//         client = await createClient(hostip)
//     }
//     if (client._state == 0 || client._state == 1) {
//         hostip = await AsyncStorage.getItem("RemoteHostIp")
//        
//         if (!ValidateIPaddress(hostip))
//             return false;

//         const newClient = await client.connect({
//             port: tcpPort,
//             host: hostip
//         })
//         await sleep(5000)
//         // alert(JSON.stringify(newClient, "", "\t"))
//         return newClient._state == 2
//     }
//     return client._state == 2

// }

// const isClientTcpConnected = async (cli) => {
//     if (cli._state == 0 || cli._state == 1) {
//         const newClient = await cli.connect({
//             port: tcpPort,
//             host: cli.address().address
//         })
//         await sleep(5000)
//         // alert(JSON.stringify(newClient, "", "\t"))
//         return newClient._state == 2
//     }
//     return cli._state == 2

// }

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

const getConnections = async () => {
    return server.getConnections && server.getConnections()
}

// const DestroyClient = () => {
//     client?.destroy();
//     client = null;
// }
const DestoryServer = () => {
    server != null && server.close();
    server != null && server.unref();
    server = null
    // store.getState().ConnectedClientReducer.map(({ client }) => {
    //     client.destroy();
    //     client?.unref()
    // })
    //  store.dispatch({ type: "CLEARALLCONNECTEDCLIENT" })
}



export {
    createTCPServer,
    createClient,
    getTcpServer,
    getConnections,
    getTcpClient,
    // isTcpConnected,
    // isClientTcpConnected,
    // DestroyClient,
    DestoryServer
}