import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { BROADCAST_ADDR, updPort } from '../utils/config';
import { getUdpSocket } from '../utils/Udp/services';


const WebRtcScreen = () => {
  const [txt, setTxt] = useState('')
  const [data, setData] = useState([])


  useEffect(() => {

    getUdpSocket()?.on('message', async function (msg, rinfo) {
      const data = JSON.parse(msg.toString())



    })
  }, [])
  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 15 }}>
        <Text>Settings WebRTC</Text>
        <Text style={{}}>Discovery</Text>
        <TouchableHighlight style={{ padding: 25 }} onPress={async () => {
       
          let message = JSON.stringify({ event: 'CONNECT_TO_ME' })
          getUdpSocket().send(message, 0, message.length, updPort, BROADCAST_ADDR, function (err) {});
        }}>
          <Text>list Devices</Text>
        </TouchableHighlight>
        <Text style={{}}>Discovery</Text>
        <TouchableHighlight style={{ padding: 25 }} onPress={async () => {
          console.log(JSON.stringify(devices, '', '\t'))
        }}>
          <Text>llist</Text>
        </TouchableHighlight>


        <View>
          {
            data?.map((e) => {
              return (
                <Text>{e}</Text>
              )
            })
          }
        </View>
        <TextInput value={txt} onChangeText={(txt) => setTxt(txt)} style={{ borderColor: 'black', borderWidth: 1 }} />
        {
          <TouchableHighlight onPress={() => {
            console.log(Object.keys(devices))
            Object.keys(devices).map((e) => {

              devices[e]?.dc?.send(txt)
            })
            setTxt('')
          }}>
            <Text style={{ padding: 20 }}>Send Hi to all</Text>
          </TouchableHighlight>

        }
      </View>
    </ScrollView>
  )
}

export { WebRtcScreen };

const styles = StyleSheet.create({})