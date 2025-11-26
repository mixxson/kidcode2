import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import api, { progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LessonDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { lessonId } = route.params;

  const [lesson, setLesson] = useState(null);
  const [status, setStatus] = useState('new');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/lessons/${lessonId}`);
      setLesson(response.data.lesson);

      // Load progress status
      try {
        const progressRes = await progressAPI.getLessonProgress(lessonId);
        setStatus(progressRes.data.progress?.status || 'new');
      } catch (err) {
        setStatus('new');
      }
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się załadować lekcji');
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLesson();
    setRefreshing(false);
  };

  const handleStartCoding = async () => {
    // Mark as in-progress when starting to code
    if (status === 'new') {
      try {
        await progressAPI.updateLessonProgress(lessonId, 'in-progress');
        setStatus('in-progress');
      } catch (err) {
        console.error('Failed to update progress:', err);
      }
    }
    navigation.navigate('Editor', { lessonId, lesson });
  };

  const handleMarkComplete = async () => {
    try {
      await progressAPI.updateLessonProgress(lessonId, 'completed');
      setStatus('completed');
      Alert.alert('🎉 Gratulacje!', 'Lekcja oznaczona jako zakończona!');
    } catch (err) {
      Alert.alert('Błąd', 'Nie udało się zapisać postępu');
      console.error('Failed to mark as complete:', err);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Usunąć lekcję?',
      'Czy na pewno chcesz usunąć tę lekcję?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/lessons/${lessonId}`);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Błąd', 'Nie udało się usunąć lekcji');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Ładowanie lekcji...</Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ Nie znaleziono lekcji</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Powrót</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const difficultyColors = {
    'Łatwy': '#10b981',
    'Średni': '#f59e0b',
    'Trudny': '#ef4444',
  };

  const statusBadges = {
    new: { bg: '#e5e7eb', color: '#6b7280', label: 'Nowa', icon: '🆕' },
    'in-progress': { bg: '#dbeafe', color: '#1d4ed8', label: 'W trakcie', icon: '⏳' },
    completed: { bg: '#d1fae5', color: '#059669', label: 'Zakończona', icon: '✅' },
  };

  const statusInfo = statusBadges[status];
  const isTeacherOrAdmin = user && (user.role === 'teacher' || user.role === 'admin');

  // Create HTML content with styling for WebView
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 16px;
          margin: 0;
          font-size: 16px;
          line-height: 1.6;
          color: #1f2937;
        }
        h1, h2, h3, h4 {
          margin-top: 16px;
          margin-bottom: 8px;
          color: #111827;
        }
        h3 { font-size: 20px; }
        p { margin: 12px 0; }
        ul, ol {
          margin: 12px 0;
          padding-left: 24px;
        }
        li { margin: 6px 0; }
        code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: #dc2626;
        }
        pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 16px 0;
        }
        pre code {
          background: transparent;
          color: #f9fafb;
          padding: 0;
        }
      </style>
    </head>
    <body>
      ${lesson.content}
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{lesson.title}</Text>

          {/* Badges */}
          <View style={styles.badgesContainer}>
            <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
              <Text style={[styles.badgeText, { color: statusInfo.color }]}>
                {statusInfo.icon} {statusInfo.label}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: difficultyColors[lesson.difficulty] + '30' },
              ]}
            >
              <Text
                style={[styles.badgeText, { color: difficultyColors[lesson.difficulty] }]}
              >
                {lesson.difficulty}
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⏱️ {lesson.durationMin} min</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                💻 {lesson.language === 'javascript' ? 'JavaScript' : 'Python'}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={styles.webview}
            scrollEnabled={false}
            injectedJavaScript={`
              window.ReactNativeWebView.postMessage(document.body.scrollHeight);
            `}
            onMessage={(event) => {
              // Auto-resize WebView based on content height
              const height = Number(event.nativeEvent.data);
              if (height > 0) {
                // This would need state to dynamically set height
              }
            }}
          />
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          {/* Start/Continue Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={handleStartCoding}>
            <Text style={styles.primaryButtonText}>
              💻 {status === 'new' ? 'Rozpocznij kodowanie' : 'Kontynuuj kodowanie'}
            </Text>
          </TouchableOpacity>

          {/* Mark Complete Button */}
          {status !== 'completed' && (
            <TouchableOpacity style={styles.secondaryButton} onPress={handleMarkComplete}>
              <Text style={styles.secondaryButtonText}>✅ Oznacz jako zakończoną</Text>
            </TouchableOpacity>
          )}

          {/* Completed Badge */}
          {status === 'completed' && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>🎉 Lekcja ukończona!</Text>
            </View>
          )}

          {/* Admin Actions */}
          {isTeacherOrAdmin && (
            <View style={styles.adminActions}>
              <TouchableOpacity style={styles.adminButton}>
                <Text style={styles.adminButtonText}>✏️ Edytuj lekcję</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.adminButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Text style={[styles.adminButtonText, styles.deleteButtonText]}>
                  🗑️ Usuń
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  contentContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 200,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
    minHeight: 300,
  },
  actionsContainer: {
    padding: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 15,
    fontWeight: '600',
  },
  completedBadge: {
    backgroundColor: '#d1fae5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completedText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: 'bold',
  },
  adminActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  adminButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  adminButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
  },
  deleteButtonText: {
    color: '#dc2626',
  },
});
