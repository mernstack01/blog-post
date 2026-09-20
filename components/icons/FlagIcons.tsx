import React from 'react';

export function UzbekFlagIcon({ className = "w-5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 250"
      className={`${className} rounded-xs shadow-2xs shrink-0 overflow-hidden inline-block align-middle`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="O'zbekiston bayrog'i"
    >
      {/* Moviy tasmalar */}
      <rect width="500" height="80" fill="#0099B5" />
      {/* Qizil chiziq 1 */}
      <rect y="80" width="500" height="5" fill="#CE1126" />
      {/* Oq tasma */}
      <rect y="85" width="500" height="80" fill="#FFFFFF" />
      {/* Qizil chiziq 2 */}
      <rect y="165" width="500" height="5" fill="#CE1126" />
      {/* Yashil tasma */}
      <rect y="170" width="500" height="80" fill="#1EB53A" />
      {/* Yarim oy */}
      <circle cx="70" cy="40" r="30" fill="#FFFFFF" />
      <circle cx="78" cy="40" r="26" fill="#0099B5" />
      {/* Yulduzlar */}
      <g fill="#FFFFFF">
        <circle cx="120" cy="20" r="4.5" />
        <circle cx="138" cy="20" r="4.5" />
        <circle cx="156" cy="20" r="4.5" />
        <circle cx="102" cy="38" r="4.5" />
        <circle cx="120" cy="38" r="4.5" />
        <circle cx="138" cy="38" r="4.5" />
        <circle cx="156" cy="38" r="4.5" />
        <circle cx="84" cy="56" r="4.5" />
        <circle cx="102" cy="56" r="4.5" />
        <circle cx="120" cy="56" r="4.5" />
        <circle cx="138" cy="56" r="4.5" />
        <circle cx="156" cy="56" r="4.5" />
      </g>
    </svg>
  );
}

export function RussianFlagIcon({ className = "w-5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 250"
      className={`${className} rounded-xs shadow-2xs shrink-0 overflow-hidden inline-block align-middle`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Rossiya bayrog'i"
    >
      {/* Oq tasma */}
      <rect width="500" height="83.33" fill="#FFFFFF" />
      {/* Moviy tasma */}
      <rect y="83.33" width="500" height="83.33" fill="#0039A6" />
      {/* Qizil tasma */}
      <rect y="166.66" width="500" height="83.34" fill="#D52B1E" />
    </svg>
  );
}
