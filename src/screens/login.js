import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, ScrollView, TouchableHighlight, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { TextInput } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { LogoDark } from '../assets';
import Button from '../components/Button/Button';
import { askForAccess } from '../redux/actions/userActions';
const LoginScreen = () => {
  const [credential, setCredential] = useState({ email: '', password: '' });
  const [pwdShow, setPwdShow] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();


  const userData = async () => {
    setError(false)
    const info = {
      brand: await DeviceInfo.getBrand(),
      model: await DeviceInfo.getModel(),
      systemVersion: await DeviceInfo.getSystemVersion(),
      uniqueId: await DeviceInfo.getUniqueId(),
      deviceName: await DeviceInfo.getDeviceName(),
      deviceType: await DeviceInfo.getDeviceType(),
      systemName: await DeviceInfo.getSystemName(),
      manufacturer: await DeviceInfo.getManufacturer(),
      buildId: await DeviceInfo.getBuildId(),
      isEmulator: await DeviceInfo.isEmulator(),
      isTablet: await DeviceInfo.isTablet(),
      userAgent: await DeviceInfo.getUserAgent(),
      version: await DeviceInfo.getVersion(),
      ipAddress: await DeviceInfo.getIpAddress(),
      macAddress: await DeviceInfo.getMacAddress(),
      totalMemory: await DeviceInfo.getTotalMemory(),
      freeDiskStorage: await DeviceInfo.getFreeDiskStorage(),
      totalDiskCapacity: await DeviceInfo.getTotalDiskCapacity(),
      software: 'POS'

    };
    dispatch(askForAccess({ ...credential, deviceInfo: info }, (e) => {
      if (e == 'USER_AUTH_LOGIN_FAILED')
        setError(true)
      else if (e == 'USER_NOT_MATCH_DEVICE')
        Alert.alert(
          'Access Denied',
          'You are not allowed to use this account on this device. \nplease contact your administrator'
        )
      else {
        alert('Please check your internet connection and try again')
      }
    }))
  }
  return (
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
      < ScrollView style={{ backgroundColor: "white" }} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
        <Image source={LogoDark} style={{ width: 120, height: 120 }} />
        <View style={{ minWidth: 500, gap: 10, marginVertical: 25 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', width: 350, justifyContent: 'center', alignItems: 'center' }}>
              <TextInput
                accessibilityLabel="email-input"
                testID="email-input"
                error={error}
                style={{ width: 350 }}
                mode='outlined'
                left={<TextInput.Icon icon="email" />}
                label={'Enter Your Email'}
                placeholder="Email"
                keyboardType="email-address"
                value={credential.email}
                onChangeText={(txt) => setCredential(e => { return { ...e, email: txt } })} />
            </View>
            <View style={{ flexDirection: 'row', width: 350, justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
              <TextInput
                testID='password-input'
                accessibilityLabel="password-input"
                error={error}
                style={{ width: 350 }}
                mode='outlined'
                left={<TextInput.Icon icon="lock" />}
                label={'Enter Your Password'}
                placeholder="Password"
                secureTextEntry={!pwdShow}
                value={credential.password}
                onChangeText={(txt) => setCredential(e => { return { ...e, password: txt } })} />
              <TouchableHighlight

                underlayColor style={{ position: 'absolute', right: 0, top: 5, bottom: 0, width: 50, justifyContent: 'center', alignItems: 'center' }} onPress={() => { setPwdShow((e) => !e) }}>
                <Ionicons
                  name={pwdShow ? 'eye-off' : 'eye'}
                  color={'#999'}
                  size={20}
                />
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <Button testID='login-button'
          accessibilityLabel="login-button"
          text='Log in' onPress={userData} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};



export default LoginScreen