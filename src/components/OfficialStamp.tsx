import React from 'react';

interface OfficialStampProps {
  className?: string;
  stampUrl?: string;
}

export const OfficialStamp: React.FC<OfficialStampProps> = ({ className = "w-28 h-28", stampUrl }) => {
  const [imgError, setImgError] = React.useState(false);

  if (stampUrl && !imgError) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <img
          src={stampUrl}
          alt="Official Stamp"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain rounded-full -rotate-6 brightness-105 contrast-125"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>
    );
  }

  // Vector SVG Stamp matching the circular seal in official receipt
  return (
    <div className={`relative flex items-center justify-center select-none transform -rotate-6 ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full text-[#0B3B60]">
        {/* Outer Ring */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="5" />
        <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="76" fill="none" stroke="currentColor" strokeWidth="1.2" />

        {/* Outer Top Curved Text Path */}
        <path id="stampTextTop" fill="none" d="M 28,100 A 72,72 0 0,1 172,100" />
        <text className="text-[11.5px] font-bold fill-[#0B3B60] tracking-wider">
          <textPath href="#stampTextTop" startOffset="50%" textAnchor="middle">
            ⴰⵙⵉⵔⴰ ⵏ ⵜⵓⵙⵏⴰ ⵜⴰⵎⴰⵣⵉⵖⵜ
          </textPath>
        </text>

        {/* Outer Bottom Curved Text Path */}
        <path id="stampTextBottom" fill="none" d="M 172,100 A 72,72 0 0,1 28,100" />
        <text className="text-[13.5px] font-extrabold fill-[#0B3B60]">
          <textPath href="#stampTextBottom" startOffset="50%" textAnchor="middle">
            نادي الثقافة الأمازيغية
          </textPath>
        </text>

        {/* Inner Content Lines */}
        <text x="100" y="68" textAnchor="middle" className="text-[13px] font-bold fill-[#0B3B60]">من أجل</text>
        <text x="100" y="90" textAnchor="middle" className="text-[15px] font-extrabold fill-[#0B3B60]">ثقافة أمازيغية</text>
        <text x="100" y="112" textAnchor="middle" className="text-[15px] font-extrabold fill-[#0B3B60]">عالمة</text>

        {/* Box for ESEF-B */}
        <rect x="58" y="126" width="84" height="22" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <text x="100" y="142" textAnchor="middle" className="text-[13px] font-mono font-black fill-[#0B3B60]">ESEF-B</text>
      </svg>
    </div>
  );
};
