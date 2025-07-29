import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  History,
  Zap
} from "lucide-react";
import { SavedSearchesEnhanced } from "../SavedSearchesEnhanced";
import { LegalTextsSearchHistoryTab } from "./LegalTextsSearchHistoryTab";
import { NextGenSearchSection } from "../search/NextGenSearchSection";

export function LegalTextsSearchTab() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="nextgen" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="nextgen" className="text-sm">
            <Zap className="w-4 h-4 mr-1" />
            Recherche Nouvelle Génération
          </TabsTrigger>
          <TabsTrigger value="history" className="text-sm">
            Historique des recherches
          </TabsTrigger>
          <TabsTrigger value="saved-searches" className="text-sm">
            Recherches sauvegardées
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nextgen" className="mt-6">
          <NextGenSearchSection />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <LegalTextsSearchHistoryTab />
        </TabsContent>
        
        <TabsContent value="saved-searches" className="mt-6">
          <SavedSearchesEnhanced />
        </TabsContent>
      </Tabs>
    </div>
  );
}