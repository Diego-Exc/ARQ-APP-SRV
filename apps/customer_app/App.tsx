import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { api } from "./src/api/client";
import { colors } from "./src/theme/colors";

export default function App(): JSX.Element {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api.ensureDemoSession().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
});
