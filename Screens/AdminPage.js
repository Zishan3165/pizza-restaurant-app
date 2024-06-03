import React, { Component } from "react";
import { downArrowMenu, addIcon } from "../constants/icons";
import DropdownAlert from "react-native-dropdownalert";
import { avatar_4 } from "../constants/images";
import { Dimensions } from "react-native";
import Context from "./../store/context";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import PizzaRowAdmin from "./PizzaRowAdmin";
import { List_Current_Food_Items, Delete_Pizza_Item } from "./../Database";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { withApollo } from "react-apollo";
import UserModal from "../components/UserMenuModal";

const { height } = Dimensions.get("window");

class AdminPage extends Component {
  state = {
    pizzaList: [],
    showModal: false,
  };

  componentDidMount() {
    this.fetchPizzaList();
  }

  setShowModal = (showModal) => {
    this.setState({ showModal });
  };

  handleLogout = () => {
    this.context.saveUser({});
    this.setShowModal(false);
    this.context.resetCart();
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: "OnboardPage" }],
    });
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

  deletePizza = async (rowId) => {
    try {
      const query = await this.props.client.mutate({
        mutation: Delete_Pizza_Item,
        variables: {
          update: {
            rowId,
            pizzaPatch: {
              isActive: false,
              deletedAt: new Date().toISOString(),
            },
          },
        },
      });
      const { pizza } = query?.data?.updatePizzaByRowId;
      if (pizza && !pizza.isActive) {
        this.dropDownAlertRef.alertWithType(
          "success",
          "Success",
          "Pizza deleted!"
        );
        setTimeout(() => this.fetchPizzaList(), 3000);
      } else {
        this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Could not delete pizza."
        );
      }
    } catch (e) {
      this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Could not delete pizza."
      );
      console.log(e);
    }
  };

  render() {
    const { pizzaList, showModal } = this.state;
    const { user } = this.context;
    return (
      <View style={{ padding: 10 }}>
        {showModal && (
          <UserModal
            onLogout={this.handleLogout}
            onSetShowModal={this.setShowModal}
          />
        )}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 18, fontWeight: 700 }}>MENU</Text>
            <Image
              source={downArrowMenu}
              style={{
                width: 16,
                height: 14,
                margin: 5,
                marginLeft: 10,
              }}
            />
          </View>
          <TouchableOpacity onPress={() => this.setShowModal(true)}>
            <Image
              onPress={() => this.setShowModal(true)}
              source={avatar_4}
              style={{
                width: 50,
                height: 50,
                margin: "auto",
                borderRadius: 100 / 2,
              }}
            />
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              {user?.userName} (Admin)
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ overflow: "scroll", height: height * 0.7, marginBottom: 20 }}
        >
          {pizzaList.map((item) => (
            <PizzaRowAdmin
              row={item}
              navigation={this.props.navigation}
              id={item.rowId}
              deletePizza={this.deletePizza}
              pizzaName={item.pizzaName}
              smallPrice={item.smallPrice}
              src={item.imageUrl}
            />
          ))}
        </View>
        <View></View>
        <View style={{ margin: "auto", marginBottom: 10 }}>
          <View style={styles.menuButtonStyle}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "left",
                width: "100%",
              }}
              onPress={() => this.props.navigation.navigate("CreatePizza")}
            >
              <View style={styles.imageContainerView}>
                <Image
                  source={addIcon}
                  style={{
                    width: 20,
                    height: 20,
                    margin: 5,
                    marginLeft: 20,
                  }}
                />
              </View>
              <Text style={styles.buttonTextStyle}>Create Pizza</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuButtonStyle}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "left",
                width: "100%",
              }}
              onPress={() => this.props.navigation.navigate("CreateDeal")}
            >
              <View style={styles.imageContainerView}>
                <Image
                  source={null}
                  style={{
                    width: 20,
                    height: 20,
                    margin: 5,
                    marginLeft: 20,
                  }}
                />
              </View>
              <Text style={styles.buttonTextStyle}>Manage Deals</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuButtonStyle}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
              }}
              onPress={() => this.props.navigation.navigate("CreateCoupon")}
            >
              <View style={styles.imageContainerView}>
                <Image
                  source={null}
                  style={{
                    width: 20,
                    height: 20,
                    margin: 5,
                    marginLeft: 20,
                  }}
                />
              </View>
              <Text style={styles.buttonTextStyle}>Manage E-Coupons</Text>
            </TouchableOpacity>
          </View>
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
  titleTextStyle: {
    fontSize: 18,
    alignItems: "center",
    fontWeight: "bold",
    justifyContent: "center",
    paddingBottom: 20,
  },
  menuButtonStyle: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#394F51",
    paddingBottom: 10,
    paddingTop: 10,
    height: 40,
    width: 200,
    margin: 5,
    flexDirection: "row",
  },
  buttonTextStyle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
    margin: "auto",
    marginLeft: 20,
  },
  spaceBetweenButton: {
    width: 20,
    height: 20,
  },
  registerCodeStyle: {
    marginTop: 20,
  },
});

AdminPage.contextType = Context;
export default compose(
  withApollo,
  graphql(List_Current_Food_Items, { name: "List_Current_Food_Items" })
)(AdminPage);
