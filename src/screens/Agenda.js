import React, { Component } from 'react';
import { 
  View, 
  Text, 
  ImageBackground, 
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import todayImage from '../../assets/imgs/today.jpg';
import moment from 'moment';
import 'moment/locale/pt-br';
import commonStyles from '../commonStyles';
import Task from '../components/Task';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import AddTask from './AddTask';
import { server, showError } from '../common';

export default class Agenda extends Component {
  state = {
    tasks: [],
    visibleTasks: [],
    showDoneTasks: true,
    showAddTask: false,
  }

  addTask = async task => {
    try {
      await axios.post(`${server}/tasks`, {
        desc: task.desc,
        estimatedAt: task.date
      });
      
      this.setState({showAddTask: false }, this.loadTasks);
    } catch (err) {
      showError(err);
    }
  }

  deleteTask = async id => {
    try {
      await axios.delete(`${server}/tasks/${id}`);
      await this.loadTasks();
    } catch (err) {
      showError(err);
    }
  }

  filterTasks = () => {
    let visibleTasks = null;
    if (this.state.showDoneTasks) {
      visibleTasks = [...this.state.tasks];
    } else {
      visibleTasks = this.state.tasks.filter(task => task.doneAt === null);
    }

    this.setState({ visibleTasks });
  }

  toggleFilter = () => {
    this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks);
  }

  toggleTask = async id => {
    try {
      await axios.put(`${server}/tasks/${id}/toggle`);
      await this.loadTasks();
    } catch (err) {
      showError(err);
    }
  }

  loadTasks = async () => {
    try {
      const maxDate = moment().format('YYYY-MM-DD 23:59');
      const res = await axios.get(`${server}/tasks?date=${maxDate}`);
      this.setState({ tasks: res.data }, this.filterTasks);
    } catch (err) {
      showError(err);
    }
  }

  componentDidMount = async () => {
    this.loadTasks();
  }

  render() {
    return (
      <View style={styles.container}>
        <AddTask isVisible={this.state.showAddTask} 
          onCancel={() => { this.setState({ showAddTask: false }) }} 
          onSave={this.addTask} />
        <ImageBackground source={todayImage} style={styles.background} >
          <View style={styles.iconBar}>
            <TouchableOpacity onPress={this.toggleFilter}>
              <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                size={25} color={commonStyles.colors.secondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.titleBar}>
            <Text style={styles.title}>Hoje</Text>
            <Text style={styles.subtitle}>
              {moment().locale('pt-br').format('ddd, D [de] MMMM [de] YYYY')}
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.tasksContainer}>
          <FlatList data={this.state.visibleTasks}
            keyExtractor={item => `${item.id}`}
            renderItem={({ item }) => 
              <Task {...item} onToggleTask={this.toggleTask} 
                onDelete={this.deleteTask} />} 
          />
        </View>
        <ActionButton buttonColor={commonStyles.colors.today}
          onPress={() => { this.setState({ showAddTask: true }) }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    flex: 3,
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30,
  },
  tasksContainer: {
    flex: 7,
  },
  iconBar: {
    marginTop: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});
