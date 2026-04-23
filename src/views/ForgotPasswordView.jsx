import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { colors, radius } from "../theme";

export function ForgotPasswordView({
  onSendResetEmail,
  onBackToLogin,
  isLoading,
  error,
}) {
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we&apos;ll send you a password reset link.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!isLoading}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={() => onSendResetEmail(email)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.card} />
        ) : (
          <Text style={styles.buttonText}>Send Reset Email</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onBackToLogin} disabled={isLoading}>
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
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
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    padding: 12,
    marginVertical: 10,
    fontSize: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginVertical: 10,
    paddingHorizontal: 10,
    textAlign: "center",
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
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: colors.primary,
    textAlign: "center",
  },
});
