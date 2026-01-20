interface AuroraGlowProps {
  children: React.ReactNode;
  className?: string;
  float?: boolean;
}

export default function AuroraGlow({ children, className = '', float = false }: AuroraGlowProps) {
  return (
    <div className={`relative inline-block ${float ? 'animate-aurora-float' : ''} ${className}`}>
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 via-cyan-300/20 to-blue-500/30 rounded-xl blur-md" />
      <style>{`
        @keyframes aurora-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-aurora-float {
          animation: aurora-float 3s ease-in-out infinite;
        }
      `}</style>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
