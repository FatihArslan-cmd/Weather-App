import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';

const RefreshScrollView = ({ refreshing, onRefresh, children }) => {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {children}
    </ScrollView>
  );
};

export default RefreshScrollView;
