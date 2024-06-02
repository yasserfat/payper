import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
});

const MyPDF = ({ transferData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Date: {new Date().toLocaleDateString()}</Text>
        <Text>Time: {new Date().toLocaleTimeString()}</Text>
        <Text>Amount Transferred: {transferData?.amount} DZD</Text>
        <Text>From: {transferData?.senderFirstName} {transferData?.senderLastName} / {transferData?.senderId}</Text>
        <Text>To: {transferData?.recipientFirstName} {transferData?.recipientLastName} / {transferData?.recipientId}</Text>
      </View>
    </Page>
  </Document>
);

export default MyPDF;
