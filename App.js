import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, Modal, View } from "react-native";
import { useContext, useState } from "react";

import { GlobalStyles } from "./constant/styles";
import { ROUTES } from "./constant/routes";

import PosledneVydavky from "./screens/PosledneVydavky";
import VsetkyVydavky from "./screens/VsetkyVydavky";
import SpravaVydavku from "./screens/SpravaVydavku";
import MapaScreen from "./screens/MapaScreen";
import SignUp from "./screens/signUp";
import SignIn from "./screens/signIn";
import IconTlacitko from "./components/UI/IconTlacitko";
import VydavkyContextProvider from "./store/vydavky-context";
import AuthContextProvider, { AuthContext } from "./store/auth-context";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function PrehladVydavkov({ navigation }) {
  const authCtx = useContext(AuthContext);
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);

  function handleLogout() {
    authCtx.logout();
    navigation.replace(ROUTES.LOGIN);
  }

  return (
    <>
      <BottomTabs.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
          headerTintColor: "white",
          tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
          tabBarActiveTintColor: GlobalStyles.colors.accent500,
          headerLeft: () => {
            const fullEmail = authCtx.email || "";
            const shortEmail =
              fullEmail.length > 10
                ? fullEmail.substring(0, 10) + "..."
                : fullEmail || "Neznamy";

            return (
              <TouchableOpacity onPress={() => setShowEmailTooltip(true)}>
                <Text
                  style={{
                    color: "white",
                    marginLeft: 16,
                    fontSize: 13,
                    opacity: 0.8,
                  }}
                >
                  Prihlaseny:
                  {"\n"}
                  {shortEmail}
                </Text>
              </TouchableOpacity>
            );
          },
          headerRight: ({ tintColor }) => (
            <IconTlacitko
              ikona="add-circle"
              size={32}
              color={tintColor}
              onPress={() => {
                navigation.navigate(ROUTES.MANAGE_EXPENSE);
              }}
            />
          ),
        })}
      >
        <BottomTabs.Screen
          name={ROUTES.RECENT_EXPENSES}
          component={PosledneVydavky}
          options={{
            title: "Posledne vydavky",
            tabBarLabel: "Posledne",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="hourglass" size={size} color={color} />
            ),
          }}
        />
        <BottomTabs.Screen
          name={ROUTES.ALL_EXPENSES}
          component={VsetkyVydavky}
          options={{
            title: "Vsetky vydavky",
            tabBarLabel: "Vsetky",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
        <BottomTabs.Screen
          name={ROUTES.LOGOUT}
          component={() => null}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleLogout();
            },
          }}
          options={{
            tabBarLabel: "Odhlasit",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="log-out-outline" size={size} color={color} />
            ),
          }}
        />
      </BottomTabs.Navigator>

      {showEmailTooltip && (
        <Modal transparent={true} visible={showEmailTooltip} animationType="fade">
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setShowEmailTooltip(false)}
          >
            <View
              style={{
                position: "absolute",
                top: 90,
                left: 16,
                backgroundColor: "white",
                padding: 12,
                borderRadius: 8,
                elevation: 8,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
              }}
            >
              <Text
                style={{
                  color: GlobalStyles.colors.primary700,
                  fontWeight: "bold",
                  marginBottom: 4,
                }}
              >
                Prihlaseny ako:
              </Text>
              <Text style={{ color: "gray", fontSize: 14 }}>
                {authCtx.email || "Nie ste prihlaseny"}
              </Text>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AuthContextProvider>
        <VydavkyContextProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name={ROUTES.LOGIN}
                component={SignIn}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={ROUTES.SIGN_UP}
                component={SignUp}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={ROUTES.OVERVIEW}
                component={PrehladVydavkov}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={ROUTES.MANAGE_EXPENSE}
                component={SpravaVydavku}
                options={{ title: "Sprava vydavku" }}
              />
              <Stack.Screen
                name={ROUTES.MAP}
                component={MapaScreen}
                options={{ title: "Mapa" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </VydavkyContextProvider>
      </AuthContextProvider>
    </>
  );
}
