import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';

const HINDI_MONTHS = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

const { height } = Dimensions.get('window');

// Pre-calculate years to keep reference stable
const CURRENT_ACTUAL_YEAR = new Date().getFullYear();
const YEARS_DATA = Array.from({ length: 101 }, (_, i) => CURRENT_ACTUAL_YEAR - 50 + i);

const ITEM_HEIGHT = 50;
const ITEM_MARGIN_VERTICAL = 4;
const TOTAL_ITEM_HEIGHT = ITEM_HEIGHT + (ITEM_MARGIN_VERTICAL * 2);

export const MonthYearPicker = ({
  visible,
  onClose,
  onSelect,
  currentMonth,
  currentYear,
  colors,
  isDarkMode,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const yearListRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setSelectedMonth(currentMonth);
      setSelectedYear(currentYear);
      
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
        speed: 14,
      }).start();

      // Scroll smoothly to the current year exactly once
      const index = YEARS_DATA.indexOf(currentYear);
      if (index >= 0) {
        scrollTimeoutRef.current = setTimeout(() => {
          if (yearListRef.current) {
            yearListRef.current.scrollToIndex({
              index,
              animated: true,
              viewPosition: 0.5, // Center the item
            });
          }
        }, 150); // Small delay to allow modal layout and flatlist mount
      }
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    }
    
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [visible, currentMonth, currentYear, slideAnim]);

  const handleConfirm = () => {
    onSelect(selectedMonth, selectedYear);
    onClose();
  };

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const renderMonthItem = ({ item, index }) => {
    const isSelected = selectedMonth === index;
    return (
      <TouchableOpacity
        onPress={() => setSelectedMonth(index)}
        style={[
          styles.listItem,
          isSelected && { backgroundColor: colors.saffron + '20' },
          { borderColor: isSelected ? colors.saffron : 'transparent' }
        ]}
      >
        <Text style={[
          styles.listText,
          { color: isSelected ? colors.saffron : colors.text },
          isSelected && { fontFamily: 'Poppins-Bold' }
        ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderYearItem = ({ item }) => {
    const isSelected = selectedYear === item;
    return (
      <TouchableOpacity
        onPress={() => setSelectedYear(item)}
        style={[
          styles.listItem,
          isSelected && { backgroundColor: colors.saffron + '20' },
          { borderColor: isSelected ? colors.saffron : 'transparent' }
        ]}
      >
        <Text style={[
          styles.listText,
          { color: isSelected ? colors.saffron : colors.text },
          isSelected && { fontFamily: 'Poppins-Bold' }
        ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const getItemLayout = (data, index) => ({
    length: TOTAL_ITEM_HEIGHT,
    offset: TOTAL_ITEM_HEIGHT * index,
    index,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={[styles.overlay, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />
        
        <Animated.View
          style={[
            styles.bottomSheet,
            { 
              backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF', 
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: isDarkMode ? '#333333' : '#E5E5E5' }]}>
            <Text style={[styles.title, { color: colors.text }]}>महीना और वर्ष चुनें</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Lists Container */}
          <View style={styles.listsContainer}>
            {/* Months List */}
            <View style={styles.listWrapper}>
              <Text style={[styles.listTitle, { color: colors.text }]}>महीना</Text>
              <FlatList
                data={HINDI_MONTHS}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderMonthItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
                getItemLayout={getItemLayout}
              />
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#333333' : '#E5E5E5' }]} />

            {/* Years List */}
            <View style={styles.listWrapper}>
              <Text style={[styles.listTitle, { color: colors.text }]}>वर्ष</Text>
              <FlatList
                ref={yearListRef}
                data={YEARS_DATA}
                keyExtractor={(item) => item.toString()}
                renderItem={renderYearItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
                getItemLayout={getItemLayout}
              />
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: colors.saffron }]}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmText}>चुनें</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    height: height * 0.55,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  listsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
  },
  listWrapper: {
    flex: 1,
  },
  listTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.7,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  listItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    marginVertical: ITEM_MARGIN_VERTICAL,
    marginHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  listText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  divider: {
    width: 1,
    marginVertical: 10,
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});
