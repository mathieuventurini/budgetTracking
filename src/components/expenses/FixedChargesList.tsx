import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FixedChargeItem } from './FixedChargeItem';
import { useBudget } from '../../contexts/BudgetContext';
import { formatCurrency } from '../../utils/formatters';

export const FixedChargesList: React.FC = () => {
  const { monthlyData, addFixedCharge, updateFixedCharge, deleteFixedCharge } = useBudget();
  const [isAdding, setIsAdding] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const handleAdd = () => {
    if (newDescription.trim() && newAmount) {
      const numAmount = parseFloat(newAmount.replace(',', '.').replace(/\s/g, '')) || 0;
      addFixedCharge(newDescription.trim(), numAmount);
      setNewDescription('');
      setNewAmount('');
      setIsAdding(false);
    }
  };

  if (!monthlyData) return null;

  const total = monthlyData.fixedCharges.reduce((sum, charge) => sum + charge.amount, 0);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-warning/20 to-orange-200/30 rounded-xl shadow-sm">
            <FileText className="text-warning" size={24} />
          </div>
          <h2 className="text-xl font-bold text-text">Charges fixes</h2>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="group relative p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="Ajouter une charge fixe"
        >
          <Plus size={24} className="transition-transform duration-300 group-hover:rotate-90" />
        </button>
      </div>

      <div className="space-y-2">
        {isAdding && (
          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border-2 border-primary">
            <Input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description (ex: Loyer, Électricité...)"
              className="flex-1"
            />
            <Input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="Montant"
              step="0.01"
              min="0"
              className="w-32"
            />
            <Button variant="success" size="sm" onClick={handleAdd}>
              Ajouter
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsAdding(false);
                setNewDescription('');
                setNewAmount('');
              }}
            >
              Annuler
            </Button>
          </div>
        )}

        {monthlyData.fixedCharges.length === 0 ? (
          <div className="text-center py-8 text-textLight">
            <FileText size={48} className="mx-auto mb-2 opacity-20" />
            <p>Aucune charge fixe pour le moment</p>
          </div>
        ) : (
          monthlyData.fixedCharges.map((charge) => (
            <FixedChargeItem
              key={charge.id}
              id={charge.id}
              description={charge.description}
              amount={charge.amount}
              onUpdate={updateFixedCharge}
              onDelete={deleteFixedCharge}
            />
          ))
        )}
      </div>

      {monthlyData.fixedCharges.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-text">Total charges fixes</span>
            <span className="text-2xl font-bold text-warning">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};
