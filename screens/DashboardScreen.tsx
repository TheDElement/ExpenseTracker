import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Transaction} from './types';
import DateTimePicker from '@react-native-community/datetimepicker';

type RootStackParamList = {
  Dashboard: undefined;
  Login: undefined;
  TransactionDetail: {transaction: Transaction};
};

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({navigation}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      description: 'Bought Groceries',
      amount: 20,
      category: 'Shopping',
      type: 'Debit',
      location: 'Walmart',
      date: '2025-03-01',
    },
    {
      id: '2',
      description: 'Salary Credited',
      amount: 500,
      category: 'Income',
      type: 'Credit',
      location: 'Bank',
      date: '2025-03-01',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [customCategories, setCustomCategories] = useState<string[]>([]); // Store user-added categories

  const [formData, setFormData] = useState<Transaction>({
    id: '',
    description: '',
    amount: 0,
    category: '',
    type: 'Debit',
    location: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dropdownTypeVisible, setDropdownTypeVisible] = useState(false);
  const [dropdownCategoryVisible, setDropdownCategoryVisible] = useState(false);
  const [otherCategory, setOtherCategory] = useState('');

  const handleInputChange = (
    key: keyof Transaction,
    value: string | number,
  ) => {
    setFormData({...formData, [key]: value});
  };

  const validateForm = () => {
    if (
      !formData.description ||
      !formData.amount ||
      !formData.category ||
      !formData.type ||
      !formData.location ||
      !formData.date
    ) {
      Alert.alert('Error', 'Please fill all fields');
      return false;
    }
    return true;
  };

  const addTransaction = () => {
    if (!validateForm()) return;

    // Save the custom category if "Other" is selected
    if (formData.category === 'Other' && otherCategory.trim() !== '') {
      setCustomCategories([...customCategories, otherCategory]);
      formData.category = otherCategory; // Assign custom category
    }

    setTransactions([
      ...transactions,
      {...formData, id: Math.random().toString()},
    ]);
    setModalVisible(false);
    resetForm();
  };

  const editTransaction = () => {
    if (!validateForm() || selectedTransactionId === null) return;

    const updatedTransactions = transactions.map(tx =>
      tx.id === selectedTransactionId ? {...formData, id: tx.id} : tx,
    );

    setTransactions(updatedTransactions);
    setModalVisible(false);
    resetForm();
  };

  const deleteTransaction = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this transaction?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: () =>
            setTransactions(transactions.filter(tx => tx.id !== id)),
          style: 'destructive',
        },
      ],
    );
  };

  const resetForm = () => {
    setFormData({
      id: '',
      description: '',
      amount: 0,
      category: '',
      type: 'Debit',
      location: '',
      date: new Date().toISOString().split('T')[0],
    });
    setOtherCategory('');
    setEditMode(false);
    setSelectedTransactionId(null);
  };

  const openEditModal = (transaction: Transaction) => {
    setFormData(transaction);
    setSelectedTransactionId(transaction.id);
    setEditMode(true);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={() => navigation.replace('Login')} />

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.transactionItem}
            onPress={() =>
              navigation.navigate('TransactionDetail', {transaction: item})
            }>
            <Text style={styles.transactionText}>
              {item.description} - ${item.amount}
            </Text>
            <View style={styles.actionButtons}>
              <Button title="Edit" onPress={() => openEditModal(item)} />
              <Button
                title="Delete"
                color="red"
                onPress={() => deleteTransaction(item.id)}
              />
            </View>
          </TouchableOpacity>
        )}
      />

      <Button
        title="Add Transaction"
        onPress={() => {
          setModalVisible(true);
          resetForm();
        }}
      />

      {/* Modal for Add/Edit Transaction */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {editMode ? 'Edit' : 'Add'} Transaction
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Description"
            value={formData.description}
            onChangeText={text => handleInputChange('description', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="decimal-pad"
            value={formData.amount.toString()}
            onChangeText={text => {
              const validAmount = text.replace(/[^0-9.]/g, '');
              handleInputChange('amount', validAmount);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={formData.location}
            onChangeText={text => handleInputChange('location', text)}
          />

          {/* Category Dropdown */}
          <TouchableOpacity
            onPress={() => setDropdownCategoryVisible(true)}
            style={styles.dropdown}>
            <Text>{formData.category || 'Select Category'}</Text>
          </TouchableOpacity>
          <Modal
            visible={dropdownCategoryVisible}
            transparent
            animationType="slide">
            <View style={styles.dropdownModal}>
              {[
                'Shopping',
                'Travel',
                'Utility',
                'Other',
                ...customCategories,
              ].map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    handleInputChange('category', option);
                    setDropdownCategoryVisible(false);
                  }}>
                  <Text style={styles.dropdownOption}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Modal>

          {/* Show Text Input if "Other" is selected */}
          {formData.category === 'Other' && (
            <TextInput
              style={styles.input}
              placeholder="Enter Category"
              value={otherCategory}
              onChangeText={setOtherCategory}
            />
          )}

           {/* Transaction Type Dropdown */}
           <TouchableOpacity onPress={() => setDropdownTypeVisible(true)} style={styles.dropdown}>
            <Text>{formData.type || "Select Transaction Type"}</Text>
          </TouchableOpacity>
          <Modal visible={dropdownTypeVisible} transparent animationType="slide">
            <View style={styles.dropdownModal}>
              {['Debit', 'Credit', 'Refund'].map((option) => (
                <TouchableOpacity key={option} onPress={() => { handleInputChange('type', option); setDropdownTypeVisible(false); }}>
                  <Text style={styles.dropdownOption}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Modal>

          {/* Date Picker */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>
              {formData.date || 'Select Date'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date(formData.date)}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios'); // Hide for Android
                if (selectedDate)
                  handleInputChange(
                    'date',
                    selectedDate.toISOString().split('T')[0],
                  );
              }}
            />
          )}

          <View style={styles.buttonRow}>
            <Button
              title="Cancel"
              color="red"
              onPress={() => setModalVisible(false)}
            />
            <Button
              title={editMode ? 'Update' : 'Add'}
              onPress={editMode ? editTransaction : addTransaction}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA', // Soft background
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  modalTitle: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderColor: '#B0BEC5',
    backgroundColor: '#ECEFF1',
    fontSize: 16,
  },
  dropdown: {
    padding: 12,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#ECEFF1',
    borderColor: '#B0BEC5',
    alignItems: 'center',
  },
  dropdownModal: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '80%',
    alignSelf: 'center',
    padding: 20,
    borderRadius: 10,
    top: '40%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  dropdownOption: {
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
    color: '#2E7D32',
  },
  datePickerButton: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#ECEFF1',
    borderColor: '#B0BEC5',
    alignItems: 'center',
    marginBottom: 10,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default DashboardScreen;
