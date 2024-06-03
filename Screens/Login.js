import React, { Component } from "react";
import Context from "./../store/context";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Get_Credentials_Confirmation_Login } from "./../Database";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { withApollo } from "react-apollo";
import DropdownAlert from "react-native-dropdownalert";

class Login extends Component {
  state = {
    userEmail: "",
    userPassword: "",
  };

  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };

  login = async () => {
    const { userEmail, userPassword } = this.state;
    const { navigation } = this.props;
    try {
      const queryUserResult = await this.props.client.query({
        query: Get_Credentials_Confirmation_Login,
        variables: {
          condition: {
            userEmail,
            userPassword,
            isActive: true,
          },
        },
      });
      const { nodes } = queryUserResult.data.allUsers;
      if (!nodes || nodes.length === 0) {
        return this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Invalid credentials. Please try again."
        );
      }
      const { isAdmin, userName, userSurname, rowId } = nodes[0];
      this.context.saveUser({ isAdmin, userName, userSurname, rowId });
      if (isAdmin) {
        navigation.reset({
          index: 0,
          routes: [{ name: "AdminPage" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "CustomerMenu" }],
        });
      }
    } catch (err) {
      console.log("error logging in: ", err);
      this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Invalid credentials. Please try again."
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={(val) => this.onChangeText("userEmail", val)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={(val) => this.onChangeText("userPassword", val)}
        />
        <View style={styles.spaceBetweenButton}></View>
        <View style={styles.logInButtonStyle}>
          <TouchableOpacity onPress={() => this.login()}>
            <Text style={styles.buttonTextStyle}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  input: {
    width: 350,
    height: 55,
    backgroundColor: "#4db6ac",
    margin: 10,
    padding: 8,
    color: "white",
    borderRadius: 14,
    fontSize: 18,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logInButtonStyle: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#394F51",
    paddingBottom: 10,
    paddingTop: 10,
    height: 40,
    width: 200,
  },
  buttonTextStyle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
  },
  spaceBetweenButton: {
    width: 20,
    height: 20,
  },
});

Login.contextType = Context;
export default compose(
  withApollo,
  graphql(Get_Credentials_Confirmation_Login, {
    name: "Get_Credentials_Confirmation_Login",
  })
)(Login);
