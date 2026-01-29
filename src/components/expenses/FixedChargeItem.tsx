import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { formatCurrency } from '../../utils/formatters';

interface FixedChargeItemProps {
  id: string;
  description: string;
  amount: number;
  onUpdate: (id: string, description: string, amount: number) => void;
  onDelete: (id: string) => void;
}

export const FixedChargeItem: React.FC<FixedChargeItemProps> = ({
  id,
  description,
  amount,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editDescription, setEditDescription] = useState(description);
  const [editAmount, setEditAmount] = useState(amount.toString());

  const handleSave = () => {
    const numAmount = parseFloat(editAmount.replace(',', '.').replace(/\s/g, '')) || 0;
    onUpdate(id, editDescription, numAmount);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditDescription(description);
    setEditAmount(amount.toString());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <Input
          type="text"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Description"
          className="flex-1"
        />
        <Input
          type="number"
          value={editAmount}
          onChange={(e) => setEditAmount(e.target.value)}
          placeholder="Montant"
          step="0.01"
          min="0"
          className="w-32"
        />
        <Button
          variant="success"
          size="sm"
          onClick={handleSave}
          className="!px-3"
        >
          <Check size={18} />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCancel}
          className="!px-3"
        >
          <X size={18} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      <div className="flex-1">
        <p className="font-medium text-text">{description}</p>
        <p className="text-sm text-textLight">{formatCurrency(amount)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="!px-3"
        >
          <Pencil size={16} />
        </Button>
        <button
          onClick={() => setIsDeleteDialogOpen(true)}
          className="p-2 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
          title="Supprimer"
        >
          <X size={16} />
        </button>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => onDelete(id)}
        title="Supprimer cette charge fixe ?"
        message={`Êtes-vous sûr de vouloir supprimer "${description}" (${formatCurrency(amount)}) ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
};
