import { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { signIn } from "../util/auth";
import { GlobalStyles } from "../constant/styles";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../store/auth-context";
import { ROUTES } from "../constant/routes";

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const authCtx = useContext(AuthContext);

  async function handleSignIn() {
    setEmailError(false);
    setPasswordError(false);

    try {
      const data = await signIn(email, password);
      authCtx.authenticate(data.idToken, data.email);
      navigation.replace(ROUTES.OVERVIEW);
    } catch (error) {
      const errorMsg = error.response?.data?.error?.message || "";

      if (errorMsg.includes("EMAIL")) {
        setEmailError(true);
      } else if (errorMsg.includes("PASSWORD")) {
        setPasswordError(true);
      } else {
        setEmailError(true);
        setPasswordError(true);
      }
    }
  }

  function handleEmailChange(text) {
    setEmail(text);
    setEmailError(false);
  }

  function handlePasswordChange(text) {
    setPassword(text);
    setPasswordError(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prihlasenie</Text>
      <TextInput
        style={[styles.input, emailError && styles.errorInput]}
        placeholder="E-mail"
        placeholderTextColor={GlobalStyles.colors.primary100}
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={[styles.passwordContainer, passwordError && styles.errorInput]}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Heslo"
          placeholderTextColor={GlobalStyles.colors.primary100}
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setPasswordVisible(!isPasswordVisible)}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color={GlobalStyles.colors.primary100}
          />
        </TouchableOpacity>
      </View>
      <Button
        title="Prihlasit sa"
        onPress={handleSignIn}
        color={GlobalStyles.colors.accent500}
      />
      <TouchableOpacity
        onPress={() => navigation.replace(ROUTES.SIGN_UP)}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>Nemas ucet? Zaregistruj sa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary500,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary100,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    color: "black",
    backgroundColor: "white",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary100,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "white",
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "black",
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 2,
  },
  eyeIcon: {
    padding: 10,
  },
  linkContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    color: GlobalStyles.colors.accent500,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
