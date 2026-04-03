import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius } from "../theme";

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
  function forgotACB(){
    router.push('/forgot-password')
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SmartFit Planner</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={emailACB}
          editable={!props.isLoading}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={passwordACB}
          editable={!props.isLoading}
          secureTextEntry={true}
        />

        {props.error && <Text style={styles.errorText}>{props.error}</Text>}

        <Pressable style={styles.button} disabled={props.isLoading} onPress={loginACB}>
          {props.isLoading?(
            <ActivityIndicator color="#ffffff" />
          ):(<Text style={styles.buttonText}>Login</Text>) }
        </Pressable>

        <Pressable style={styles.backButton} disabled={props.isLoading} onPress={registerACB}>
          <Text style={styles.backButtonText}>New user? Create an account</Text>
        </Pressable>

        <Pressable style={styles.backButton} disabled={props.isLoading} onPress={forgotACB}>
          <Text style={styles.backButtonText}>Forget password? Create a new one</Text>
        </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
      height: 50,
      borderColor: colors.border,
      borderWidth: 1,
      padding: 12,
      marginVertical: 10,
      backgroundColor: colors.card,
      borderRadius: radius.sm,
      fontSize: 16,
  },
    button: {
    backgroundColor: colors.primary,
    padding: 15,
    marginVertical: 15,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 50,
  },
  buttonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    padding: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 14,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginVertical: 10,
    paddingHorizontal: 10,
    textAlign: "center",
  },
}
);
