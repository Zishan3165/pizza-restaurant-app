import React, { Component } from "react";
import DropdownAlert from "react-native-dropdownalert";
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import { Create_New_Ecoupon, List_Ecoupons } from "./../Database";
import { graphql, withApollo } from "react-apollo";
import { flowRight as compose } from "lodash";
import Context from "./../store/context";
import EcouponRow from "./EcouponRow";
import { Dimensions } from "react-native";
import ConfirmModal from "./ConfirmModal";
const { height } = Dimensions.get("window");

class ManageCoupon extends Component {
  state = {
    validTo: "",
    ecouponAmount: "",
    couponList: [],
    showModal: false,
  };

  componentDidMount() {
    this.fetchCouponList();
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };

  fetchCouponList = async () => {
    try {
      const query = await this.props.client.query({
        query: List_Ecoupons,
        variables: {
          timestamp: new Date().toISOString(),
        },
      });
      const { nodes } = query?.data?.searchEcoupons;
      if (nodes && nodes.length > 0) {
        this.setState({ couponList: nodes });
      } else {
        this.setState({ couponList: [] });
      }
    } catch (err) {
      console.log("error : ", err);
      this.setState({ couponList: [] });
    }
  };

  createCoupon = async () => {
    let { validTo, ecouponAmount } = this.state;
    const { user } = this.context;
    const dateArray = validTo.split("/");
    validTo = `${dateArray[1]}/${dateArray[0]}/${dateArray[2]}`;
    try {
      if (!validTo || !ecouponAmount) {
        this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Please fill up all the fields"
        );
        console.log("Please select all fields");
        return;
      }
      const query = await this.props.client.mutate({
        mutation: Create_New_Ecoupon,
        variables: {
          input: {
            ecoupon: {
              userId: user.rowId,
              ecouponAmount,
              validTo: new Date(validTo).toISOString(),
              ecouponcode: Math.floor(1000 + Math.random() * 9000).toString(),
            },
          },
        },
      });
      const { ecoupon } = query?.data?.createEcoupon;
      if (ecoupon && ecoupon.ecouponcode) {
        this.setShowModal(true);
        // this.dropDownAlertRef.alertWithType('success', 'Success', 'E-Coupon created!');
        // setTimeout(() => this.fetchCouponList(), 3000)
      } else {
        this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Could not create E-Coupon."
        );
      }
    } catch (err) {
      console.log("error : ", err);
    }
  };

  onOk = () => {
    this.setShowModal(false);
    setTimeout(() => this.fetchCouponList(), 3000);
  };

  setShowModal = (showModal) => {
    this.setState({ showModal });
  };

  render() {
    const { ecouponAmount, validTo, couponList, showModal } = this.state;
    return (
      <View style={styles.container}>
        {showModal && (
          <ConfirmModal
            message={"E-Coupon created!"}
            onOk={this.onOk}
            onSetShowModal={this.setShowModal}
          />
        )}
        <View>
          <Text style={styles.titleTextStyle}>Create E-Coupon</Text>
        </View>

        <View
          style={{ textAlign: "left", justifyContent: "left", width: "77%" }}
        >
          <Text style={{ fontWeight: 700, textAlign: "left" }}>Amount</Text>
        </View>
        <TextInput
          keyboardType="numeric"
          style={styles.textArea}
          placeholder=""
          value={ecouponAmount}
          autoCapitalize="none"
          placeholderTextColor="white"
          onFocus={() => this.setState({ showDateModal: true })}
          onChangeText={(val) => this.onChangeText("ecouponAmount", val)}
        />

        <View
          style={{ textAlign: "left", justifyContent: "left", width: "77%" }}
        >
          <Text style={{ fontWeight: 700, textAlign: "left" }}>
            Expiry Date
          </Text>
        </View>
        <TextInput
          style={styles.textArea}
          placeholder="DD/MM/YYYY"
          value={validTo}
          autoCapitalize="none"
          placeholderTextColor="white"
          onFocus={() => this.setState({ showDateModal: true })}
          onChangeText={(val) => this.onChangeText("validTo", val)}
        />

        <View style={styles.spaceBetweenButton}></View>
        <View style={styles.signUpButtonStyle}>
          <TouchableOpacity onPress={() => this.createCoupon()}>
            <Text style={styles.buttonTextStyle}>GENERATE</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.ecouponListTitleStyle}>E-Coupons</Text>
        <View
          style={{
            overflowY: "auto",
            height: height * 0.5,
            marginBottom: 20,
            width: "100%",
          }}
        >
          {couponList.map((item) => (
            <EcouponRow row={item} />
          ))}
        </View>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ecouponListTitleStyle: {
    fontSize: 18,
    alignItems: "left",
    fontWeight: "bold",
    justifyContent: "left",
    paddingBottom: 20,
    marginTop: 20,
  },
  priceInputStyle: {
    width: "25%",
    backgroundColor: "rgba(58, 158, 152, 0.29)",
    marginTop: 10,
    padding: 8,
    color: "black",
    borderRadius: 14,
    fontSize: 18,
    marginTop: "auto",
    marginBottom: "auto",
  },
  textArea: {
    width: "80%",
    backgroundColor: "rgba(58, 158, 152, 0.29)",
    marginTop: 10,
    padding: 8,
    color: "black",
    borderRadius: 14,
    fontSize: 18,
    marginBottom: 5,
  },
  switchStyle: {
    borderRadius: 20,
    backgroundColor: "#3A9E98",
    width: 70,
    height: 36,
  },
  input: {
    width: "80%",
    height: 55,
    backgroundColor: "rgba(58, 158, 152, 0.29)",
    marginTop: 10,
    padding: 8,
    color: "black",
    borderRadius: 14,
    fontSize: 18,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  verifyButtonStyle: {
    textAlign: "center",
    backgroundColor: "#394F51",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: "5px",
    height: 30,
    margin: "auto",
  },
});

ManageCoupon.contextType = Context;
export default compose(
  withApollo,
  graphql(Create_New_Ecoupon, { name: "Create_New_Ecoupon" }),
  graphql(List_Ecoupons, { name: "List_Ecoupons" })
)(ManageCoupon);
