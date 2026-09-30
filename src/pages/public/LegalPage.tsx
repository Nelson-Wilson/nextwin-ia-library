import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, FileText } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const location = useLocation();

  let title = 'Termos de Uso';
  let type: 'privacy' | 'refund' | 'terms' = 'terms';

  if (location.pathname.includes('privacidade')) {
    title = 'Política de Privacidade';
    type = 'privacy';
  } else if (location.pathname.includes('reembolso')) {
    title = 'Política de Reembolso e Garantia';
    type = 'refund';
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      
      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-4 text-xs font-medium">
        <Link
          to="/politica-privacidade"
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            type === 'privacy' ? 'bg-brand text-white font-semibold' : 'text-muted hover:text-brand'
          }`}
        >
          Política de Privacidade
        </Link>
        <Link
          to="/politica-reembolso"
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            type === 'refund' ? 'bg-brand text-white font-semibold' : 'text-muted hover:text-brand'
          }`}
        >
          Política de Reembolso
        </Link>
        <Link
          to="/termos"
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            type === 'terms' ? 'bg-brand text-white font-semibold' : 'text-muted hover:text-brand'
          }`}
        >
          Termos de Uso
        </Link>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-ink ">{title}</h1>
        <p className="text-xs text-muted">Última atualização: Março de 2026</p>
      </div>

      <div className="prose prose-slate max-w-none text-muted text-sm leading-relaxed space-y-4">
        {type === 'privacy' && (
          <>
            <p>
              A <strong>NextWin AI Library</strong> tem o compromisso de proteger a privacidade e os dados pessoais de todos os clientes, visitantes e usuários de nossa plataforma.
            </p>
            <h3 className="text-lg font-bold text-ink pt-2">1. Coleta de Dados</h3>
            <p>
              Coletamos informações estritamente necessárias para a prestação de nossos serviços digitais, incluindo nome, endereço de e-mail e número de telefone/WhatsApp ao realizar downloads de materiais gratuitos ou pedidos.
            </p>
            <h3 className="text-lg font-bold text-ink pt-2">2. Pagamentos Seguros</h3>
            <p>
              Todos os pagamentos e transações financeiras são processados externamente por operadoras autorizadas, como o <strong>EscalePay</strong>. A NextWin AI Library não armazena nem tem acesso aos dados de cartões de crédito ou senhas bancárias dos clientes.
            </p>
            <h3 className="text-lg font-bold text-ink pt-2">3. Não Compartilhamento</h3>
            <p>
              Não comercializamos, alugamos ou transferimos seus dados pessoais para terceiros para fins de marketing sem o seu consentimento prévio.
            </p>
          </>
        )}

        {type === 'refund' && (
          <>
            <p>
              Garantimos a qualidade e seriedade de todo o nosso acervo digital. Nossa política de reembolso foi estruturada para que você tenha total segurança e confiança na sua decisão de compra.
            </p>
            <h3 className="text-lg font-bold text-ink pt-2">1. Garantia Incondicional de 7 Dias</h3>
            <p>
              Se por qualquer motivo você adquirir um produto digital na NextWin AI Library e julgar que o material não atendeu às suas expectativas, você tem até <strong>7 (sete) dias corridos</strong> após a compra para solicitar o reembolso integral do valor pago.
            </p>
            <h3 className="text-lg font-bold text-ink pt-2">2. Como Solicitar</h3>
            <p>
              Basta entrar em contato pelo e-mail <em>contato@nextwinlibrary.com</em> ou pelo nosso canal oficial de suporte no WhatsApp informando o número do pedido ou o e-mail utilizado na compra. O estorno é solicitado diretamente junto ao EscalePay sem burocracia.
            </p>
          </>
        )}

        {type === 'terms' && (
          <>
            <p>
              Ao navegar, acessar materiais gratuitos ou adquirir produtos digitais na <strong>NextWin AI Library</strong>, você concorda expressamente com os seguintes termos e condições:
            </p>
            <h3 className="text-lg font-bold text-ink pt-2">1. Propriedade Intelectual e Licença de Uso</h3>
            <p>
              Todos os ebooks, apostilas, códigos de prompts, templates e videoaulas são protegidos por leis de direitos autorais. A compra concede ao adquirente uma licença de uso pessoal e intransferível. É expressamente proibida a revenda, pirataria, rateio, distribuição pública ou reprodução não autorizada do acervo.
            </p>
            <h3 className="text-lg font-bold text-ink pt-2">2. Entrega do Produto Digital</h3>
            <p>
              Os materiais digitais são disponibilizados via download imediato ou envio de links de acesso logo após a notificação de pagamento confirmado emitida pelo EscalePay.
            </p>
          </>
        )}
      </div>

    </div>
  );
};
