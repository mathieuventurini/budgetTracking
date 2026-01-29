import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { MonthlyData, Project } from '../types';
import { STORAGE_KEY_PREFIX, MONTHS_TO_KEEP } from '../utils/constants';
import { getCurrentMonth, getLastNMonths } from '../utils/formatters';

/**
 * Obtient la clé de stockage pour un mois donné
 */
const getStorageKey = (month: string): string => {
  return `${STORAGE_KEY_PREFIX}-${month}`;
};

/**
 * Obtient le mois précédent au format YYYY-MM
 */
const getPreviousMonth = (month: string): string => {
  const [year, monthNum] = month.split('-').map(Number);
  const date = new Date(year, monthNum - 1, 1);
  date.setMonth(date.getMonth() - 1);

  const prevYear = date.getFullYear();
  const prevMonth = String(date.getMonth() + 1).padStart(2, '0');
  return `${prevYear}-${prevMonth}`;
};

/**
 * Crée des données mensuelles vides pour un mois donné
 * Si le mois précédent existe, copie ses projets
 */
const createEmptyMonthlyData = (month: string, loadPreviousMonthData?: (month: string) => MonthlyData | null): MonthlyData => {
  const now = new Date().toISOString();

  // Tente de récupérer les projets du mois précédent
  let projectsFromPreviousMonth: Project[] = [];
  if (loadPreviousMonthData) {
    const previousMonth = getPreviousMonth(month);
    const previousData = loadPreviousMonthData(previousMonth);
    if (previousData && previousData.projects.length > 0) {
      // Copie les projets mais réinitialise l'allocation mensuelle à 0
      projectsFromPreviousMonth = previousData.projects.map(project => ({
        ...project,
        monthlyAllocation: 0,
      }));
    }
  }

  return {
    id: uuidv4(),
    month,
    salaries: [
      { id: uuidv4(), name: 'Salaire Mathieu', amount: 0 },
      { id: uuidv4(), name: 'Salaire Assia', amount: 0 },
    ],
    fixedCharges: [],
    exceptionalExpenses: [],
    projects: projectsFromPreviousMonth,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Hook personnalisé pour gérer le localStorage du budget
 */
export const useLocalStorage = () => {
  const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonth());
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);

  /**
   * Charge les données d'un mois depuis le localStorage sans dépendance
   * Utilisé pour charger le mois précédent lors de la création de nouvelles données
   */
  const loadMonthDataRaw = (month: string): MonthlyData | null => {
    const key = getStorageKey(month);
    const stored = localStorage.getItem(key);

    if (stored) {
      try {
        return JSON.parse(stored) as MonthlyData;
      } catch (error) {
        console.error('Erreur lors du parsing des données:', error);
      }
    }

    return null;
  };

  /**
   * Charge les données d'un mois depuis le localStorage
   */
  const loadMonthData = (month: string): MonthlyData => {
    const key = getStorageKey(month);
    const stored = localStorage.getItem(key);

    if (stored) {
      try {
        return JSON.parse(stored) as MonthlyData;
      } catch (error) {
        console.error('Erreur lors du parsing des données:', error);
      }
    }

    return createEmptyMonthlyData(month, loadMonthDataRaw);
  };

  /**
   * Sauvegarde les données d'un mois dans le localStorage
   */
  const saveMonthData = (data: MonthlyData) => {
    const key = getStorageKey(data.month);
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(key, JSON.stringify(updatedData));
    setMonthlyData(updatedData);
  };

  /**
   * Récupère l'historique des N derniers mois
   */
  const getHistory = (n: number = MONTHS_TO_KEEP): MonthlyData[] => {
    const months = getLastNMonths(n);
    return months.map(month => loadMonthData(month));
  };

  /**
   * Change de mois et charge les données correspondantes
   */
  const changeMonth = (month: string) => {
    setCurrentMonth(month);
  };

  /**
   * Nettoie les données des mois trop anciens
   */
  const cleanOldData = () => {
    const monthsToKeep = getLastNMonths(MONTHS_TO_KEEP);
    const allKeys = Object.keys(localStorage);

    allKeys.forEach(key => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        const month = key.replace(`${STORAGE_KEY_PREFIX}-`, '');
        if (!monthsToKeep.includes(month)) {
          localStorage.removeItem(key);
        }
      }
    });
  };

  // Charge les données du mois actuel au démarrage et quand on change de mois
  useEffect(() => {
    const data = loadMonthData(currentMonth);
    setMonthlyData(data);
  }, [currentMonth]);

  // Nettoie les données anciennes au démarrage
  useEffect(() => {
    cleanOldData();
  }, []);

  return {
    currentMonth,
    monthlyData,
    saveMonthData,
    changeMonth,
    getHistory,
    loadMonthData,
  };
};
