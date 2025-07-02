import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Zap, Mail, Lock, User, Building2, CreditCard } from "lucide-react";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    cpf: "",
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
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center mb-4 shadow-2xl shadow-yellow-500/20">
              <Zap className="w-10 h-10 text-gray-900" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            {isRegistering ? "Criar Conta" : "AfiliadosBet"}
          </h1>
          <p className="text-lg text-slate-300 font-medium">
            {isRegistering 
              ? "Junte-se ao melhor sistema de afiliados"
              : "Sistema profissional para gestão de afiliados"
            }
          </p>
          <div className="mt-4 h-1 w-24 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
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
              className="w-full py-3 text-base font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-gray-900 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25 transform hover:scale-[1.02]"
            >
              {isLoading ? "Entrando..." : "🚀 Entrar no Sistema"}
            </Button>

            <div className="text-center pt-6">
              <p className="text-slate-400 text-sm">
                Não tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors hover:underline"
                >
                  Criar conta gratuita
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
              <Label htmlFor="cpf" className="text-slate-200 font-medium">
                CPF
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="cpf"
                  type="text"
                  value={registerData.cpf}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, cpf: e.target.value }))}
                  className="input-enhanced pl-12"
                  placeholder="000.000.000-00"
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
              className="w-full py-3 text-base font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-gray-900 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25 transform hover:scale-[1.02]"
            >
              {isLoading ? "Criando conta..." : "💰 Criar Conta Gratuita"}
            </Button>

            <div className="text-center pt-6">
              <p className="text-slate-400 text-sm">
                Já tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors hover:underline"
                >
                  Fazer login
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Demo Credentials */}
        <div className="mt-8 p-5 bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-xl border border-yellow-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <p className="text-yellow-400 text-sm font-semibold">Credenciais de Teste</p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-2">
              <span className="text-slate-300">Admin:</span>
              <span className="text-yellow-400 font-mono">admin@sistema.com / admin123</span>
            </div>
            <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-2">
              <span className="text-slate-300">Afiliado:</span>
              <span className="text-emerald-400 font-mono">afiliado@teste.com / user123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}