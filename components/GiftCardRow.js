import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

const GiftCardRow = ({ amount, buyGiftCard }) => {
  return (
    <View
      style={{
        padding: "1rem",
        background: "#3A9E984A",
        height: 100,
        width: "90%",
        margin: 10,
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 10,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 700, margin: "auto" }}>
        $ {amount}
      </Text>
      <View
        style={{
          fontSize: 20,
          fontWeight: "bold",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#394F51",
          paddingBottom: 10,
          paddingTop: 10,
          height: 27,
          width: 100,
          margin: "auto",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
          }}
          onPress={() => buyGiftCard(amount)}
        >
          <View>
            {" "}
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 14,
                color: "white",
                margin: "auto",
              }}
            >
              Buy
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default GiftCardRow;
