/**
 * PlaceholderBase.js
 * Componente base reutilizable para todas las pantallas placeholder.
 * Vive en shared/components para que cualquier módulo lo importe.
 *
 * Props:
 *   navigation  — objeto de React Navigation
 *   icon        — emoji del módulo
 *   title       — nombre de la pantalla
 *   badge       — texto pequeño (ej. "Módulo 2 · RF09–RF11")
 *   items       — array de { icon, title, sub?, screen? }
 *   backScreen  — nombre de pantalla a la que regresa (opcional, default goBack)
 */
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';

export default function PlaceholderBase({
  navigation,
  icon,
  title,
  badge,
  items = [],
  backScreen,
}) {
  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => backScreen ? navigation.navigate(backScreen) : navigation.goBack()}
        >
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{title}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.heroCard}>
          <Text style={s.heroIcon}>{icon}</Text>
          <Text style={s.heroTitle}>{title}</Text>
          <View style={s.badge}>
            <Text style={s.badgeText}>{badge}</Text>
          </View>
          <Text style={s.heroSub}>
            Esta sección estará disponible próximamente. El módulo 1 ya funciona al 100%.
          </Text>
        </View>

        {items.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={s.itemCard}
            onPress={item.screen ? () => navigation.navigate(item.screen) : undefined}
            activeOpacity={item.screen ? 0.7 : 1}
          >
            <Text style={s.itemIcon}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.itemTitle}>{item.title}</Text>
              {item.sub ? <Text style={s.itemSub}>{item.sub}</Text> : null}
            </View>
            {item.screen && <Text style={s.itemArrow}>›</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#1a1a22' },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#2a2a35' },
  back:        { fontSize: 24, color: 'white' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: 'white' },
  content:     { padding: 20, paddingBottom: 40 },
  heroCard:    { backgroundColor: '#2a2a35', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20, gap: 8 },
  heroIcon:    { fontSize: 48, marginBottom: 4 },
  heroTitle:   { fontSize: 20, fontWeight: '800', color: 'white' },
  badge:       { backgroundColor: 'rgba(124,111,205,0.2)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(124,111,205,0.4)' },
  badgeText:   { fontSize: 11, color: '#7c6fcd', fontWeight: '600' },
  heroSub:     { fontSize: 12, color: '#666', textAlign: 'center', lineHeight: 18 },
  itemCard:    { backgroundColor: '#2a2a35', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  itemIcon:    { fontSize: 22, marginRight: 12 },
  itemTitle:   { fontSize: 14, fontWeight: '600', color: 'white' },
  itemSub:     { fontSize: 12, color: '#666', marginTop: 2 },
  itemArrow:   { fontSize: 22, color: '#555' },
});
