import React, { Component } from 'react';
import { 
  View, 
  Text,
  Alert,
  ImageBackground,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import backgroundImage from '../../assets/imgs/login.jpg';
import commonStyles from "../commonStyles";
import AuthInput from "../components/AuthInput";
import { server, showError } from '../common';
import axios from 'axios';

export default class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stageNew: false,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
  }

  signin = async () => {
    try {
      const body = {
        email: this.state.email,
        password: this.state.password
      }

      const res = await axios.post(`${server}/signin`, body);
      axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`;

      this.props.navigation.navigate('Home');
    } catch(err) {
      Alert.alert('Login inválido', 'Email ou senha incorretos');
    }
  }

  signup = async () => {
    try {
      const body = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      }

      await axios.post(`${server}/signup`, body);

      Alert.alert('Sucesso!', 'Usuário cadastrado.');
      this.setState({ stageNew: false });
    } catch(err) {
      showError(err);
    }
  }

  signinOrSignup = () => {
    if (this.state.stageNew) {
      this.signup();
    } else {
      this.signin();
    }
  }

  render() {
    const validations = [];

    validations.push(this.state.email && this.state.email.includes('@'));
    validations.push(this.state.password && this.state.password.length >= 6);

    if (this.state.stageNew) {
      validations.push(this.state.name && this.state.name.trim());
      validations.push(this.state.confirmPassword && 
        this.state.password === this.state.confirmPassword);
    }

    const validForm = validations.reduce((result, current) => result && current);

    return (
      <ImageBackground source={backgroundImage} 
        style={styles.background}>
        <Text style={styles.title}>Tarefas</Text>
        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>
            {this.state.stageNew ? 'Crie a sua conta' : 'Informe seus dados'}
          </Text>
          {this.state.stageNew &&
            <AuthInput icon='user' placeholder='Nome' style={styles.input}
              value={this.state.name}
              onChangeText={name => this.setState({ name })} />}
          
          <AuthInput icon='at' placeholder='Email' style={styles.input}
            value={this.state.email}
            onChangeText={email => this.setState({ email })} />
          
          <AuthInput icon='lock' secureTextEntry={true} 
            placeholder='Senha' style={styles.input}
            value={this.state.password}
            onChangeText={password => this.setState({ password })} />

          {this.state.stageNew &&
            <AuthInput icon='asterisk' secureTextEntry={true}
              placeholder='Confirmar senha' style={styles.input}
              value={this.state.confirmPassword}
              onChangeText={confirmPassword => this.setState({ confirmPassword })} />}
          <TouchableOpacity onPress={this.signinOrSignup}
            disabled={!validForm}>
            <View style={[styles.button, !validForm ? { backgroundColor: '#aaa' } : {}]}>
              <Text style={styles.buttonText}>
                {this.state.stageNew ? 'Registrar' : 'Entrar'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{ padding: 10 }}
          onPress={() => this.setState({ stageNew: !this.state.stageNew })}>
          <Text style={styles.buttonText}>
            {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 70,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: '#fff',
    fontSize: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    width: '90%',
  },
  input: {
    marginTop: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#080',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    fontFamily: commonStyles.fontFamily,
    color: '#fff',
    fontSize: 20,
  }
})