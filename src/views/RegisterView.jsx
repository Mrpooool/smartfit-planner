import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export function RegisterView(props) {
  const [email,setemail]=useState("")
  const [password,setpassword]=useState("")
  function emailACB(text){
    setemail(text)
  }
  function passwordACB(text){
    setpassword(text)
  }
  function registerACB(){
    props.onRegister(email,password)
  }
  function backACB(){
    router.push('/login')
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SmartFit Planner</Text>
        <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 10, margin: 10, backgroundColor: 'white' }}
                placeholder="enter email"
                value={email}
                onChangeText={emailACB}
        />
        <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 10, margin: 10, backgroundColor: 'white' }}
                placeholder="enter password"
                value={password}
                onChangeText={passwordACB}
                secureTextEntry={true}
        />
        <Pressable onPress={registerACB}>
          <Text>Register</Text>
        </Pressable>
        <Pressable onPress={backACB}>
          <Text>back to login</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 32 },
});
