import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api, { progressAPI } from '../services/api';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load lessons
      const lessonsRes = await api.get('/lessons');
      setLessons(lessonsRes.data.lessons || []);

      // Load stats
      try {
        const statsRes = await progressAPI.getStatistics();
        setStats(statsRes.data.statistics);
      } catch (err) {
        console.log('Stats not available');
      }

      // Load rooms
      try {
        const roomsRes = await api.get('/rooms');
        setRooms(roomsRes.data.rooms || []);
      } catch (err) {
        console.log('Rooms not available');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Welcome Section */}
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>
          Witaj, {user?.email?.split('@')[0]}! 👋
        </Text>
        <Text style={styles.welcomeSubtitle}>
          Kontynuuj naukę programowania!
        </Text>
      </View>

      {/* Stats Section */}
      {stats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Podsumowanie lekcji</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: '#e3f2fd' }]}>
              <Text style={styles.statNumber}>{lessons.length}</Text>
              <Text style={styles.statLabel}>📖 Wszystkich</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#f5f5f5' }]}>
              <Text style={styles.statNumber}>{stats.new || 0}</Text>
              <Text style={styles.statLabel}>🆕 Nowych</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#e3f2fd' }]}>
              <Text style={styles.statNumber}>{stats.inProgress || 0}</Text>
              <Text style={styles.statLabel}>⏳ W trakcie</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}>
              <Text style={styles.statNumber}>{stats.completed || 0}</Text>
              <Text style={styles.statLabel}>✅ Ukończonych</Text>
            </View>
          </View>
        </View>
      )}

      {/* Rooms Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚪 Pokoje współpracy</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Pokoje pozwalają na wspólną pracę nad kodem w czasie rzeczywistym.
          </Text>
          <View style={styles.roomsStats}>
            <Text style={styles.roomsNumber}>{rooms.length}</Text>
            <Text style={styles.roomsLabel}>Dostępnych pokoi</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Rooms')}
          >
            <Text style={styles.buttonText}>Zobacz pokoje →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Lessons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Ostatnie lekcje</Text>
        {lessons.slice(0, 5).map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            style={styles.lessonCard}
            onPress={() => navigation.navigate('LessonDetail', { lessonId: lesson.id })}
          >
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonMeta}>
                {lesson.difficulty} • {lesson.language === 'python' ? '🐍 Python' : '📜 JS'} • {lesson.durationMin} min
              </Text>
            </View>
            <Text style={styles.lessonArrow}>→</Text>
          </TouchableOpacity>
        ))}
        {lessons.length > 5 && (
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('Lessons')}
          >
            <Text style={styles.seeAllText}>Zobacz wszystkie lekcje ({lessons.length})</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    backgroundColor: '#fff',
    padding: 24,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  statCard: {
    width: '48%',
    margin: '1%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  roomsStats: {
    alignItems: 'center',
    marginBottom: 16,
  },
  roomsNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#764ba2',
  },
  roomsLabel: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#764ba2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  lessonCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 4,
  },
  lessonMeta: {
    fontSize: 12,
    color: '#666',
  },
  lessonArrow: {
    fontSize: 20,
    color: '#999',
  },
  seeAllButton: {
    padding: 16,
    alignItems: 'center',
  },
  seeAllText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
});
