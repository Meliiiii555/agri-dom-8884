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
  Shield, 
  Lock, 
  Key, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Fingerprint,
  Wifi,
  Database,
  Activity
} from 'lucide-react';

interface SecuritySectionProps {
  language?: string;
}

export function SecuritySection({ language = "fr" }: SecuritySectionProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sslEnabled, setSslEnabled] = useState(true);
  const [auditLogsEnabled, setAuditLogsEnabled] = useState(true);
  const [ipWhitelistEnabled, setIpWhitelistEnabled] = useState(false);

  const getText = (key: string) => {
    const translations = {
      fr: {
        title: "Sécurité",
        description: "Configurez les paramètres de sécurité et authentification",
        authentication: "Authentification",
        dataProtection: "Protection des Données",
        auditSecurity: "Audit & Sécurité",
        twoFactor: "Authentification à deux facteurs",
        sslEncryption: "Chiffrement SSL/TLS",
        auditLogs: "Journaux d'audit",
        ipWhitelist: "Liste blanche IP",
        enabled: "Activé",
        disabled: "Désactivé"
      },
      ar: {
        title: "الأمان",
        description: "اضبط إعدادات الأمان والمصادقة",
        authentication: "المصادقة",
        dataProtection: "حماية البيانات",
        auditSecurity: "التدقيق والأمان",
        twoFactor: "المصادقة ثنائية العوامل",
        sslEncryption: "تشفير SSL/TLS",
        auditLogs: "سجلات التدقيق",
        ipWhitelist: "القائمة البيضاء لعناوين IP",
        enabled: "مفعل",
        disabled: "معطل"
      },
      en: {
        title: "Security",
        description: "Configure security settings and authentication",
        authentication: "Authentication",
        dataProtection: "Data Protection",
        auditSecurity: "Audit & Security",
        twoFactor: "Two-factor authentication",
        sslEncryption: "SSL/TLS Encryption",
        auditLogs: "Audit Logs",
        ipWhitelist: "IP Whitelist",
        enabled: "Enabled",
        disabled: "Disabled"
      }
    };
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations['fr']] || key;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="authentication" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="authentication">{getText("authentication")}</TabsTrigger>
          <TabsTrigger value="data-protection">{getText("dataProtection")}</TabsTrigger>
          <TabsTrigger value="audit-security">{getText("auditSecurity")}</TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-blue-600" />
                {getText("authentication")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-green-500" />
                  <div>
                    <h4 className="font-medium">{getText("twoFactor")}</h4>
                    <p className="text-sm text-gray-600">Sécurité renforcée avec code SMS ou application</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {twoFactorEnabled ? getText("enabled") : getText("disabled")}
                  </Badge>
                  <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                </div>
              </div>

              {twoFactorEnabled && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="space-y-4">
                    <Label>Méthode d'authentification</Label>
                    <Select defaultValue="app">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="app">Application d'authentification</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h5 className="font-medium">Politiques de mot de passe</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Longueur minimale</Label>
                    <Input type="number" defaultValue="8" min="6" max="32" />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiration (jours)</Label>
                    <Input type="number" defaultValue="90" min="30" max="365" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-protection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-600" />
                {getText("dataProtection")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">{getText("sslEncryption")}</h4>
                    <p className="text-sm text-gray-600">Chiffrement des communications HTTPS</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    {getText("enabled")}
                  </Badge>
                  <Switch checked={sslEnabled} onCheckedChange={setSslEnabled} disabled />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <div>
                    <h4 className="font-medium">Sauvegarde chiffrée</h4>
                    <p className="text-sm text-gray-600">Chiffrement des sauvegardes de données</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    {getText("enabled")}
                  </Badge>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h5 className="font-medium text-blue-800">Certification de sécurité</h5>
                </div>
                <p className="text-sm text-blue-700">
                  Cette application respecte les standards de sécurité algériens et internationaux (ISO 27001, RGPD).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-600" />
                {getText("auditSecurity")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-500" />
                  <div>
                    <h4 className="font-medium">{getText("auditLogs")}</h4>
                    <p className="text-sm text-gray-600">Enregistrement des actions utilisateur</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={auditLogsEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {auditLogsEnabled ? getText("enabled") : getText("disabled")}
                  </Badge>
                  <Switch checked={auditLogsEnabled} onCheckedChange={setAuditLogsEnabled} />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <div>
                    <h4 className="font-medium">{getText("ipWhitelist")}</h4>
                    <p className="text-sm text-gray-600">Restriction d'accès par adresse IP</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={ipWhitelistEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {ipWhitelistEnabled ? getText("enabled") : getText("disabled")}
                  </Badge>
                  <Switch checked={ipWhitelistEnabled} onCheckedChange={setIpWhitelistEnabled} />
                </div>
              </div>

              {ipWhitelistEnabled && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <Label>Adresses IP autorisées</Label>
                  <div className="space-y-2 mt-2">
                    <Input placeholder="192.168.1.0/24" />
                    <Input placeholder="10.0.0.0/8" />
                    <Button variant="outline" size="sm">
                      Ajouter une plage IP
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h5 className="font-medium">24</h5>
                  <p className="text-sm text-gray-600">Connexions aujourd'hui</p>
                </Card>
                <Card className="p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <h5 className="font-medium">2</h5>
                  <p className="text-sm text-gray-600">Tentatives suspectes</p>
                </Card>
                <Card className="p-4 text-center">
                  <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h5 className="font-medium">99.9%</h5>
                  <p className="text-sm text-gray-600">Disponibilité</p>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}