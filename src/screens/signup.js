// import React, { useState } from 'react';
// import { View, TextInput, Alert, StyleSheet, SafeAreaView, ScrollView, Text } from 'react-native';
// import Button from '../components/Button/Button';
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// import FontAwesome from 'react-native-vector-icons/FontAwesome'

// const SignupScreen = (navigation) => {
//     const [fullname, setFullname] = useState('');
//     const [email, setEmail] = useState('');
//     const [phonenumber, setPhoneNumber] = useState('');
//     const [password, setPassword] = useState('');
//     const [repassword, setRepassword] = useState('');

//     const handleSignup = () => {
//        

//         
//         if (
//             fullname === '' ||
//             email === '' ||
//             phonenumber === '' ||
//             password === '' ||
//             repassword === ''
//         ) {
//             Alert.alert('Erreur', 'Veuillez remplir tous les champs');
//         } else if (password !== repassword) {
//             Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
//         } else {
//            
//             
//             Alert.alert('Succès', 'Inscription réussie!');
//         }
//     };


//     return (
//         <SafeAreaView >
//             <ScrollView style={styles.mainContaineur}>
//                 <Text style={styles.mainHeader} >Sign Up </Text>
//                 <View style={[styles.inputContainer, { paddingBottom: 15 }]} >
//                     <MaterialIcons name="person" style={{ fontSize: 30 }} />
//                     <TextInput
//                         style={[styles.input, { paddingVertical: 0 }]}
//                         placeholder="Nom complet"
//                         value={fullname}
//                         onChangeText={text => setFullname(text)}
//                     />
//                 </View>
//                 <View style={[styles.inputContainer, { paddingBottom: 12 }]}>
//                     <MaterialIcons name="alternate-email" style={{ fontSize: 30 }} />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Email"
//                         value={email}
//                         onChangeText={text => setEmail(text)}
//                     />
//                 </View>
//                 <View style={[styles.inputContainer, { paddingBottom: 9 }]}>
//                     < FontAwesome name="phone" style={{ fontSize: 30 }} />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Numéro de téléphone"
//                         value={phonenumber}
//                         onChangeText={text => setPhoneNumber(text)}
//                     />
//                 </View>
//                 <View style={[styles.inputContainer, { paddingBottom: 6 }]}>
//                     <Ionicons name="ios-lock-closed-outline" style={{ fontSize: 30 }}></Ionicons>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Mot de passe"
//                         secureTextEntry
//                         value={password}
//                         onChangeText={text => setPassword(text)}
//                     />
//                 </View>
//                 <View style={[styles.inputContainer, { paddingBottom: 1 }]}>
//                     <Ionicons name="ios-lock-closed-outline" style={{ fontSize: 30 }}></Ionicons>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Confirmer le mot de passe"
//                         secureTextEntry
//                         value={repassword}
//                         onChangeText={text => setRepassword(text)}
//                     />
//                 </View>
//                 <Button text="S'inscrire" onPress={handleSignup} color={"gray"} style={styles.button} />
//             </ScrollView>
//         </SafeAreaView>
//     );
// };
// const styles = StyleSheet.create({
//     mainContaineur: {
//         paddingHorizontal: 300
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         borderBottomColor: '#ccc',
//         borderBottomWidth: 2,
//         marginBottom: 10,

//     },
//     input: {
//         flex: 1,
//         paddingVertical: 0
//     },
//     button: {
//         paddingVertical: 70
//     },
//     mainHeader: {
//         fontFamily: "Roboto-Medium",
//         fontSize: 40,
//         fontWeight: "600",
//         color: "#333",
//         marginBottom: 40,
//         paddingTop: 70,
//         paddingLeft: 140
//     },
// })

// export default SignupScreen;
