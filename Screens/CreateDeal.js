import React, { Component } from "react";
import DropdownAlert from "react-native-dropdownalert";
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import {
  Create_New_Deal,
  List_Deals,
  List_Current_Food_Items,
  Delete_Deal,
} from "./../Database";
import { graphql, withApollo } from "react-apollo";
import { flowRight as compose } from "lodash";
import Context from "./../store/context";
import DealRow from "../components/DealRow";
import { Dimensions } from "react-native";
import PizzaRowDeal from "../components/PizzaRowDeal";
import ConfirmModal from "./ConfirmModal";
const { height } = Dimensions.get("window");

class ManageCoupon extends Component {
  state = {
    validTo: "",
    ecouponAmount: "",
    dealList: [],
    pizzaList: [],
    pizzaId: null,
    showModal: false,
  };

  componentDidMount() {
    this.fetchPizzaList();
    this.fetchDealList();
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };

  handlePizzaId = (pizzaId) => {
    this.setState({ pizzaId });
  };

  fetchPizzaList = async () => {
    try {
      const query = await this.props.client.query({
        query: List_Current_Food_Items,
        variables: {
          condition: {
            isActive: true,
          },
        },
      });
      const { nodes } = query.data.allPizzas;
      if (nodes && nodes.length > 0) {
        this.setState({ pizzaList: nodes });
      } else {
        this.setState({ pizzaList: [] });
      }
    } catch (e) {
      console.log(e);
      this.setState({ pizzaList: [] });
    }
  };

  fetchDealList = async () => {
    try {
      const query = await this.props.client.query({
        query: List_Deals,
        variables: {
          condition: {
            isValid: true,
          },
        },
      });
      const { nodes } = query?.data?.allDeals;
      if (nodes && nodes.length > 0) {
        this.setState({ dealList: nodes });
      } else {
        this.setState({ dealList: [] });
      }
    } catch (err) {
      console.log("error : ", err);
      this.setState({ dealList: [] });
    }
  };

  createDeal = async () => {
    let { pizzaId, dealDiscount } = this.state;
    const { user } = this.context;
    try {
      if (!pizzaId || !dealDiscount) {
        return this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Please fill up all the fields"
        );
      }
      const query = await this.props.client.mutate({
        mutation: Create_New_Deal,
        variables: {
          input: {
            deal: {
              userId: user.rowId,
              pizzaId,
              dealDiscount: Number(dealDiscount),
            },
          },
        },
      });
      const { deal } = query?.data?.createDeal;
      if (deal && deal.pizzaId) {
        this.setShowModal(true);
        // this.dropDownAlertRef.alertWithType('success', 'Success', 'Deal created!');
        // setTimeout(() => this.fetchDealList(), 3000)
      } else {
        this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Could not create deal."
        );
      }
    } catch (err) {
      console.log("error : ", err);
    }
  };

  deleteDeal = async (rowId) => {
    try {
      const query = await this.props.client.mutate({
        mutation: Delete_Deal,
        variables: {
          update: {
            rowId,
            dealPatch: {
              isValid: false,
              deletedAt: new Date().toISOString(),
            },
          },
        },
      });
      const { deal } = query?.data?.updateDealByRowId;
      if (deal && !deal.isValid) {
        this.dropDownAlertRef.alertWithType(
          "success",
          "Success",
          "Deal deleted!"
        );
        setTimeout(() => this.fetchDealList(), 3000);
      } else {
        this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Could not delete deal."
        );
      }
    } catch (err) {
      console.log("error : ", err);
    }
  };

  onOk = () => {
    this.setShowModal(false);
    setTimeout(() => this.fetchDealList(), 3000);
  };

  setShowModal = (showModal) => {
    this.setState({ showModal });
  };

  render() {
    const { pizzaList, dealList, pizzaId, showModal } = this.state;
    return (
      <View style={styles.container}>
        {showModal && (
          <ConfirmModal
            message={"Deal created!"}
            onOk={this.onOk}
            onSetShowModal={this.setShowModal}
          />
        )}
        <View>
          <Text style={styles.titleTextStyle}>Create Deal</Text>
        </View>
        <View
          style={{
            overflow: "scroll",
            height: height * 0.5,
            marginBottom: 20,
            width: "100%",
          }}
        >
          {pizzaList.map((item) => (
            <PizzaRowDeal
              selectedId={pizzaId}
              onClick={this.handlePizzaId}
              row={item}
              navigation={this.props.navigation}
            />
          ))}
        </View>

        <TextInput
          keyboardType="numeric"
          style={styles.input}
          placeholder="Discount %"
          autoCapitalize="none"
          placeholderTextColor="black"
          onChangeText={(val) => this.onChangeText("dealDiscount", val)}
        />
        <View style={styles.spaceBetweenButton}></View>
        <View style={styles.signUpButtonStyle}>
          <TouchableOpacity onPress={() => this.createDeal()}>
            <Text style={styles.buttonTextStyle}>GENERATE</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.edealListTitleStyle}>Deal List</Text>
        <View
          style={{
            overflow: "scroll",
            height: height * 0.5,
            marginBottom: 20,
            width: "100%",
          }}
        >
          {dealList.map((item) => (
            <DealRow
              row={item}
              deleteDeal={this.deleteDeal}
              navigation={this.props.navigation}
            />
          ))}
        </View>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  edealListTitleStyle: {
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

    backgroundColor: "rgba(58, 158, 152, 1)",
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
  graphql(Create_New_Deal, { name: "Create_New_Deal" }),
  graphql(List_Deals, { name: "List_Deals" }),
  graphql(Delete_Deal, { name: "Delete_Deal" }),
  graphql(List_Current_Food_Items, { name: "List_Current_Food_Items" })
)(ManageCoupon);

Delete_Deal;
