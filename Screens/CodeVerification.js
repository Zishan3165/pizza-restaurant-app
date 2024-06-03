// SignUp.js
import React, { Component } from "react";
import Context from "./../store/context";
import DropdownAlert from "react-native-dropdownalert";
import {
  Get_Admin_Code_Confirmation_During_Registration,
  Create_User_Account,
} from "./../Database";
import { graphql, withApollo } from "react-apollo";
import { flowRight as compose } from "lodash";
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
} from "react-native";

class CodeVerification extends Component {
  state = {
    code: "",
    verified: false,
  };

  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };

  verifyCode = async () => {
    const { code } = this.state;
    try {
      const query = await this.props.client.query({
        query: Get_Admin_Code_Confirmation_During_Registration,
        variables: {
          condition: {
            registrationCode: code,
            isActive: true,
          },
        },
      });
      const { nodes } = query?.data?.allAdminCodes;
      if (nodes && nodes.length > 0) {
        this.setState({ verified: true });
        this.dropDownAlertRef.alertWithType(
          "success",
          "Success",
          "Code verified",
          {},
          1000
        );
      } else {
        this.setState({ verified: false });
        this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Code invalid",
          {},
          1000
        );
      }
    } catch (err) {
      this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Could not sign up.",
        {},
        1000
      );
      console.log("error signing up: ", err);
    }
  };

  confirmSignUpAdmin = async () => {
    const { user: userObj } = this.props?.route?.params;
    const { code, verified } = this.state;
    const { navigation } = this.props;
    try {
      if (!verified) {
        return this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Please verify code first!"
        );
      }
      const query = await this.props.client.mutate({
        mutation: Create_User_Account,
        variables: {
          input: {
            user: {
              ...userObj,
              isAdmin: true,
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
      console.log("error signing up: ", err);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.titleTextStyle}>Authentication</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.input}
            placeholder="Code"
            autoCapitalize="none"
            placeholderTextColor="white"
            onChangeText={(val) => this.onChangeText("code", val)}
          />
          <View style={styles.verifyButtonStyle}>
            {" "}
            <TouchableOpacity onPress={() => this.verifyCode()}>
              <Text style={styles.buttonTextStyle}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.spaceBetweenButton}></View>
        <View style={styles.signUpButtonStyle}>
          <TouchableOpacity onPress={() => this.confirmSignUpAdmin()}>
            <Text style={styles.buttonTextStyle}>CONFIRM</Text>
          </TouchableOpacity>
        </View>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 30,
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
  verifyButtonStyle: {
    textAlign: "center",
    backgroundColor: "#394F51",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: "5px",
    height: 30,
    margin: "auto",
  },
  buttonTextStyle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
  },
  spaceBetweenButton: {
    width: 20,
    height: 40,
  },
  registerCodeStyle: {
    marginTop: 20,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 40,
  },
  inputWrap: {
    flex: 1,
    borderColor: "#cccccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  inputdate: {
    fontSize: 14,
    marginBottom: -12,
    color: "#6a4595",
  },
  inputcvv: {
    fontSize: 14,
    marginBottom: -12,
    color: "#6a4595",
  },
});

CodeVerification.contextType = Context;
export default compose(
  withApollo,
  graphql(Get_Admin_Code_Confirmation_During_Registration, {
    name: "Get_Admin_Code_Confirmation_During_Registration",
  }),
  graphql(Create_User_Account, { name: "Create_User_Account" })
)(CodeVerification);
