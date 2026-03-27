import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export function RegisterView(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading = false, error = null } = props;

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
        placeholder="邮箱"
        value={email}
        onChangeText={emailACB}
        editable={!isLoading}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="密码（至少6个字符）"
        value={password}
        onChangeText={passwordACB}
        editable={!isLoading}
        secureTextEntry={true}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable onPress={registerACB} disabled={isLoading} style={styles.button}>
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>注册</Text>
        )}
      </Pressable>

      <Pressable onPress={backACB} disabled={isLoading} style={styles.backButton}>
        <Text style={styles.backButtonText}>返回登录</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 24,
    backgroundColor: "#f5f5f5"
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 32 
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 12,
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    marginVertical: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#d32f2f",
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
    color: "#1976d2",
    fontSize: 14,
  },
});
