
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { TabFormField } from '@/components/common/TabFormField';

export function SearchTab() {
  return (
    <div className="space-y-6">
      <TabFormField
        placeholder="Recherche IA avancée..."
        onSearch={(query) =>
}
