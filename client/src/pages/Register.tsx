import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, Mail, Lock, User, Phone, CreditCard, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  username: z.string().min(3, 'Username deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').max(14, 'CPF inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  birthDate: z.string().min(10, 'Data de nascimento obrigatória'),
  pixKeyType: z.enum(['cpf', 'email', 'phone', 'random']),
  pixKeyValue: z.string().min(5, 'Chave PIX inválida'),
  acceptTerms: z.boolean().refine((val) => val === true, 'Você deve aceitar os termos')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      cpf: '',
      phone: '',
      birthDate: '',
      pixKeyType: 'cpf',
      pixKeyValue: '',
      acceptTerms: false
    }
  });

  const watchedPixKeyType = form.watch('pixKeyType');
  const watchedCpf = form.watch('cpf');
  const watchedEmail = form.watch('email');
  const watchedPhone = form.watch('phone');

  // Auto-fill PIX key based on type
  const handlePixKeyTypeChange = (value: string) => {
    form.setValue('pixKeyType', value as any);
    switch (value) {
      case 'cpf':
        form.setValue('pixKeyValue', watchedCpf);
        break;
      case 'email':
        form.setValue('pixKeyValue', watchedEmail);
        break;
      case 'phone':
        form.setValue('pixKeyValue', watchedPhone);
        break;
      default:
        form.setValue('pixKeyValue', '');
    }
  };

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          role: 'affiliate'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro no cadastro');
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você já pode fazer login e começar a usar a plataforma."
      });

      setLocation('/login');
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-white/60 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">AB</span>
            </div>
            <span className="text-3xl font-bold text-white">AfiliadosBet</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Criar Conta de Afiliado</h1>
          <p className="text-slate-300">Preencha os dados abaixo para começar a ganhar</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Dados Pessoais</CardTitle>
            <CardDescription className="text-slate-300">
              Todos os campos são obrigatórios para validação da conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Dados Básicos */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-white">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="fullName"
                      {...form.register('fullName')}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  {form.formState.errors.fullName && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="username"
                      {...form.register('username')}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                      placeholder="Seu username único"
                    />
                  </div>
                  {form.formState.errors.username && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.username.message}</p>
                  )}
                </div>
              </div>

              {/* Email e Senha */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                      placeholder="seu@email.com"
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="text-white">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      {...form.register('password')}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.password.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...form.register('confirmPassword')}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                    placeholder="Confirme sua senha"
                  />
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              {/* CPF e Telefone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cpf" className="text-white">CPF</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="cpf"
                      {...form.register('cpf', {
                        onChange: (e) => {
                          const formatted = formatCpf(e.target.value);
                          form.setValue('cpf', formatted);
                          if (watchedPixKeyType === 'cpf') {
                            form.setValue('pixKeyValue', formatted);
                          }
                        }
                      })}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>
                  {form.formState.errors.cpf && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.cpf.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="phone"
                      {...form.register('phone', {
                        onChange: (e) => {
                          const formatted = formatPhone(e.target.value);
                          form.setValue('phone', formatted);
                          if (watchedPixKeyType === 'phone') {
                            form.setValue('pixKeyValue', formatted);
                          }
                        }
                      })}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                  </div>
                  {form.formState.errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Data de Nascimento */}
              <div>
                <Label htmlFor="birthDate" className="text-white">Data de Nascimento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="birthDate"
                    type="date"
                    {...form.register('birthDate')}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                {form.formState.errors.birthDate && (
                  <p className="text-red-400 text-sm mt-1">{form.formState.errors.birthDate.message}</p>
                )}
              </div>

              {/* Chave PIX */}
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Tipo de Chave PIX</Label>
                  <Select value={form.watch('pixKeyType')} onValueChange={handlePixKeyTypeChange}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="cpf">CPF</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Telefone</SelectItem>
                      <SelectItem value="random">Chave Aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="pixKeyValue" className="text-white">Chave PIX</Label>
                  <Input
                    id="pixKeyValue"
                    {...form.register('pixKeyValue')}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder={
                      watchedPixKeyType === 'cpf' ? 'Seu CPF' :
                      watchedPixKeyType === 'email' ? 'Seu email' :
                      watchedPixKeyType === 'phone' ? 'Seu telefone' :
                      'Chave PIX aleatória'
                    }
                  />
                  {form.formState.errors.pixKeyValue && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.pixKeyValue.message}</p>
                  )}
                </div>
              </div>

              {/* Termos */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={form.watch('acceptTerms')}
                  onCheckedChange={(checked) => form.setValue('acceptTerms', !!checked)}
                  className="border-slate-600"
                />
                <Label htmlFor="acceptTerms" className="text-sm text-slate-300">
                  Aceito os{' '}
                  <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                    termos de uso
                  </Link>
                  {' '}e{' '}
                  <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                    política de privacidade
                  </Link>
                </Label>
              </div>
              {form.formState.errors.acceptTerms && (
                <p className="text-red-400 text-sm">{form.formState.errors.acceptTerms.message}</p>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-slate-300">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="text-blue-400 hover:text-blue-300">
                    Fazer login
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}