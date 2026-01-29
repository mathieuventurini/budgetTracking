/**
 * Formate un nombre en devise française (€)
 * Exemple: 1234.56 -> "1 234,56 €"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formate un mois au format "Janvier 2026" avec majuscule
 */
export const formatMonth = (monthString: string): string => {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);

  const formatted = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(date);

  // Mettre la première lettre en majuscule
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

/**
 * Formate un mois court au format "Jan 2026" avec majuscule
 */
export const formatMonthShort = (monthString: string): string => {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);

  const formatted = new Intl.DateTimeFormat('fr-FR', {
    month: 'short',
    year: 'numeric',
  }).format(date);

  // Mettre la première lettre en majuscule
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

/**
 * Obtient le mois actuel au format YYYY-MM
 * Le projet démarre en février 2026
 * Le mois suivant se débloque à partir du 26 de chaque mois (jour de paye)
 */
export const getCurrentMonth = (): string => {
  const projectStart = '2026-02';
  const now = new Date();
  const dayOfMonth = now.getDate();

  let year = now.getFullYear();
  let month = now.getMonth() + 1; // getMonth() retourne 0-11

  // Si on est au 26 ou après, on débloque le mois suivant
  if (dayOfMonth >= 26) {
    month += 1;
    // Si on dépasse décembre, passer à janvier de l'année suivante
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  const currentMonth = `${year}-${String(month).padStart(2, '0')}`;

  // Ne jamais retourner un mois avant février 2026
  return currentMonth >= projectStart ? currentMonth : projectStart;
};

/**
 * Génère les N derniers mois (incluant le mois actuel)
 * Ne retourne jamais des mois avant février 2026 (démarrage du projet avec la paye de fin janvier)
 */
export const getLastNMonths = (n: number): string[] => {
  const months: string[] = [];
  const projectStart = '2026-02';
  const currentMonth = getCurrentMonth();

  // Partir du mois actuel et remonter
  const [currentYear, currentMonthNum] = currentMonth.split('-').map(Number);
  const current = new Date(currentYear, currentMonthNum - 1, 1);

  for (let i = 0; i < n; i++) {
    const date = new Date(current.getFullYear(), current.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const monthStr = `${year}-${month}`;

    // Ne pas aller avant février 2026
    if (monthStr >= projectStart) {
      months.push(monthStr);
    } else {
      break;
    }
  }

  return months;
};

/**
 * Formate une date au format français (JJ/MM/AAAA)
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR').format(date);
};

/**
 * Parse un montant saisi par l'utilisateur (gère les virgules et espaces)
 */
export const parseAmount = (value: string): number => {
  const cleaned = value.replace(/\s/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};
