function FeatureCard({ icon, title, description }) {
  try {
    return (
      <div className="feature-card group" data-name="feature-card" data-file="components/FeatureCard.js">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-all duration-300 border border-white/20">
            <div className={`icon-${icon} text-xl text-white`}></div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white mb-2 text-lg">{title}</h3>
            <p className="text-blue-100 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('FeatureCard component error:', error);
    return null;
  }
}
