import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { MonthlyData, Salary } from '../types';

// Collection name for shared budget data
const BUDGET_COLLECTION = 'budgetData';
const SHARED_ACCOUNT_ID = 'mathieu-assia-account'; // Shared account ID

/**
 * Creates default monthly data structure
 */
const createDefaultMonthData = (month: string): MonthlyData => {
  const now = new Date().toISOString();
  return {
    id: `${month}-${Date.now()}`,
    month,
    salaries: [
      { id: `salary-1-${Date.now()}`, name: 'Salaire Mathieu', amount: 0 },
      { id: `salary-2-${Date.now()}`, name: 'Salaire Assia', amount: 0 },
    ] as Salary[],
    fixedCharges: [],
    exceptionalExpenses: [],
    projects: [],
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Gets the document reference for a specific month
 */
const getMonthDocRef = (month: string) => {
  return doc(db, BUDGET_COLLECTION, SHARED_ACCOUNT_ID, 'months', month);
};

/**
 * Loads data for a specific month from Firestore
 */
export const loadMonthDataFromFirestore = async (
  month: string
): Promise<MonthlyData> => {
  try {
    const docRef = getMonthDocRef(month);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        // Convert Firestore Timestamps to ISO strings if needed
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt,
      } as MonthlyData;
    } else {
      // Create default data for new month
      const defaultData = createDefaultMonthData(month);
      await saveMonthDataToFirestore(month, defaultData);
      return defaultData;
    }
  } catch (error) {
    console.error('Error loading month data from Firestore:', error);
    // Fallback to default data
    return createDefaultMonthData(month);
  }
};

/**
 * Saves monthly data to Firestore
 */
export const saveMonthDataToFirestore = async (
  month: string,
  data: MonthlyData
): Promise<void> => {
  try {
    const docRef = getMonthDocRef(month);
    const dataToSave = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (error) {
    console.error('Error saving month data to Firestore:', error);
    throw error;
  }
};

/**
 * Gets historical data for the last N months
 */
export const getHistoryFromFirestore = async (
  months: number = 6
): Promise<MonthlyData[]> => {
  try {
    const monthsCollection = collection(
      db,
      BUDGET_COLLECTION,
      SHARED_ACCOUNT_ID,
      'months'
    );

    const q = query(
      monthsCollection,
      orderBy('month', 'desc'),
      limit(months)
    );

    const querySnapshot = await getDocs(q);
    const history: MonthlyData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      history.push({
        ...data,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt,
      } as MonthlyData);
    });

    return history;
  } catch (error) {
    console.error('Error getting history from Firestore:', error);
    return [];
  }
};

/**
 * Migrates data from localStorage to Firestore (one-time migration)
 */
export const migrateFromLocalStorage = async (): Promise<void> => {
  try {
    const keysToMigrate: string[] = [];

    // Find all budget-app-data keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('budget-app-data-')) {
        keysToMigrate.push(key);
      }
    }

    console.log(`Found ${keysToMigrate.length} months to migrate`);

    // Migrate each month
    for (const key of keysToMigrate) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const monthData = JSON.parse(data) as MonthlyData;
          const month = key.replace('budget-app-data-', '');
          await saveMonthDataToFirestore(month, monthData);
          console.log(`Migrated ${month} successfully`);
        } catch (parseError) {
          console.error(`Error parsing data for ${key}:`, parseError);
        }
      }
    }

    console.log('Migration completed!');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
};
