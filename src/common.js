import { Alert, Platform } from 'react-native';

const server = Platform.OS === 'ios' ? 'http://localhost:3000' : 'https://da-tasks.herokuapp.com';

function showError(err) {
  Alert.alert('Ops! Ocorreu um problema', `Mensagem: ${err}`);
}

export { server, showError };