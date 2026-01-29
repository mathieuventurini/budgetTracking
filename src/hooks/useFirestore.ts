import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { MonthlyData, Project } from '../types';
import { MONTHS_TO_KEEP } from '../utils/constants';
import { getCurrentMonth } from '../utils/formatters';
import {
  loadMonthDataFromFirestore,
  saveMonthDataToFirestore,
  getHistoryFromFirestore,
} from '../services/firestoreService';

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
const createEmptyMonthlyData = async (
  month: string,
  loadPreviousMonthData?: (month: string) => Promise<MonthlyData | null>
): Promise<MonthlyData> => {
  const now = new Date().toISOString();

  // Tente de récupérer les projets du mois précédent
  let projectsFromPreviousMonth: Project[] = [];
  if (loadPreviousMonthData) {
    const previousMonth = getPreviousMonth(month);
    const previousData = await loadPreviousMonthData(previousMonth);
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
 * Hook personnalisé pour gérer Firestore du budget (remplace useLocalStorage)
 */
export const useFirestore = () => {
  const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonth());
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charge les données d'un mois depuis Firestore
   */
  const loadMonthData = async (month: string): Promise<MonthlyData> => {
    try {
      return await loadMonthDataFromFirestore(month);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      // En cas d'erreur, retourne des données vides
      return await createEmptyMonthlyData(month);
    }
  };

  /**
   * Sauvegarde les données d'un mois dans Firestore
   */
  const saveMonthData = async (data: MonthlyData) => {
    try {
      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      await saveMonthDataToFirestore(data.month, updatedData);
      setMonthlyData(updatedData);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde des données');
    }
  };

  /**
   * Récupère l'historique des N derniers mois
   */
  const getHistory = async (n: number = MONTHS_TO_KEEP): Promise<MonthlyData[]> => {
    try {
      return await getHistoryFromFirestore(n);
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'historique:', err);
      return [];
    }
  };

  /**
   * Change de mois et charge les données correspondantes
   */
  const changeMonth = (month: string) => {
    setCurrentMonth(month);
  };

  // Charge les données du mois actuel au démarrage et quand on change de mois
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await loadMonthData(currentMonth);
        setMonthlyData(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentMonth]);

  return {
    currentMonth,
    monthlyData,
    saveMonthData,
    changeMonth,
    getHistory,
    loadMonthData,
    loading,
    error,
  };
};
