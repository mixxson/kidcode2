import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { progressAPI } from '../services/api';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await progressAPI.getStatistics();
      setStats(response.data.statistics);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Wylogować się?',
      'Czy na pewno chcesz się wylogować?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Wyloguj',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'O aplikacji',
      'KidCode Mobile v1.0\n\nAplikacja do nauki programowania dla dzieci.\n\nDostępne języki:\n• JavaScript\n• Python (tylko w wersji web)\n\nFunkcje:\n• Interaktywne lekcje\n• Edytor kodu\n• Śledzenie postępów\n• Pokoje współpracy (wkrótce)'
    );
  };

  const getRoleBadge = (role) => {
    const badges = {
      student: { emoji: '👨‍🎓', label: 'Uczeń', color: '#3b82f6' },
      teacher: { emoji: '👨‍🏫', label: 'Nauczyciel', color: '#10b981' },
      admin: { emoji: '👑', label: 'Administrator', color: '#f59e0b' },
    };
    return badges[role] || badges.student;
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ Nie jesteś zalogowany</Text>
      </View>
    );
  }

  const roleBadge = getRoleBadge(user.role);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{user.email?.charAt(0).toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.email}>{user.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: roleBadge.color + '20' }]}>
          <Text style={[styles.roleText, { color: roleBadge.color }]}>
            {roleBadge.emoji} {roleBadge.label}
          </Text>
        </View>
      </View>

      {/* Statistics */}
      {loading ? (
        <View style={styles.statsLoading}>
          <ActivityIndicator size="small" color="#667eea" />
        </View>
      ) : stats ? (
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 Twoje statystyki</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: '#e0e7ff' }]}>
              <Text style={styles.statNumber}>{stats.all || 0}</Text>
              <Text style={styles.statLabel}>Wszystkie lekcje</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#dbeafe' }]}>
              <Text style={styles.statNumber}>{stats['in-progress'] || 0}</Text>
              <Text style={styles.statLabel}>W trakcie</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#d1fae5' }]}>
              <Text style={styles.statNumber}>{stats.completed || 0}</Text>
              <Text style={styles.statLabel}>Ukończonych</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
              <Text style={styles.statNumber}>
                {stats.all > 0 ? Math.round((stats.completed / stats.all) * 100) : 0}%
              </Text>
              <Text style={styles.statLabel}>Postęp</Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Ustawienia</Text>
        
        <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
          <Text style={styles.settingIcon}>ℹ️</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>O aplikacji</Text>
            <Text style={styles.settingDescription}>Informacje o wersji i funkcjach</Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => Alert.alert('Wkrótce', 'Funkcja w przygotowaniu!')}
        >
          <Text style={styles.settingIcon}>🌙</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Tryb ciemny</Text>
            <Text style={styles.settingDescription}>Wkrótce dostępne</Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => Alert.alert('Wkrótce', 'Funkcja w przygotowaniu!')}
        >
          <Text style={styles.settingIcon}>🔔</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Powiadomienia</Text>
            <Text style={styles.settingDescription}>Zarządzaj powiadomieniami</Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => Alert.alert('Wkrótce', 'Funkcja w przygotowaniu!')}
        >
          <Text style={styles.settingIcon}>🌐</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Język</Text>
            <Text style={styles.settingDescription}>Polski</Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Konto</Text>
        
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => Alert.alert('Wkrótce', 'Zmiana hasła będzie dostępna wkrótce!')}
        >
          <Text style={styles.settingIcon}>🔐</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Zmień hasło</Text>
            <Text style={styles.settingDescription}>Zaktualizuj swoje hasło</Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, styles.logoutItem]} onPress={handleLogout}>
          <Text style={styles.settingIcon}>🚪</Text>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, styles.logoutText]}>Wyloguj się</Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>KidCode Mobile v1.0</Text>
        <Text style={styles.footerText}>© 2025 KidCode Team</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#667eea',
  },
  email: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsLoading: {
    padding: 20,
    alignItems: 'center',
  },
  statsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  settingArrow: {
    fontSize: 18,
    color: '#9ca3af',
  },
  logoutItem: {
    borderColor: '#fee2e2',
    borderWidth: 1,
  },
  logoutText: {
    color: '#dc2626',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
});
