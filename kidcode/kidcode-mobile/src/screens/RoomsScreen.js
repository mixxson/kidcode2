import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function RoomsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error('Error loading rooms:', error);
      Alert.alert('Błąd', 'Nie udało się załadować pokoi');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRooms();
  };

  const handleCreateRoom = () => {
    Alert.alert(
      'Funkcja w przygotowaniu',
      'Tworzenie pokoi będzie dostępne wkrótce w wersji mobilnej!'
    );
  };

  const handleJoinRoom = (room) => {
    Alert.alert(
      'Dołącz do pokoju',
      `Czy chcesz dołączyć do pokoju "${room.name}"?`,
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Dołącz',
          onPress: () => {
            navigation.navigate('CodeRoom', { roomId: room.id, room });
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Ładowanie pokoi...</Text>
      </View>
    );
  }

  const isTeacherOrAdmin = user && (user.role === 'teacher' || user.role === 'admin');

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🚪 Pokoje współpracy</Text>
          <Text style={styles.headerSubtitle}>
            Dołącz do pokoju aby pracować nad kodem z innymi uczniami w czasie rzeczywistym
          </Text>
        </View>

        {/* Create Room Button (Teacher/Admin only) */}
        {isTeacherOrAdmin && (
          <View style={styles.createContainer}>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateRoom}>
              <Text style={styles.createButtonText}>➕ Utwórz nowy pokój</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Rooms List */}
        {rooms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>Brak dostępnych pokoi</Text>
            <Text style={styles.emptyText}>
              {isTeacherOrAdmin
                ? 'Utwórz pierwszy pokój aby rozpocząć współpracę!'
                : 'Poczekaj aż nauczyciel utworzy pokój.'}
            </Text>
          </View>
        ) : (
          <View style={styles.roomsList}>
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onPress={() => handleJoinRoom(room)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Room Card Component
function RoomCard({ room, onPress }) {
  const isActive = room.participants && room.participants.length > 0;

  return (
    <TouchableOpacity style={styles.roomCard} onPress={onPress}>
      <View style={styles.roomHeader}>
        <View style={styles.roomTitleContainer}>
          <Text style={styles.roomIcon}>🚪</Text>
          <View>
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomCreator}>Utworzony przez: {room.creatorEmail}</Text>
          </View>
        </View>
        {isActive && <View style={styles.activeBadge} />}
      </View>

      {room.description && (
        <Text style={styles.roomDescription}>{room.description}</Text>
      )}

      <View style={styles.roomFooter}>
        <View style={styles.roomStat}>
          <Text style={styles.roomStatIcon}>👥</Text>
          <Text style={styles.roomStatText}>
            {room.participants ? room.participants.length : 0} uczestników
          </Text>
        </View>

        {room.language && (
          <View style={styles.roomStat}>
            <Text style={styles.roomStatIcon}>
              {room.language === 'python' ? '🐍' : '📜'}
            </Text>
            <Text style={styles.roomStatText}>
              {room.language === 'python' ? 'Python' : 'JavaScript'}
            </Text>
          </View>
        )}

        <View style={styles.roomJoinButton}>
          <Text style={styles.roomJoinText}>Dołącz →</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  createContainer: {
    padding: 16,
  },
  createButton: {
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
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  roomsList: {
    padding: 16,
    gap: 16,
  },
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  roomTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roomIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  roomCreator: {
    fontSize: 12,
    color: '#6b7280',
  },
  activeBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
  },
  roomDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  roomStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomStatIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  roomStatText: {
    fontSize: 13,
    color: '#6b7280',
  },
  roomJoinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  roomJoinText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
});
