import Auth from "./screens/Auth";
import Agenda from "./screens/Agenda";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

const MainNavigator = createSwitchNavigator(
  {
    Auth: {
      name: 'Auth',
      screen: Auth,
    },
    Home: {
      name: 'Home',
      screen: Agenda,
    }
  },
  {
    initialRouteName: 'Auth'
  }
)

const AppContainer = createAppContainer(MainNavigator);

export default AppContainer;