// Le triangle de menuisier : le repère que l'on trace au crayon sur les pièces d'un meuble pour les remettre
// dans le bon ordre et le bon sens. C'est le seul signe graphique du site : la marque, le filtre actif,
// l'étape en cours.
export default function Triangle({ className, filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 20 18" width="20" height="18" aria-hidden="true" focusable="false">
      <path
        d="M10 1.6 18.6 16.4H1.4Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
