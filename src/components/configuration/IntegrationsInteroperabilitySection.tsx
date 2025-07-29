import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plug, 
  Database, 
  Cloud, 
  Globe, 
  Link,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings,
  Key,
  Webhook
} from 'lucide-react';

interface IntegrationsInteroperabilitySectionProps {
  language?: string;
}

export function IntegrationsInteroperabilitySection({ language = "fr" }: IntegrationsInteroperabilitySectionProps) {
  const [apiEnabled, setApiEnabled] = useState(true);
  const [webservicesEnabled, setWebservicesEnabled] = useState(false);
  const [exportEnabled, setExportEnabled] = useState(true);

  const getText = (key: string) => {
    const translations = {
      fr: {
        title: "Intégrations et Interopérabilité",
        description: "Configurez les intégrations et standards d'interopérabilité",
        apiIntegrations: "Intégrations API",
        dataExchange: "Échange de Données",
        externalSystems: "Systèmes Externes",
        apiAccess: "Accès API REST",
        webservices: "Services Web SOAP",
        dataExport: "Export de données",
        connected: "Connecté",
        disconnected: "Déconnecté",
        configure: "Configurer"
      },
      ar: {
        title: "التكامل والتشغيل البيني",
        description: "اضبط التكامل ومعايير التشغيل البيني",
        apiIntegrations: "تكامل واجهة برمجة التطبيقات",
        dataExchange: "تبادل البيانات",
        externalSystems: "الأنظمة الخارجية",
        apiAccess: "الوصول إلى API REST",
        webservices: "خدمات الويب SOAP",
        dataExport: "تصدير البيانات",
        connected: "متصل",
        disconnected: "غير متصل",
        configure: "تكوين"
      },
      en: {
        title: "Integrations and Interoperability",
        description: "Configure integrations and interoperability standards",
        apiIntegrations: "API Integrations",
        dataExchange: "Data Exchange",
        externalSystems: "External Systems",
        apiAccess: "REST API Access",
        webservices: "SOAP Web Services",
        dataExport: "Data Export",
        connected: "Connected",
        disconnected: "Disconnected",
        configure: "Configure"
      }
    };
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations['fr']] || key;
  };

  const integrations = [
    {
      id: 1,
      name: "Système Judiciaire National",
      description: "Intégration avec le système central de justice",
      status: "connected",
      type: "Government",
      lastSync: "Il y a 2 heures"
    },
    {
      id: 2,
      name: "Base JORADP",
      description: "Journal Officiel de la République Algérienne",
      status: "connected",
      type: "Legal Database",
      lastSync: "Il y a 1 jour"
    },
    {
      id: 3,
      name: "Ministère de la Justice",
      description: "API officielle du Ministère",
      status: "disconnected",
      type: "Government",
      lastSync: "Jamais"
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="api-integrations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api-integrations">{getText("apiIntegrations")}</TabsTrigger>
          <TabsTrigger value="data-exchange">{getText("dataExchange")}</TabsTrigger>
          <TabsTrigger value="external-systems">{getText("externalSystems")}</TabsTrigger>
        </TabsList>

        <TabsContent value="api-integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plug className="w-5 h-5 text-blue-600" />
                {getText("apiIntegrations")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-500" />
                  <div>
                    <h4 className="font-medium">{getText("apiAccess")}</h4>
                    <p className="text-sm text-gray-600">API REST pour l'accès aux données juridiques</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={apiEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {apiEnabled ? getText("connected") : getText("disconnected")}
                  </Badge>
                  <Switch checked={apiEnabled} onCheckedChange={setApiEnabled} />
                </div>
              </div>

              {apiEnabled && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="space-y-3">
                    <Label>Clé API</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="password" 
                        value="da7f8c3e-****-****-****-************" 
                        readOnly 
                        className="flex-1"
                      />
                      <Button variant="outline">
                        <Key className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-green-700">
                      Endpoint: https://api.dalil.dz/v1/
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Webhook className="w-5 h-5 text-purple-500" />
                  <div>
                    <h4 className="font-medium">{getText("webservices")}</h4>
                    <p className="text-sm text-gray-600">Services web SOAP pour systèmes legacy</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={webservicesEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {webservicesEnabled ? getText("connected") : getText("disconnected")}
                  </Badge>
                  <Switch checked={webservicesEnabled} onCheckedChange={setWebservicesEnabled} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-exchange" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-600" />
                {getText("dataExchange")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">{getText("dataExport")}</h4>
                    <p className="text-sm text-gray-600">Export automatique vers systèmes externes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={exportEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {exportEnabled ? getText("connected") : getText("disconnected")}
                  </Badge>
                  <Switch checked={exportEnabled} onCheckedChange={setExportEnabled} />
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium">Formats d'export supportés</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['JSON', 'XML', 'CSV', 'PDF'].map((format) => (
                    <Card key={format} className="p-3 text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <span className="text-blue-600 text-xs font-bold">{format}</span>
                      </div>
                      <p className="text-sm font-medium">{format}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium">Standards de métadonnées</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h6 className="font-medium">Dublin Core</h6>
                    </div>
                    <p className="text-sm text-gray-600">Standard international pour les métadonnées</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h6 className="font-medium">OAIS</h6>
                    </div>
                    <p className="text-sm text-gray-600">Archivage et préservation des documents</p>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="external-systems" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Link className="w-5 h-5 text-purple-600" />
                  {getText("externalSystems")}
                </CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Intégration
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {integrations.map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        integration.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{integration.type}</Badge>
                          <span className="text-xs text-gray-500">{integration.lastSync}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        integration.status === 'connected' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }>
                        {getText(integration.status)}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h5 className="font-medium text-blue-800">Conformité aux standards</h5>
                </div>
                <p className="text-sm text-blue-700">
                  Toutes les intégrations respectent les standards algériens d'interopérabilité 
                  et les protocoles de sécurité gouvernementaux.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}