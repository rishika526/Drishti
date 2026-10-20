import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore';

export function RadarPPI() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [maxRangeMeters, setMaxRangeMeters] = useState(2000);

  const {
    contacts,
    selectedContactId,
    selectContact,
    radarSweepAngle,
    sensorState,
    radarJammingSectors,
  } = useSimulationStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = cx - 12;

    // Clear background with dark CRT phosphor
    ctx.fillStyle = '#03080e';
    ctx.fillRect(0, 0, width, height);

    // If dual-degraded or total blackout
    if (sensorState === 'dual-degraded') {
      ctx.fillStyle = 'rgba(255, 51, 68, 0.15)';
      ctx.fillRect(0, 0, width, height);
      // Static noise
      const imgData = ctx.getImageData(0, 0, width, height);
      for (let i = 0; i < imgData.data.length; i += 4) {
        if (Math.random() > 0.85) {
          const noise = Math.random() * 80;
          imgData.data[i] = noise;
          imgData.data[i + 1] = noise + 40;
          imgData.data[i + 2] = noise;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      ctx.fillStyle = '#ff3344';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('RADAR BLACKOUT - EW OFFLINE', cx, cy);
      return;
    }

    // Draw range rings
    const ringSteps = [0.25, 0.5, 0.75, 1.0];
    ctx.strokeStyle = 'rgba(0, 255, 156, 0.22)';
    ctx.lineWidth = 1;

    ringSteps.forEach((step) => {
      const r = maxRadius * step;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Range labels
      ctx.fillStyle = 'rgba(0, 255, 156, 0.5)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${Math.round(maxRangeMeters * step)}m`, cx + 4, cy - r + 10);
    });

    // 1200m Engagement Envelope Ring (Amber dashed)
    const wezRatio = 1200 / maxRangeMeters;
    if (wezRatio <= 1.0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 176, 0, 0.6)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius * wezRatio, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ffb000';
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillText('WEZ (1200m)', cx + 4, cy - maxRadius * wezRatio - 3);
      ctx.restore();
    }

    // Crosshairs & Bearing ticks
    ctx.strokeStyle = 'rgba(0, 255, 156, 0.25)';
    ctx.beginPath();
    ctx.moveTo(cx, cy - maxRadius);
    ctx.lineTo(cx, cy + maxRadius);
    ctx.moveTo(cx - maxRadius, cy);
    ctx.lineTo(cx + maxRadius, cy);
    ctx.stroke();

    // Cardinal bearings text
    ctx.fillStyle = 'rgba(0, 255, 156, 0.8)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('000° (N)', cx, 16);
    ctx.fillText('180° (S)', cx, height - 6);
    ctx.fillText('090° (E)', width - 24, cy + 4);
    ctx.fillText('270° (W)', 24, cy + 4);

    // Active Jamming Sectors noise wedges
    if (sensorState === 'jammed') {
      radarJammingSectors.forEach((sec) => {
        const startRad = ((sec.startAngle - 90) * Math.PI) / 180;
        const endRad = ((sec.endAngle - 90) * Math.PI) / 180;

        ctx.save();
        ctx.fillStyle = 'rgba(255, 176, 0, 0.18)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxRadius, startRad, endRad);
        ctx.closePath();
        ctx.fill();

        // Strobe rays inside wedge
        for (let a = sec.startAngle; a <= sec.endAngle; a += 3) {
          const rad = ((a - 90) * Math.PI) / 180;
          ctx.strokeStyle = `rgba(255, 200, 50, ${Math.random() * 0.4})`;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(rad) * maxRadius, cy + Math.sin(rad) * maxRadius);
          ctx.stroke();
        }
        ctx.restore();
      });
    }

    // Phosphor sweep trail wedge
    const sweepRad = ((radarSweepAngle - 90) * Math.PI) / 180;
    const trailRad = 0.5; // ~28 degrees of phosphor trail
    const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, maxRadius);
    grad.addColorStop(0, 'rgba(0, 255, 156, 0.05)');
    grad.addColorStop(1, 'rgba(0, 255, 156, 0.25)');

    ctx.save();
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, maxRadius, sweepRad - trailRad, sweepRad);
    ctx.closePath();
    ctx.fill();

    // Leading sweep line
    ctx.strokeStyle = '#00ff9c';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + Math.cos(sweepRad) * maxRadius,
      cy + Math.sin(sweepRad) * maxRadius
    );
    ctx.stroke();
    ctx.restore();

    // Render Contact Blips
    contacts.forEach((c) => {
      if (c.status === 'escaped') return;
      if (!c.isRadarVisible && c.radarBlipAlpha <= 0.01) return;

      const r = (c.distanceToBase / maxRangeMeters) * maxRadius;
      if (r > maxRadius + 5) return; // out of scope bounds

      const rad = ((c.bearing - 90) * Math.PI) / 180;
      const bx = cx + Math.cos(rad) * r;
      const by = cy + Math.sin(rad) * r;

      const isSelected = c.id === selectedContactId;
      const alpha = Math.max(0.1, c.radarBlipAlpha);

      // Weak return for birds
      const isBird = c.type === 'bird';
      const blipSize = isBird ? 2 : c.type === 'swarm' ? 3.5 : 4.5;

      ctx.save();
      // Blip color
      let blipColor = `rgba(0, 255, 156, ${alpha})`;
      if (c.iff === 'VALID') {
        blipColor = `rgba(30, 144, 255, ${alpha})`;
      } else if (c.responseAction === 'hard_kill') {
        blipColor = `rgba(255, 51, 68, ${alpha})`;
      }

      ctx.fillStyle = blipColor;
      ctx.shadowColor = blipColor;
      ctx.shadowBlur = isSelected ? 12 : 6;

      ctx.beginPath();
      ctx.arc(bx, by, blipSize, 0, Math.PI * 2);
      ctx.fill();

      // Heading velocity vector line
      if (c.speed > 5) {
        const headRad = ((c.heading - 90) * Math.PI) / 180;
        ctx.strokeStyle = blipColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + Math.cos(headRad) * 12, by + Math.sin(headRad) * 12);
        ctx.stroke();
      }

      // Selection reticle box
      if (isSelected) {
        ctx.strokeStyle = '#00ff9c';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bx - 8, by - 8, 16, 16);

        ctx.fillStyle = '#00ff9c';
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(c.callsign, bx + 10, by - 4);
      }
      ctx.restore();
    });

    // Center base marker
    ctx.fillStyle = '#00ff9c';
    ctx.fillRect(cx - 3, cy - 3, 6, 6);
  }, [contacts, selectedContactId, radarSweepAngle, sensorState, radarJammingSectors, maxRangeMeters]);

  // Handle canvas click to select contact nearest to mouse click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxRadius = cx - 12;

    let closestContact: any = null;
    let minD = 25; // 25px click tolerance

    contacts.forEach((c) => {
      const r = (c.distanceToBase / maxRangeMeters) * maxRadius;
      const rad = ((c.bearing - 90) * Math.PI) / 180;
      const bx = cx + Math.cos(rad) * r;
      const by = cy + Math.sin(rad) * r;
      const d = Math.hypot(bx - x, by - y);
      if (d < minD) {
        minD = d;
        closestContact = c;
      }
    });

    if (closestContact) {
      selectContact(closestContact.id);
    }
  };

  return (
    <div className="relative flex flex-col items-center bg-hud-panel border border-hud-border rounded p-2 shadow-hud-green">
      <div className="w-full flex items-center justify-between text-xs font-mono text-hud-green mb-1 px-1">
        <span className="flex items-center gap-1.5 font-bold tracking-wider">
          <span className="w-2 h-2 rounded-full bg-hud-green animate-pulse" />
          RADAR PPI SCOPE
        </span>
        <div className="flex gap-1">
          {[1000, 2000, 3000].map((rng) => (
            <button
              key={rng}
              onClick={() => setMaxRangeMeters(rng)}
              className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors ${
                maxRangeMeters === rng
                  ? 'border-hud-green bg-hud-green/20 text-hud-green font-bold'
                  : 'border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {rng / 1000}km
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          onClick={handleCanvasClick}
          className="rounded-full border border-hud-green/40 shadow-inner cursor-crosshair bg-hud-bg"
        />

        {/* Status text badge at bottom */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono px-2 py-0.5 rounded bg-black/70 border border-hud-border text-slate-300">
          SWEEP: {Math.round(radarSweepAngle)}° |{' '}
          {sensorState === 'nominal'
            ? 'NOMINAL'
            : sensorState.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
