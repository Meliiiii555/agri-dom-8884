import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings, 
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Lock,
  Unlock
} from 'lucide-react';

interface UserManagementSectionProps {
  language?: string;
}

export function UserManagementSection({ language = "fr" }: UserManagementSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getText = (key: string) => {
    const translations = {
      fr: {
        title: "Gestion des Utilisateurs",
        description: "Gérez les utilisateurs, rôles et permissions",
        usersList: "Liste des Utilisateurs",
        rolesPermissions: "Rôles & Permissions",
        addUser: "Ajouter Utilisateur",
        searchUsers: "Rechercher des utilisateurs...",
        active: "Actif",
        inactive: "Inactif",
        administrator: "Administrateur",
        editor: "Éditeur",
        viewer: "Lecteur"
      },
      ar: {
        title: "إدارة المستخدمين",
        description: "أدر المستخدمين والأدوار والصلاحيات",
        usersList: "قائمة المستخدمين",
        rolesPermissions: "الأدوار والصلاحيات",
        addUser: "إضافة مستخدم",
        searchUsers: "البحث عن المستخدمين...",
        active: "نشط",
        inactive: "غير نشط",
        administrator: "مدير",
        editor: "محرر",
        viewer: "قارئ"
      },
      en: {
        title: "User Management",
        description: "Manage users, roles and permissions",
        usersList: "Users List",
        rolesPermissions: "Roles & Permissions",
        addUser: "Add User",
        searchUsers: "Search users...",
        active: "Active",
        inactive: "Inactive",
        administrator: "Administrator",
        editor: "Editor",
        viewer: "Viewer"
      }
    };
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations['fr']] || key;
  };

  const mockUsers = [
    { id: 1, name: "Ahmed Benali", email: "ahmed.benali@justice.gov.dz", role: "administrator", status: "active" },
    { id: 2, name: "Fatima Kaddour", email: "fatima.kaddour@justice.gov.dz", role: "editor", status: "active" },
    { id: 3, name: "Mohamed Cherif", email: "mohamed.cherif@justice.gov.dz", role: "viewer", status: "inactive" },
    { id: 4, name: "Samira Bouazza", email: "samira.bouazza@justice.gov.dz", role: "editor", status: "active" }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrator': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users-list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users-list">{getText("usersList")}</TabsTrigger>
          <TabsTrigger value="roles-permissions">{getText("rolesPermissions")}</TabsTrigger>
        </TabsList>

        <TabsContent value="users-list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {getText("usersList")}
                </CardTitle>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {getText("addUser")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={getText("searchUsers")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-3">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getRoleColor(user.role)}>
                        {getText(user.role)}
                      </Badge>
                      <Badge className={getStatusColor(user.status)}>
                        {getText(user.status)}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles-permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                {getText("rolesPermissions")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-500" />
                      <h4 className="font-medium">{getText("administrator")}</h4>
                    </div>
                    <p className="text-sm text-gray-600">Accès complet au système</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="w-3 h-3 text-green-500" />
                        <span>Gestion des utilisateurs</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="w-3 h-3 text-green-500" />
                        <span>Configuration système</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="w-3 h-3 text-green-500" />
                        <span>Toutes les données</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Edit className="w-5 h-5 text-blue-500" />
                      <h4 className="font-medium">{getText("editor")}</h4>
                    </div>
                    <p className="text-sm text-gray-600">Modification du contenu</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="w-3 h-3 text-green-500" />
                        <span>Créer/modifier textes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="w-3 h-3 text-green-500" />
                        <span>Gérer procédures</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Unlock className="w-3 h-3 text-gray-400" />
                        <span>Configuration système</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-500" />
                      <h4 className="font-medium">{getText("viewer")}</h4>
                    </div>
                    <p className="text-sm text-gray-600">Consultation uniquement</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="w-3 h-3 text-green-500" />
                        <span>Lire les documents</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="w-3 h-3 text-green-500" />
                        <span>Rechercher</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Unlock className="w-3 h-3 text-gray-400" />
                        <span>Modifier le contenu</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}