// Pladsholder-illustration til katalogets stykker.
//
// Demoen har ingen produktfotos, så hvert stykke tegnes som en silhuet efter
// sin kategori i en lerfarve udledt af `hue`. Når der findes rigtige fotos,
// udskiftes denne komponent med et <img>.

import type { PieceCategory } from "./data";

const SHAPES: Record<PieceCategory, string> = {
  // Skål: lige rand foroven, buet krop ned mod foden.
  Skåle: "M30 84 C30 84 40 168 100 168 C160 168 170 84 170 84 Z",
  // Vase: smal hals, udbulende krop.
  Vaser:
    "M86 30 C86 30 84 58 76 76 C56 96 46 126 52 146 C58 166 78 174 100 174 C122 174 142 166 148 146 C154 126 144 96 124 76 C116 58 114 30 114 30 Z",
  // Krus: cylinder med afrundet bund (hanken tegnes separat).
  Krus: "M62 50 H138 V148 C138 161 128 170 115 170 H85 C72 170 62 161 62 148 Z",
  // Fad: set en anelse fra siden, altså en ellipse.
  Fade: "M100 58 C144 58 178 82 178 110 C178 138 144 162 100 162 C56 162 22 138 22 110 C22 82 56 58 100 58 Z",
  // Unika: asymmetrisk, håndbygget form.
  Unika:
    "M90 26 C90 26 82 52 70 70 C50 98 44 138 54 158 C64 178 84 183 102 181 C124 179 146 167 150 145 C154 119 138 95 122 73 C112 55 110 26 110 26 Z",
};

interface PieceImageProps {
  kategori: PieceCategory;
  hue: number;
  className?: string;
}

export default function PieceImage({ kategori, hue, className }: PieceImageProps) {
  const light = `hsl(${hue} 46% 76%)`;
  const mid = `hsl(${hue} 40% 60%)`;
  const dark = `hsl(${hue} 38% 42%)`;
  const gradientId = `clay-${kategori}-${hue}`;

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={`Illustration af ${kategori.toLowerCase().replace(/e$/, "")}`}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="55%" stopColor={mid} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
      </defs>

      {/* Skygge under stykket, så det står på en flade. */}
      <ellipse cx="100" cy="176" rx="58" ry="7" fill={dark} opacity="0.14" />

      <path d={SHAPES[kategori]} fill={`url(#${gradientId})`} />

      {/* Hank til kruset. */}
      {kategori === "Krus" && (
        <path
          d="M138 76 C170 76 170 130 138 130"
          fill="none"
          stroke={mid}
          strokeWidth="13"
          strokeLinecap="round"
        />
      )}

      {/* Randen: en tynd lysning, der antyder glasurens kant. */}
      {kategori === "Skåle" && <path d="M30 84 H170" stroke={light} strokeWidth="5" strokeLinecap="round" />}
      {kategori === "Fade" && (
        <ellipse cx="100" cy="110" rx="56" ry="34" fill="none" stroke={light} strokeWidth="3" opacity="0.55" />
      )}

      {/* Blødt højlys i venstre side. */}
      <path
        d={SHAPES[kategori]}
        fill="none"
        stroke={light}
        strokeWidth="2"
        opacity="0.4"
        strokeDasharray="60 400"
        strokeDashoffset="16"
      />
    </svg>
  );
}
