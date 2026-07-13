import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCategoryStore } from '../../store/categoryStore';
import { Ionicons } from '@expo/vector-icons';

const CategoriesScreen = () => {
  const navigation = useNavigation<any>();
  const categories = useCategoryStore(state => state.categories);

  const deleteCategory = useCategoryStore(state => state.deleteCategory);

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.itemContainer, { backgroundColor: item?.color || '#fff' }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={item?.icon || 'pricetag-outline'} size={24} color="#000" />
        <Text style={styles.itemText}>{item?.name}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteCategory(item.id)} style={{ padding: 4 }}>
        <Ionicons name="trash-outline" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={item => item.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddCategory' as never)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { padding: 16 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  itemText: { marginLeft: 12, fontSize: 16, color: '#333' },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0066ff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default CategoriesScreen;
