import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius } from "../theme";

export function RegisterView(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function emailACB(text) {
    setEmail(text);
  }

  function passwordACB(text) {
    setPassword(text);
  }

  function registerACB() {
    if (!email.trim() || !password.trim()) {
      return;
    }
    props.onRegister(email, password);
  }

  function backACB() {
    router.push("/login");
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
        placeholder="Password (min. 6 characters)"
        value={password}
        onChangeText={passwordACB}
        editable={!props.isLoading}
        secureTextEntry={true}
      />

      {props.error && <Text style={styles.errorText}>{props.error}</Text>}

      <Pressable onPress={registerACB} disabled={props.isLoading} style={styles.button}>
        {props.isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </Pressable>

      <Pressable onPress={backACB} disabled={props.isLoading} style={styles.backButton}>
        <Text style={styles.backButtonText}>Already have an account? Log in</Text>
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
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginVertical: 10,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  backButton: {
    padding: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 14,
  },
});
