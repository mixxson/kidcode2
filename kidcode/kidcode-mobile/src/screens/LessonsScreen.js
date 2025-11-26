import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import api, { progressAPI } from '../services/api';

export default function LessonsScreen({ navigation }) {
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState('all'); // all, new, in-progress, completed

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const lessonsRes = await api.get('/lessons');
      setLessons(lessonsRes.data.lessons || []);

      try {
        const progressRes = await progressAPI.getUserProgress();
        setProgress(progressRes.data.progress || []);
      } catch (err) {
        console.log('Progress not loaded');
      }
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getStatus = (lessonId) => {
    const entry = progress.find((p) => p.lessonId === lessonId);
    return entry ? entry.status : 'new';
  };

  const getFilteredLessons = () => {
    if (tab === 'all') return lessons;
    return lessons.filter((lesson) => {
      const status = getStatus(lesson.id);
      if (tab === 'new') return status === 'new';
      if (tab === 'in-progress') return status === 'in-progress';
      if (tab === 'completed') return status === 'completed';
      return true;
    });
  };

  const getStats = () => {
    return {
      all: lessons.length,
      new: lessons.filter((l) => getStatus(l.id) === 'new').length,
      inProgress: lessons.filter((l) => getStatus(l.id) === 'in-progress').length,
      completed: lessons.filter((l) => getStatus(l.id) === 'completed').length,
    };
  };

  const stats = getStats();
  const filteredLessons = getFilteredLessons();

  const getStatusInfo = (status) => {
    const statusMap = {
      new: { icon: '🆕', label: 'Nowa', color: '#999' },
      'in-progress': { icon: '⏳', label: 'W trakcie', color: '#2196F3' },
      completed: { icon: '✅', label: 'Ukończona', color: '#4CAF50' },
    };
    return statusMap[status] || statusMap.new;
  };

  const renderLesson = ({ item }) => {
    const status = getStatus(item.id);
    const statusInfo = getStatusInfo(status);

    return (
      <TouchableOpacity
        style={styles.lessonCard}
        onPress={() => navigation.navigate('LessonDetail', { lessonId: item.id })}
      >
        <View style={styles.lessonContent}>
          <View style={styles.lessonHeader}>
            <Text style={styles.lessonTitle}>{item.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.icon} {statusInfo.label}
              </Text>
            </View>
          </View>
          <View style={styles.lessonMeta}>
            <Text style={styles.metaText}>{item.difficulty}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>
              {item.language === 'python' ? '🐍 Python' : '📜 JS'}
            </Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>⏱️ {item.durationMin} min</Text>
          </View>
        </View>
        <Text style={styles.lessonArrow}>→</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'all' && styles.tabActive]}
          onPress={() => setTab('all')}
        >
          <Text style={[styles.tabText, tab === 'all' && styles.tabTextActive]}>
            📚 Wszystkie ({stats.all})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'new' && styles.tabActive]}
          onPress={() => setTab('new')}
        >
          <Text style={[styles.tabText, tab === 'new' && styles.tabTextActive]}>
            🆕 Nowe ({stats.new})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'in-progress' && styles.tabActive]}
          onPress={() => setTab('in-progress')}
        >
          <Text style={[styles.tabText, tab === 'in-progress' && styles.tabTextActive]}>
            ⏳ W trakcie ({stats.inProgress})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'completed' && styles.tabActive]}
          onPress={() => setTab('completed')}
        >
          <Text style={[styles.tabText, tab === 'completed' && styles.tabTextActive]}>
            ✅ Ukończone ({stats.completed})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lessons List */}
      <FlatList
        data={filteredLessons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLesson}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Brak lekcji w tej kategorii</Text>
          </View>
        }
      />
    </View>
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 2,
  },
  tabActive: {
    backgroundColor: '#667eea',
  },
  tabText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  lessonCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lessonContent: {
    flex: 1,
  },
  lessonHeader: {
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  metaDot: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 6,
  },
  lessonArrow: {
    fontSize: 20,
    color: '#999',
    marginLeft: 12,
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});
