import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Błąd', 'Wypełnij wszystkie pola');
      return;
    }

    if (password.length < 3) {
      Alert.alert('Błąd', 'Hasło musi mieć minimum 3 znaki');
      return;
    }

    setLoading(true);
    const result = await register(email, password, role, adminKey);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Błąd rejestracji', result.error);
    }
    // Navigation handled automatically by App.js based on auth state
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.logo}>🎓 KidCode</Text>
          <Text style={styles.subtitle}>Stwórz nowe konto</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Hasło"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />

            <Text style={styles.label}>Rola:</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleButton, role === 'student' && styles.roleButtonActive]}
                onPress={() => setRole('student')}
                disabled={loading}
              >
                <Text style={[styles.roleText, role === 'student' && styles.roleTextActive]}>
                  👨‍🎓 Uczeń
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleButton, role === 'teacher' && styles.roleButtonActive]}
                onPress={() => setRole('teacher')}
                disabled={loading}
              >
                <Text style={[styles.roleText, role === 'teacher' && styles.roleTextActive]}>
                  👨‍🏫 Nauczyciel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleButton, role === 'admin' && styles.roleButtonActive]}
                onPress={() => setRole('admin')}
                disabled={loading}
              >
                <Text style={[styles.roleText, role === 'admin' && styles.roleTextActive]}>
                  👑 Admin
                </Text>
              </TouchableOpacity>
            </View>

            {(role === 'teacher' || role === 'admin') && (
              <TextInput
                style={styles.input}
                placeholder="Klucz administratora (opcjonalny dla nauczyciela)"
                value={adminKey}
                onChangeText={setAdminKey}
                secureTextEntry
                editable={!loading}
              />
            )}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Zarejestruj się</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={styles.linkText}>
                Masz już konto? <Text style={styles.linkTextBold}>Zaloguj się</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  roleText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  roleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#666',
  },
  linkTextBold: {
    color: '#667eea',
    fontWeight: '600',
  },
});
