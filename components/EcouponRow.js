import React from "react";
import { Text, View } from "react-native";

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
}

const EcouponRow = ({ row }) => {
  const { ecouponAmount, validTo, ecouponcode } = row;
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
      <Text>Amount : {ecouponAmount}</Text>
      <Text>Valid Till : {formatDate(validTo)}</Text>
      <Text>Code : {ecouponcode}</Text>
    </View>
  );
};
export default EcouponRow;
