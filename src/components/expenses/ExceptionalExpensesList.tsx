import React, { useState } from 'react';
import { ShoppingBag, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useBudget } from '../../contexts/BudgetContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ExceptionalExpensesList: React.FC = () => {
  const { monthlyData, addExceptionalExpense, updateExceptionalExpense, deleteExceptionalExpense } = useBudget();
  const [isAdding, setIsAdding] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<{ id: string; description: string; amount: number } | null>(null);

  const handleAdd = () => {
    if (newDescription.trim() && newAmount && newDate) {
      const numAmount = parseFloat(newAmount.replace(',', '.').replace(/\s/g, '')) || 0;
      addExceptionalExpense(newDescription.trim(), numAmount, newDate);
      setNewDescription('');
      setNewAmount('');
      setNewDate(new Date().toISOString().split('T')[0]);
      setIsAdding(false);
    }
  };

  const startEdit = (id: string, description: string, amount: number, date: string) => {
    setEditingId(id);
    setEditDescription(description);
    setEditAmount(amount.toString());
    setEditDate(date);
  };

  const handleSave = (id: string) => {
    if (editDescription.trim() && editAmount && editDate) {
      const numAmount = parseFloat(editAmount.replace(',', '.').replace(/\s/g, '')) || 0;
      updateExceptionalExpense(id, editDescription.trim(), numAmount, editDate);
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditDescription('');
    setEditAmount('');
    setEditDate('');
  };

  if (!monthlyData) return null;

  const sortedExpenses = [...monthlyData.exceptionalExpenses].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const total = monthlyData.exceptionalExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-danger/20 to-rose-200/30 rounded-xl shadow-sm">
            <ShoppingBag className="text-danger" size={24} />
          </div>
          <h2 className="text-xl font-bold text-text">Dépenses</h2>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="group relative p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="Ajouter une dépense"
        >
          <Plus size={24} className="transition-transform duration-300 group-hover:rotate-90" />
        </button>
      </div>

      <div className="space-y-2">
        {isAdding && (
          <div className="p-3 bg-primary/5 rounded-lg border-2 border-primary space-y-2">
            <Input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description"
              fullWidth
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="Montant"
                step="0.01"
                min="0"
                className="flex-1"
              />
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="success" size="sm" onClick={handleAdd} fullWidth>
                Ajouter
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewDescription('');
                  setNewAmount('');
                  setNewDate(new Date().toISOString().split('T')[0]);
                }}
                fullWidth
              >
                Annuler
              </Button>
            </div>
          </div>
        )}

        {sortedExpenses.length === 0 ? (
          <div className="text-center py-8 text-textLight">
            <ShoppingBag size={48} className="mx-auto mb-2 opacity-20" />
            <p>Aucune dépense pour le moment</p>
          </div>
        ) : (
          sortedExpenses.map((expense) => (
            <div key={expense.id}>
              {editingId === expense.id ? (
                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <Input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                    fullWidth
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      placeholder="Montant"
                      step="0.01"
                      min="0"
                      className="flex-1"
                    />
                    <Input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleSave(expense.id)}
                      className="flex-1"
                    >
                      <Check size={18} className="mr-1" />
                      Enregistrer
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCancel}
                      className="flex-1"
                    >
                      <X size={18} className="mr-1" />
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex-1">
                    <p className="font-medium text-text">{expense.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-textLight">{formatCurrency(expense.amount)}</p>
                      <span className="text-textLight">•</span>
                      <p className="text-sm text-textLight">{formatDate(expense.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => startEdit(expense.id, expense.description, expense.amount, expense.date)}
                      className="!px-3"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setExpenseToDelete({ id: expense.id, description: expense.description, amount: expense.amount });
                        setDeleteDialogOpen(true);
                      }}
                      className="!px-3"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setExpenseToDelete(null);
        }}
        onConfirm={() => {
          if (expenseToDelete) {
            deleteExceptionalExpense(expenseToDelete.id);
          }
        }}
        title="Supprimer cette dépense ?"
        message={expenseToDelete ? `Êtes-vous sûr de vouloir supprimer "${expenseToDelete.description}" (${formatCurrency(expenseToDelete.amount)}) ?` : ''}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />

      {sortedExpenses.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-text">Total dépenses</span>
            <span className="text-2xl font-bold text-danger">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};
