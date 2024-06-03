import React from "react";
import { Text, View } from "react-native";

const PurchasedGiftCardRow = ({ row }) => {
  const { initialValue, actualValue, giftcardcode } = row;
  return (
    <View
      style={{
        padding: "1rem",
        background: "#3A9E984A",
        height: 75,
        width: "90%",
        margin: 10,
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 10,
        padding: 10,
      }}
    >
      <Text>Total : $ {initialValue}</Text>
      <Text>Remaining : $ {actualValue}</Text>
      <Text>Code : {giftcardcode}</Text>
    </View>
  );
};
export default PurchasedGiftCardRow;
