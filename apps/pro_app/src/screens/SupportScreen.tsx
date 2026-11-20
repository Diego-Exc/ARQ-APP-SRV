import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { faqItems } from "../data/mock";

export function SupportScreen(): React.JSX.Element {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Ayuda y soporte</Text>

      <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL("tel:+573000000000")}>
        <View style={styles.contactIcon}>
          <Ionicons name="call" size={20} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.contactTitle}>Línea de soporte técnico</Text>
          <Text style={styles.contactSubtitle}>Disponible 24/7 para urgencias</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Preguntas frecuentes</Text>
      {faqItems.map((item) => {
        const open = openId === item.id;
        return (
          <TouchableOpacity key={item.id} style={styles.faqCard} onPress={() => setOpenId(open ? null : item.id)}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Ionicons name={open ? "chevron-up" : "chevron-down"} size={16} color={colors.textSecondary} />
            </View>
            {open ? <Text style={styles.faqAnswer}>{item.answer}</Text> : null}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 20, fontWeight: "700", color: colors.primary, marginBottom: 14 },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  contactTitle: { color: colors.textPrimary, fontWeight: "700", fontSize: 13 },
  contactSubtitle: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  sectionTitle: { fontWeight: "700", color: colors.textPrimary, marginBottom: 10 },
  faqCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  faqHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  faqQuestion: { color: colors.textPrimary, fontWeight: "600", fontSize: 13, flex: 1, marginRight: 8 },
  faqAnswer: { color: colors.textSecondary, fontSize: 12, marginTop: 10, lineHeight: 18 },
});
