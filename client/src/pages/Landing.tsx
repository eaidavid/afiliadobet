import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Users, 
  BarChart3, 
  Zap,
  CheckCircle,
  ArrowRight,
  Building,
  Target
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AB</span>
            </div>
            <span className="text-2xl font-bold text-white">AfiliadosBet</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">
            🚀 Programa de Afiliados Líder
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Monetize seu
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}Tráfego
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Conecte-se às melhores casas de apostas do Brasil e ganhe comissões elevadas 
            com nosso sistema de afiliação avançado. Tracking em tempo real, pagamentos automáticos via PIX.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4">
                Começar Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Tudo que você precisa para crescer
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Nossa plataforma oferece todas as ferramentas necessárias para maximizar seus ganhos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Analytics Avançados</CardTitle>
                <CardDescription className="text-slate-300">
                  Acompanhe cliques, conversões e comissões em tempo real com dashboards intuitivos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Comissões Elevadas</CardTitle>
                <CardDescription className="text-slate-300">
                  CPA até R$ 300 + RevShare até 45%. Pagamentos automáticos via PIX
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Tracking Seguro</CardTitle>
                <CardDescription className="text-slate-300">
                  Sistema de tracking robusto com proteção anti-fraude e atribuição precisa
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Building className="w-6 h-6 text-orange-400" />
                </div>
                <CardTitle className="text-white">Top Casas de Apostas</CardTitle>
                <CardDescription className="text-slate-300">
                  Parcerias exclusivas com as maiores casas do mercado brasileiro
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white">Setup Rápido</CardTitle>
                <CardDescription className="text-slate-300">
                  Gere seus links de afiliação em segundos e comece a ganhar imediatamente
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-red-400" />
                </div>
                <CardTitle className="text-white">Suporte 24/7</CardTitle>
                <CardDescription className="text-slate-300">
                  Equipe especializada para ajudar você a maximizar seus resultados
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Como Funciona
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Processo simples em 3 passos para começar a ganhar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Cadastre-se</h3>
              <p className="text-slate-300">
                Crie sua conta gratuita e tenha acesso ao painel de afiliado completo
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Gere Links</h3>
              <p className="text-slate-300">
                Escolha as casas de apostas e gere seus links de afiliação personalizados
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Receba Comissões</h3>
              <p className="text-slate-300">
                Promova seus links e receba comissões automáticas via PIX
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">15+</div>
              <div className="text-slate-300">Casas Parceiras</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">R$ 2M+</div>
              <div className="text-slate-300">Comissões Pagas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">5000+</div>
              <div className="text-slate-300">Afiliados Ativos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-slate-300">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para começar a ganhar?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de afiliados que já estão lucrando com as melhores casas de apostas do Brasil
          </p>
          
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4">
              Cadastrar Gratuitamente
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="container mx-auto text-center text-slate-400">
          <p>&copy; 2025 AfiliadosBet. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}