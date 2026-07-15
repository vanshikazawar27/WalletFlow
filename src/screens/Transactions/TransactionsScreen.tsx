import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useTheme } from '../../theme/ThemeProvider';
import { useTransactionStore } from '../../store/transactionStore';
import { TransactionItem } from '../../components/dashboard/TransactionItem';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const TransactionsScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const transactions = useTransactionStore(state => state.transactions);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortOption, setSortOption] = useState<'dateDesc' | 'dateAsc' | 'amountDesc' | 'amountAsc'>('dateDesc');

  const filteredSorted = useMemo(() => {
    let list = [...transactions];
    if (filterType !== 'all') {
      list = list.filter(t => t.type === filterType);
    }
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q));
    }
    switch (sortOption) {
      case 'dateDesc':
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'dateAsc':
        list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'amountDesc':
        list.sort((a, b) => b.amount - a.amount);
        break;
      case 'amountAsc':
        list.sort((a, b) => a.amount - b.amount);
        break;
    }
    return list;
  }, [transactions, filterType, search, sortOption]);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInDown.duration(300).delay(100 * index)}>
      <TransactionItem
        transaction={item}
        onPress={(tx) => (navigation as any).navigate('EditTransaction', { id: tx.id })}
      />
    </Animated.View>
  );

  return (
    <ScreenWrapper style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="Search by title"
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter & Sort Controls */}
      <View style={styles.controlsRow}>
        {/* Type Filter */}
        <View style={styles.filterGroup}>
          {['all', 'income', 'expense'].map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.filterButton, filterType === type && { backgroundColor: colors.primary }]}
              onPress={() => setFilterType(type as any)}
            >
              <Text style={{ color: filterType === type ? '#FFF' : colors.textPrimary, fontWeight: '600' }}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Sort Options */}
        <View style={styles.sortGroup}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setSortOption(prev => (prev === 'dateDesc' ? 'dateAsc' : 'dateDesc'))}
          >
            <Ionicons name="time" size={18} color={colors.textPrimary} />
            <Text style={styles.sortText}>Date {sortOption.includes('date') && (sortOption === 'dateDesc' ? '↓' : '↑')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setSortOption(prev => (prev === 'amountDesc' ? 'amountAsc' : 'amountDesc'))}
          >
            <Ionicons name="cash" size={18} color={colors.textPrimary} />
            <Text style={styles.sortText}>Amount {sortOption.includes('amount') && (sortOption === 'amountDesc' ? '↓' : '↑')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List or Empty State */}
      {filteredSorted.length === 0 ? (
        <View style={styles.emptyContainer}>
           <Image source={require('../../assets/images/empty_transactions_1783691147288.png')} style={styles.emptyImage} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSorted}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  filterGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  sortGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  sortText: {
    fontSize: 12,
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
