import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { ProjectStatus } from '../../types';
import { STATUS_LABELS } from '../../utils/constants';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, totalBudget: number, totalSpent: number, monthlyAllocation: number, status: ProjectStatus) => void;
  initialData?: {
    name: string;
    totalBudget: number;
    totalSpent: number;
    monthlyAllocation: number;
    status: ProjectStatus;
  };
  title: string;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}) => {
  const [name, setName] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [totalSpent, setTotalSpent] = useState('');
  const [monthlyAllocation, setMonthlyAllocation] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('en-cours');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTotalBudget(initialData.totalBudget.toString());
      setTotalSpent(initialData.totalSpent.toString());
      setMonthlyAllocation(initialData.monthlyAllocation.toString());
      setStatus(initialData.status);
    } else {
      setName('');
      setTotalBudget('');
      setTotalSpent('0');
      setMonthlyAllocation('0');
      setStatus('en-cours');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim() && totalBudget) {
      const numTotalBudget = parseFloat(totalBudget.replace(',', '.').replace(/\s/g, '')) || 0;
      const numTotalSpent = parseFloat(totalSpent.replace(',', '.').replace(/\s/g, '')) || 0;
      const numMonthlyAllocation = parseFloat(monthlyAllocation.replace(',', '.').replace(/\s/g, '')) || 0;

      onSubmit(name.trim(), numTotalBudget, numTotalSpent, numMonthlyAllocation, status);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="Nom du projet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex: Rénovation cuisine, Vacances..."
          required
          fullWidth
        />

        <Input
          type="number"
          label="Budget total du projet (€)"
          value={totalBudget}
          onChange={(e) => setTotalBudget(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
          fullWidth
        />
        <p className="text-xs text-textLight -mt-2">
          Le budget total ne touche pas votre reste à vivre
        </p>

        <Input
          type="number"
          label={initialData ? "Total déjà dépensé (€)" : "Total déjà alloué (€)"}
          value={totalSpent}
          onChange={(e) => setTotalSpent(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
          fullWidth
        />
        <p className="text-xs text-textLight -mt-2">
          {initialData ? "Cumulé sur tous les mois précédents" : "Montant déjà alloué pour ce projet"}
        </p>

        <Input
          type="number"
          label="Allocation mensuelle (€)"
          value={monthlyAllocation}
          onChange={(e) => setMonthlyAllocation(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
          fullWidth
        />
        <p className="text-xs text-textLight -mt-2">
          Montant prélevé sur le reste à vivre ce mois
        </p>

        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Statut
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            className="w-full px-4 py-2.5 min-h-[44px] border border-gray-300 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          >
            <option value="en-cours">{STATUS_LABELS['en-cours']}</option>
            <option value="en-pause">{STATUS_LABELS['en-pause']}</option>
            <option value="termine">{STATUS_LABELS['termine']}</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" fullWidth>
            {initialData ? 'Enregistrer' : 'Créer le projet'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>
            Annuler
          </Button>
        </div>
      </form>
    </Modal>
  );
};
