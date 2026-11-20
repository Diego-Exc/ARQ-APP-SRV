import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { restoreSession } from "./src/api/client";
import { colors } from "./src/theme/colors";

export default function App(): React.JSX.Element {
  const [initialRoute, setInitialRoute] = useState<"Home" | "Login" | null>(null);

  useEffect(() => {
    setInitialRoute(restoreSession() ? "Home" : "Login");
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return <AppNavigator initialRouteName={initialRoute} />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
});
