import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { progressAPI } from '../services/api';

export default function EditorScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { lessonId, lesson } = route.params;

  const [code, setCode] = useState(lesson?.starterCode || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('new');

  useEffect(() => {
    // Load lesson progress status
    loadStatus();
  }, [lessonId]);

  const loadStatus = async () => {
    try {
      const progressRes = await progressAPI.getLessonProgress(lessonId);
      setStatus(progressRes.data.progress?.status || 'new');
    } catch (err) {
      console.error('Failed to load status:', err);
    }
  };

  const handleRun = async () => {
    if (!code.trim()) {
      setOutput('⚠️ Kod jest pusty. Napisz coś!');
      return;
    }

    setIsRunning(true);
    setOutput('⏳ Uruchamianie...');

    try {
      if (lesson.language === 'javascript') {
        runJavaScript();
      } else if (lesson.language === 'python') {
        setOutput('⚠️ Python nie jest jeszcze obsługiwany w wersji mobilnej.\n\nPrzejdź do wersji web aby uruchomić kod Python.');
      }

      // Mark as in-progress if it was new
      if (status === 'new') {
        try {
          await progressAPI.updateLessonProgress(lessonId, 'in-progress');
          setStatus('in-progress');
        } catch (err) {
          console.error('Failed to update progress:', err);
        }
      }
    } catch (error) {
      setOutput(`❌ Błąd: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runJavaScript = () => {
    try {
      // Capture console.log output
      let logs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg => String(arg)).join(' '));
        originalLog(...args);
      };

      // Execute code in isolated scope
      try {
        // Use Function constructor to evaluate code
        const result = new Function(code)();
        
        // Restore console.log
        console.log = originalLog;

        // Display output
        if (logs.length > 0) {
          setOutput('✅ Wynik:\n\n' + logs.join('\n'));
        } else if (result !== undefined) {
          setOutput('✅ Wynik:\n\n' + String(result));
        } else {
          setOutput('✅ Kod wykonany pomyślnie!\n\nBrak wyniku do wyświetlenia.');
        }
      } catch (err) {
        // Restore console.log
        console.log = originalLog;
        throw err;
      }
    } catch (error) {
      setOutput(`❌ Błąd wykonania:\n\n${error.message}\n\nSprawdź składnię kodu.`);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Zresetować kod?',
      'Czy na pewno chcesz przywrócić kod początkowy?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Zresetuj',
          style: 'destructive',
          onPress: () => {
            setCode(lesson?.starterCode || '');
            setOutput('');
          },
        },
      ]
    );
  };

  const handleMarkComplete = async () => {
    try {
      await progressAPI.updateLessonProgress(lessonId, 'completed');
      setStatus('completed');
      Alert.alert(
        '🎉 Gratulacje!',
        'Lekcja oznaczona jako zakończona!',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } catch (err) {
      Alert.alert('Błąd', 'Nie udało się zapisać postępu');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{lesson?.title}</Text>
          <View style={styles.languageBadge}>
            <Text style={styles.languageText}>
              {lesson?.language === 'javascript' ? '💻 JavaScript' : '🐍 Python'}
            </Text>
          </View>
        </View>

        {/* Editor */}
        <View style={styles.editorContainer}>
          <View style={styles.editorHeader}>
            <Text style={styles.editorLabel}>📝 Edytor kodu</Text>
            <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>🔄 Reset</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.codeScrollView}>
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={setCode}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              keyboardType="default"
              placeholder="Napisz swój kod tutaj..."
              placeholderTextColor="#9ca3af"
            />
          </ScrollView>
        </View>

        {/* Output */}
        <View style={styles.outputContainer}>
          <Text style={styles.outputLabel}>📤 Wynik</Text>
          <ScrollView style={styles.outputScrollView}>
            <Text style={styles.outputText}>
              {output || 'Naciśnij "Uruchom" aby wykonać kod...'}
            </Text>
          </ScrollView>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.runButton, isRunning && styles.runButtonDisabled]}
            onPress={handleRun}
            disabled={isRunning}
          >
            {isRunning ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.runButtonText}>▶️ Uruchom</Text>
            )}
          </TouchableOpacity>

          {status !== 'completed' && (
            <TouchableOpacity style={styles.completeButton} onPress={handleMarkComplete}>
              <Text style={styles.completeButtonText}>✅ Zakończ lekcję</Text>
            </TouchableOpacity>
          )}

          {status === 'completed' && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>🎉 Ukończona!</Text>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  languageBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  languageText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e40af',
  },
  editorContainer: {
    flex: 1,
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  editorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
  },
  codeScrollView: {
    flex: 1,
  },
  codeInput: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    padding: 16,
    color: '#111827',
    minHeight: 200,
    textAlignVertical: 'top',
  },
  outputContainer: {
    height: 150,
    margin: 12,
    marginTop: 0,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    overflow: 'hidden',
  },
  outputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f9fafb',
    padding: 12,
    paddingBottom: 8,
    backgroundColor: '#111827',
  },
  outputScrollView: {
    flex: 1,
    padding: 12,
  },
  outputText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 13,
    color: '#f9fafb',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  runButton: {
    flex: 2,
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  runButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  runButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  completedBadge: {
    flex: 1,
    backgroundColor: '#d1fae5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
