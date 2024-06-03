import React, { Component } from "react";
import DropdownAlert from "react-native-dropdownalert";
import { Text, View, StyleSheet } from "react-native";
import { Create_New_Gift_Card, List_Gift_Cards } from "./../Database";
import { graphql, withApollo } from "react-apollo";
import { flowRight as compose } from "lodash";
import Context from "./../store/context";
import { Dimensions } from "react-native";
import GiftCardRow from "./GiftCardRow";
import PurchasedGiftCardRow from "../components/PurchasedGiftCardRow";
const { height } = Dimensions.get("window");

const giftCardListItems = [20, 50, 100];

class ManageCoupon extends Component {
  state = {
    giftCardList: [],
  };

  componentDidMount() {
    this.fetchGiftCardList();
  }

  fetchGiftCardList = async () => {
    try {
      const { user } = this.context;
      const query = await this.props.client.query({
        query: List_Gift_Cards,
        variables: {
          userId: user.rowId,
        },
      });
      const { nodes } = query?.data?.searchGiftCards;
      if (nodes && nodes.length > 0) {
        this.setState({ giftCardList: nodes });
      } else {
        this.setState({ giftCardList: [] });
      }
    } catch (err) {
      console.log("error : ", err);
      this.setState({ giftCardList: [] });
    }
  };

  buyGiftCard = async (amount) => {
    const { user } = this.context;
    try {
      const query = await this.props.client.mutate({
        mutation: Create_New_Gift_Card,
        variables: {
          input: {
            giftCard: {
              userId: user.rowId,
              initialValue: amount,
              actualValue: amount,
              giftcardcode: Math.floor(
                10000000 + Math.random() * 90000000
              ).toString(),
            },
          },
        },
      });
      const { giftCard } = query?.data?.createGiftCard;
      if (giftCard && giftCard.giftcardcode) {
        this.dropDownAlertRef.alertWithType(
          "success",
          "Success",
          "Purchase successful!"
        );
        setTimeout(() => this.fetchGiftCardList(), 3000);
      } else {
        this.dropDownAlertRef.alertWithType(
          "error",
          "Error",
          "Could not purchase gift card."
        );
      }
    } catch (err) {
      this.dropDownAlertRef.alertWithType(
        "error",
        "Error",
        "Could not purchase gift card."
      );
      console.log("error : ", err);
    }
  };

  render() {
    const { giftCardList } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.titleTextStyle}>Buy Gift Card</Text>
        </View>
        {giftCardListItems.map((item) => (
          <GiftCardRow buyGiftCard={this.buyGiftCard} amount={item} />
        ))}
        <View style={styles.spaceBetweenButton}></View>
        <Text style={styles.egiftCardListTitleStyle}>Gift Cards</Text>
        <View
          style={{
            overflowY: "auto",
            height: height * 0.5,
            marginBottom: 20,
            width: "100%",
          }}
        >
          {giftCardList.map((item) => (
            <PurchasedGiftCardRow row={item} />
          ))}
        </View>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  egiftCardListTitleStyle: {
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
  graphql(Create_New_Gift_Card, { name: "Create_New_Gift_Card" }),
  graphql(List_Gift_Cards, { name: "List_Gift_Cards" })
)(ManageCoupon);
