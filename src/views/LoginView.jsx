import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export function LoginView({ onLogin, onRegister }) {
  // TODO: local useState for email, password, isRegistering, error message
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SmartFit Planner</Text>
      {/* TODO: email TextInput */}
      {/* TODO: password TextInput (secureTextEntry) */}
      {/* TODO: LOGIN button → onLogin(email, password) */}
      {/* TODO: toggle Register / Login link */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 32 },
});
