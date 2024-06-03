import React, { Component } from "react";
import DropdownAlert from "react-native-dropdownalert";
import { Create_User_Account } from "./../Database";
import { graphql, withApollo } from "react-apollo";
import { flowRight as compose } from "lodash";
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
} from "react-native";

class SignUp extends Component {
  state = {
    userName: "",
    userPassword: "",
    userEmail: "",
  };
  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };
  signUp = async () => {
    const { userName, userSurname, userPassword, userEmail } = this.state;
    const { navigation } = this.props;
    try {
      if (!userName || !userPassword || !userEmail || !userSurname) {
        this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Please fill up all the fields"
        );
        return;
      }
      const query = await this.props.client.mutate({
        mutation: Create_User_Account,
        variables: {
          input: {
            user: {
              userName,
              userSurname,
              userEmail,
              userPassword,
              codeId: null,
              isAdmin: false,
            },
          },
        },
      });
      const { user } = query?.data?.createUser;
      if (user.userName) {
        this.dropDownAlertRef.alertWithType(
          "success",
          "Success",
          "Signup successful, please login!"
        );
        setTimeout(() => navigation.navigate("Login"), 5000);
      }
    } catch (err) {
      if (err?.message?.indexOf("unique constraint") >= 0) {
        return this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "User already exists!"
        );
      }
      this.dropDownAlertRef.alertWithType("error", "Error", "Signup failed!");
      console.log("error signing up: ", err);
    }
  };

  giveCode = () => {
    const { userName, userSurname, userPassword, userEmail } = this.state;
    if (!userName || !userPassword || !userEmail || !userSurname) {
      this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Please fill up all the fields"
      );
      return;
    }
    this.props.navigation.navigate("CodeVerification", {
      user: { userName, userSurname, userEmail, userPassword, codeId: null },
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.titleTextStyle}>Sign Up</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={(val) => this.onChangeText("userName", val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={(val) => this.onChangeText("userSurname", val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={(val) => this.onChangeText("userPassword", val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={(val) => this.onChangeText("userEmail", val)}
        />
        <View style={styles.spaceBetweenButton}></View>
        <View style={styles.signUpButtonStyle}>
          <TouchableOpacity onPress={() => this.signUp()}>
            <Text style={styles.buttonTextStyle}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text
            onPress={() => this.giveCode()}
            style={styles.registerCodeStyle}
          >
            Register Code
          </Text>
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
    fontWeight: "500",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleTextStyle: {
    fontSize: 18,
    alignItems: "center",
    fontWeight: "bold",
    justifyContent: "center",
    paddingBottom: 20,
  },
  signUpButtonStyle: {
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
  registerCodeStyle: {
    marginTop: 20,
  },
});

export default compose(
  withApollo,
  graphql(Create_User_Account, { name: "Create_User_Account" })
)(SignUp);
