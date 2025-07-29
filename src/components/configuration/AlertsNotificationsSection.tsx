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
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Settings, 
  Plus, 
  Target,
  AlertTriangle,
  Info,
  CheckCircle,
  Calendar
} from 'lucide-react';

interface AlertsNotificationsSectionProps {
  language?: string;
}

export function AlertsNotificationsSection({ language = "fr" }: AlertsNotificationsSectionProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [legalAlerts, setLegalAlerts] = useState(true);

  const getText = (key: string) => {
    const translations = {
      fr: {
        title: "Alertes & Notifications",
        description: "Configurez les alertes et notifications du système",
        generalAlerts: "Alertes Générales",
        personalizedAlerts: "Alertes Personnalisées",
        notificationChannels: "Canaux de Notification",
        emailNotifications: "Notifications par Email",
        pushNotifications: "Notifications Push",
        smsNotifications: "Notifications SMS",
        legalAlerts: "Alertes Juridiques"
      },
      ar: {
        title: "التنبيهات والإشعارات",
        description: "اضبط تنبيهات وإشعارات النظام",
        generalAlerts: "التنبيهات العامة",
        personalizedAlerts: "التنبيهات المخصصة",
        notificationChannels: "قنوات الإشعارات",
        emailNotifications: "إشعارات البريد الإلكتروني",
        pushNotifications: "الإشعارات المنبثقة",
        smsNotifications: "إشعارات الرسائل النصية",
        legalAlerts: "التنبيهات القانونية"
      },
      en: {
        title: "Alerts & Notifications",
        description: "Configure system alerts and notifications",
        generalAlerts: "General Alerts",
        personalizedAlerts: "Personalized Alerts",
        notificationChannels: "Notification Channels",
        emailNotifications: "Email Notifications",
        pushNotifications: "Push Notifications",
        smsNotifications: "SMS Notifications",
        legalAlerts: "Legal Alerts"
      }
    };
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations['fr']] || key;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general-alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general-alerts">{getText("generalAlerts")}</TabsTrigger>
          <TabsTrigger value="personalized-alerts">{getText("personalizedAlerts")}</TabsTrigger>
          <TabsTrigger value="notification-channels">{getText("notificationChannels")}</TabsTrigger>
        </TabsList>

        <TabsContent value="general-alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Alertes Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <div>
                        <h4 className="font-medium">Nouvelles Lois</h4>
                        <p className="text-sm text-gray-600">Alertes pour nouvelles publications</p>
                      </div>
                    </div>
                    <Switch checked={legalAlerts} onCheckedChange={setLegalAlerts} />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Mises à jour</h4>
                        <p className="text-sm text-gray-600">Nouvelles fonctionnalités</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personalized-alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Alertes Personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="domain">Domaine Juridique</Label>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sélectionner un domaine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="civil">Droit Civil</SelectItem>
                      <SelectItem value="penal">Droit Pénal</SelectItem>
                      <SelectItem value="commercial">Droit Commercial</SelectItem>
                      <SelectItem value="admin">Droit Administratif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Alerte
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notification-channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                {getText("notificationChannels")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">{getText("emailNotifications")}</h4>
                      <p className="text-sm text-gray-600">Recevoir les alertes par email</p>
                    </div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className="font-medium">{getText("pushNotifications")}</h4>
                      <p className="text-sm text-gray-600">Notifications dans le navigateur</p>
                    </div>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-orange-500" />
                    <div>
                      <h4 className="font-medium">{getText("smsNotifications")}</h4>
                      <p className="text-sm text-gray-600">Alertes par SMS (urgences uniquement)</p>
                    </div>
                  </div>
                  <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>
              </div>

              {smsNotifications && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input 
                    id="phone" 
                    placeholder="+213 xxx xxx xxx" 
                    className="mt-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}