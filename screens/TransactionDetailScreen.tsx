import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Transaction } from './types';

type RootStackParamList = {
  TransactionDetail: { transaction: Transaction };
};

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionDetail'>;

const TransactionDetailScreen: React.FC<Props> = ({ route }) => {
  const { transaction } = route.params;

  console.log(transaction);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction Details</Text>

      <View style={styles.detailBox}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{transaction.description}</Text>
      </View>

      <View style={styles.detailBox}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={[styles.value, transaction.type === 'Credit' ? styles.credit : styles.debit]}>
        ${typeof transaction.amount === 'number' ? transaction.amount.toFixed(2) : parseFloat(transaction.amount || '0').toFixed(2)}
        </Text>
      </View>

      <View style={styles.detailBox}>
        <Text style={styles.label}>Category:</Text>
        <Text style={styles.value}>{transaction.category}</Text>
      </View>

      <View style={styles.detailBox}>
        <Text style={styles.label}>Transaction Type:</Text>
        <Text style={styles.value}>{transaction.type}</Text>
      </View>

      <View style={styles.detailBox}>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>{transaction.location}</Text>
      </View>

      <View style={styles.detailBox}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{transaction.date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailBox: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  credit: {
    color: '#2E7D32',
  },
  debit: {
    color: '#D32F2F',
  },
});

export default TransactionDetailScreen;
