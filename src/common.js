import { Alert, Platform } from 'react-native';

const server = Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://192.168.7.38:3000';

function showError(err) {
  Alert.alert('Ops! Ocorreu um problema', `Mensagem: ${err}`);
}

export { server, showError };