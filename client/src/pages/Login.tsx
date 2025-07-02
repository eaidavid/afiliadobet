import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Zap, Mail, Lock, User, Building2 } from "lucide-react";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    confirmPassword: ""
  });
  
  const { login, register, isLoading, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/affiliate");
      }
    }
  }, [isAuthenticated, user, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao AfiliadosBet",
      });
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Erro na validação",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    try {
      await register({
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        fullName: registerData.fullName,
        role: "affiliate"
      });
      toast({
        title: "Registro realizado com sucesso!",
        description: "Sua conta foi criada. Faça login para continuar.",
      });
      setIsRegistering(false);
    } catch (error) {
      toast({
        title: "Erro no registro",
        description: "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="login-container flex items-center justify-center min-h-screen p-4">
      <div className="login-card w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="heading-2 text-white mb-2">
            {isRegistering ? "Criar Conta" : "AfiliadosBet"}
          </h1>
          <p className="body-regular text-slate-300">
            {isRegistering 
              ? "Junte-se ao melhor sistema de afiliados"
              : "Sistema de gestão para afiliados e casas de apostas"
            }
          </p>
        </div>

        {/* Login Form */}
        {!isRegistering ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200 font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="input-enhanced pl-12"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="input-enhanced pl-12"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-base font-semibold"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center pt-4">
              <p className="text-slate-400 text-sm">
                Não tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Criar conta
                </button>
              </p>
            </div>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-200 font-medium">
                Nome Completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="fullName"
                  type="text"
                  value={registerData.fullName}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="input-enhanced pl-12"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-200 font-medium">
                Nome de Usuário
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="username"
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                  className="input-enhanced pl-12"
                  placeholder="seuusuario"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registerEmail" className="text-slate-200 font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="registerEmail"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-enhanced pl-12"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registerPassword" className="text-slate-200 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="registerPassword"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  className="input-enhanced pl-12"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-200 font-medium">
                Confirmar Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="input-enhanced pl-12"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-base font-semibold"
            >
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </Button>

            <div className="text-center pt-4">
              <p className="text-slate-400 text-sm">
                Já tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Fazer login
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-slate-300 text-sm font-medium mb-2">Credenciais de Teste:</p>
          <div className="space-y-1 text-xs text-slate-400">
            <div>
              <strong className="text-emerald-400">Admin:</strong> admin@sistema.com / admin123
            </div>
            <div>
              <strong className="text-blue-400">Afiliado:</strong> afiliado@teste.com / user123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}