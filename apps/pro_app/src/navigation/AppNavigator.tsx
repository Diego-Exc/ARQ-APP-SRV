import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { LoginScreen } from "../screens/LoginScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { IncomingRequestsScreen } from "../screens/IncomingRequestsScreen";
import { ServiceDetailScreen } from "../screens/ServiceDetailScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { EarningsScreen } from "../screens/EarningsScreen";
import { NotificationsScreen } from "../screens/NotificationsScreen";
import { ScheduleScreen } from "../screens/ScheduleScreen";
import { SupportScreen } from "../screens/SupportScreen";

export type MainTabParamList = {
  HomeTab: undefined;
  RequestsTab: undefined;
  EarningsTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  ServiceDetail: { requestId: string };
  Notifications: undefined;
  Schedule: undefined;
  Support: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICON: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  HomeTab: "home",
  RequestsTab: "briefcase",
  EarningsTab: "cash",
  ProfileTab: "person",
};

function MainTabs(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: keyof MainTabParamList } }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { borderTopColor: colors.border },
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Ionicons name={TAB_ICON[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: "Inicio" }} />
      <Tab.Screen name="RequestsTab" component={IncomingRequestsScreen} options={{ title: "Solicitudes" }} />
      <Tab.Screen name="EarningsTab" component={EarningsScreen} options={{ title: "Ganancias" }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  );
}

export function AppNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} options={{ headerShown: true, title: "Servicio en curso" }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true, title: "Notificaciones" }} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ headerShown: true, title: "Mi horario" }} />
        <Stack.Screen name="Support" component={SupportScreen} options={{ headerShown: true, title: "Ayuda y soporte" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
