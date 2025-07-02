import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Phone, Mail, Key, Camera } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

export default function AffiliateProfile() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [personalData, setPersonalData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: profile?.phone || "",
  });

  const [addressData, setAddressData] = useState({
    address: profile?.address || "",
  });

  const [bankData, setBankData] = useState({
    pixKey: profile?.pixKey || "",
    bankAccount: profile?.bankAccount || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", "/api/profile/contact", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", "/api/profile/address", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Endereço atualizado",
        description: "Seu endereço foi atualizado com sucesso.",
      });
    },
  });

  const updateBankMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", "/api/profile/bank", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Dados bancários atualizados",
        description: "Seus dados bancários foram atualizados com sucesso.",
      });
    },
  });

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(personalData);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAddressMutation.mutate(addressData);
  };

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBankMutation.mutate(bankData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    // Implementation for password change would go here
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A alteração de senha será implementada em breve.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-foreground">Meu Perfil</h2>

      {/* Profile Header */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-primary text-white">
                  {user?.fullName?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground">{user?.fullName}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="outline" className="border-warning text-warning">
                  {profile?.level || 'Novato'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {profile?.points || 0} pontos
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Saldo disponível</div>
              <div className="text-2xl font-bold text-secondary">
                R$ {Number(profile?.availableBalance || 0).toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="address">Endereço</TabsTrigger>
          <TabsTrigger value="payment">Pagamento</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Informações Pessoais</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePersonalSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      value={personalData.fullName}
                      onChange={(e) => setPersonalData({...personalData, fullName: e.target.value})}
                      className="bg-surface border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalData.email}
                      onChange={(e) => setPersonalData({...personalData, email: e.target.value})}
                      className="bg-surface border-white/10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    value={personalData.phone}
                    onChange={(e) => setPersonalData({...personalData, phone: e.target.value})}
                    className="bg-surface border-white/10"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Endereço</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Textarea
                    id="address"
                    placeholder="Rua, número, bairro, cidade, estado, CEP"
                    value={addressData.address}
                    onChange={(e) => setAddressData({...addressData, address: e.target.value})}
                    className="bg-surface border-white/10 min-h-[100px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={updateAddressMutation.isPending}
                >
                  {updateAddressMutation.isPending ? "Salvando..." : "Salvar Endereço"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Dados de Pagamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBankSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pixKey">Chave PIX</Label>
                  <Input
                    id="pixKey"
                    placeholder="Digite sua chave PIX (CPF, email, telefone ou chave aleatória)"
                    value={bankData.pixKey}
                    onChange={(e) => setBankData({...bankData, pixKey: e.target.value})}
                    className="bg-surface border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Dados Bancários (Opcional)</Label>
                  <Textarea
                    id="bankAccount"
                    placeholder="Banco, agência, conta corrente"
                    value={bankData.bankAccount}
                    onChange={(e) => setBankData({...bankData, bankAccount: e.target.value})}
                    className="bg-surface border-white/10"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={updateBankMutation.isPending}
                >
                  {updateBankMutation.isPending ? "Salvando..." : "Salvar Dados Bancários"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5" />
                <span>Segurança</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="bg-surface border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="bg-surface border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="bg-surface border-white/10"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Alterar Senha
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
