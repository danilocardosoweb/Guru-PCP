import Image from 'next/image';

const Header = () => {
  return (
    <header className="flex flex-col items-center justify-center py-6 mb-8 border-b border-gray-200">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
        Guru PCP
      </h1>
      <p className="text-gray-600 text-center max-w-2xl mb-4">
        Seu assistente virtual especializado em Planejamento e Controle da Produção
      </p>
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 mb-2">
        <Image 
          src="/avatar-pcp.png" 
          alt="Avatar do Guru PCP" 
          fill
          className="object-cover"
          priority
        />
      </div>
    </header>
  );
};

export default Header;
