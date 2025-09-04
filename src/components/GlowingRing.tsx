import { useEffect, useRef } from "react";

const GlowingRing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    let rotation = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 80;
      const thickness = 30;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // Create gradient
      const gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
      gradient.addColorStop(0, "#8b5cf6");  // Purple
      gradient.addColorStop(0.5, "#06b6d4"); // Cyan
      gradient.addColorStop(1, "#ec4899");  // Pink

      // Draw ring
      ctx.strokeStyle = gradient;
      ctx.lineWidth = thickness;
      ctx.shadowBlur = 40;
      ctx.shadowColor = "#a855f7";
      
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Add glow effect
      ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
      ctx.lineWidth = thickness + 20;
      ctx.shadowBlur = 60;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      rotation += 0.01;
      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-[300px] h-[300px] animate-float"
      />
      <div className="absolute inset-0 bg-gradient-glow blur-3xl opacity-50" />
    </div>
  );
};

export default GlowingRing;