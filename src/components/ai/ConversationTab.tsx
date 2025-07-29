
import React from 'react';
import { TabFormField } from '@/components/common/TabFormField';
import { ConversationalAIAssistant } from './ConversationalAIAssistant';
import { AIInsightsAndHistory } from './AIInsightsAndHistory';

export function ConversationTab() {
  return (
    <div className="space-y-6">
      <TabFormField
        placeholder="Poser une question à l'assistant IA juridique..."
        onSearch={(query) =>
}
