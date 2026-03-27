import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export function LoginView(props) {
  const [email,setemail]=useState("")
  const [password,setpassword]=useState("")
  function emailACB(text){
    setemail(text)
  }
  function passwordACB(text){
    setpassword(text)
  }
  function loginACB(){
    props.onLogin(email,password)
  }
  function registerACB(){
    router.push('/register')
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
        <Pressable onPress={loginACB}>
          <Text>Login</Text>
        </Pressable>
        <Pressable onPress={registerACB}>
          <Text>New user? Create an account</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 32 },
});
