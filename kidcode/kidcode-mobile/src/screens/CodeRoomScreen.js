import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function CodeRoomScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { roomId, room: initialRoom } = route.params;

  const [room, setRoom] = useState(initialRoom || null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoom();
    // TODO: Setup Socket.IO connection for real-time updates
  }, [roomId]);

  const loadRoom = async () => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      const roomData = response.data.room;
      setRoom(roomData);
      setCode(roomData.code || '// Zacznij pisać kod...');
      setParticipants(roomData.participants || []);
    } catch (error) {
      console.error('Error loading room:', error);
      Alert.alert('Błąd', 'Nie udało się załadować pokoju');
    } finally {
      setLoading(false);
    }
  };

  const handleRun = () => {
    if (!code.trim()) {
      setOutput('⚠️ Kod jest pusty!');
      return;
    }

    try {
      // Simple JavaScript execution
      let logs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg => String(arg)).join(' '));
        originalLog(...args);
      };

      try {
        const result = new Function(code)();
        console.log = originalLog;

        if (logs.length > 0) {
          setOutput('✅ Wynik:\n\n' + logs.join('\n'));
        } else if (result !== undefined) {
          setOutput('✅ Wynik:\n\n' + String(result));
        } else {
          setOutput('✅ Kod wykonany pomyślnie!');
        }
      } catch (err) {
        console.log = originalLog;
        throw err;
      }
    } catch (error) {
      setOutput(`❌ Błąd:\n\n${error.message}`);
    }
  };

  const handleLeave = () => {
    Alert.alert(
      'Opuścić pokój?',
      'Czy na pewno chcesz opuścić ten pokój?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Opuść',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Ładowanie pokoju...</Text>
      </View>
    );
  }

  if (!room) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ Nie znaleziono pokoju</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Powrót</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.roomName}>🚪 {room.name}</Text>
          <Text style={styles.roomCreator}>Utworzony przez: {room.creatorEmail}</Text>
        </View>
        <TouchableOpacity style={styles.leaveButton} onPress={handleLeave}>
          <Text style={styles.leaveButtonText}>Opuść</Text>
        </TouchableOpacity>
      </View>

      {/* Participants */}
      <View style={styles.participantsContainer}>
        <Text style={styles.participantsLabel}>
          👥 Uczestników: {participants.length}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {participants.map((participant, index) => (
            <View key={index} style={styles.participantBadge}>
              <Text style={styles.participantText}>
                {participant.email?.split('@')[0] || 'User'}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Warning - Real-time not implemented */}
      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ Uwaga: Synchronizacja w czasie rzeczywistym nie jest jeszcze zaimplementowana.
          {'\n'}Kod jest lokalny dla każdego użytkownika.
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Code Editor */}
        <View style={styles.editorContainer}>
          <Text style={styles.sectionTitle}>📝 Edytor kodu</Text>
          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={setCode}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            placeholder="Napisz kod tutaj..."
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Output */}
        <View style={styles.outputContainer}>
          <Text style={styles.sectionTitle}>📤 Wynik</Text>
          <View style={styles.outputBox}>
            <Text style={styles.outputText}>
              {output || 'Naciśnij "Uruchom" aby wykonać kod...'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.runButton} onPress={handleRun}>
          <Text style={styles.runButtonText}>▶️ Uruchom</Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
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
  leaveButton: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  leaveButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  participantsContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  participantsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  participantBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  participantText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
  },
  warningBox: {
    backgroundColor: '#fef3c7',
    padding: 12,
    margin: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  warningText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  editorContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  codeInput: {
    fontFamily: 'monospace',
    fontSize: 14,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 200,
    textAlignVertical: 'top',
    color: '#111827',
  },
  outputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  outputBox: {
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    minHeight: 100,
  },
  outputText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#f9fafb',
    lineHeight: 20,
  },
  actions: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  runButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  runButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
