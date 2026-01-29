import React, { useState } from 'react';
import { Pencil, Trash2, Pause, PlayCircle, CheckCircle, Check, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import type { Project, ProjectStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onUpdateAllocation: (id: string, newAllocation: number) => void;
  onUpdateStatus: (id: string, status: ProjectStatus) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onUpdateAllocation,
  onUpdateStatus,
}) => {
  const [isEditingAllocation, setIsEditingAllocation] = useState(false);
  const [tempAllocation, setTempAllocation] = useState('');

  const remaining = project.totalBudget - project.totalSpent;
  const percentage = project.totalBudget > 0
    ? Math.min((project.totalSpent / project.totalBudget) * 100, 100)
    : 0;

  const handleStartEdit = () => {
    setTempAllocation(project.monthlyAllocation.toString());
    setIsEditingAllocation(true);
  };

  const handleSaveAllocation = () => {
    const amount = parseFloat(tempAllocation.replace(',', '.').replace(/\s/g, '')) || 0;
    if (amount >= 0) {
      onUpdateAllocation(project.id, amount);
    }
    setIsEditingAllocation(false);
  };

  const handleCancelEdit = () => {
    setIsEditingAllocation(false);
    setTempAllocation('');
  };

  const getProgressColor = (): 'success' | 'warning' | 'danger' => {
    if (percentage < 75) return 'success';
    if (percentage < 95) return 'warning';
    return 'danger';
  };

  const cycleStatus = () => {
    const statuses: ProjectStatus[] = ['en-cours', 'en-pause', 'termine'];
    const currentIndex = statuses.indexOf(project.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    onUpdateStatus(project.id, statuses[nextIndex]);
  };

  const getStatusIcon = () => {
    switch (project.status) {
      case 'en-cours':
        return <PlayCircle size={16} />;
      case 'en-pause':
        return <Pause size={16} />;
      case 'termine':
        return <CheckCircle size={16} />;
    }
  };

  return (
    <Card hover className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text mb-2">{project.name}</h3>
          <button
            onClick={cycleStatus}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${STATUS_COLORS[project.status]}`}
          >
            {getStatusIcon()}
            {STATUS_LABELS[project.status]}
          </button>
        </div>
        <div className="flex gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(project)}
            className="!px-2.5"
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(project)}
            className="!px-2.5"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-textLight mb-1">
          <span>Progression du projet</span>
          <span>{formatCurrency(project.totalSpent)} / {formatCurrency(project.totalBudget)}</span>
        </div>
        <ProgressBar
          value={project.totalSpent}
          max={project.totalBudget}
          color={getProgressColor()}
          height="lg"
        />
        <p className="text-xs text-textLight text-right mt-1">
          {percentage.toFixed(0)}% réalisé
        </p>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-center p-2 bg-primary/5 rounded-lg">
          <p className="text-textLight text-xs">Budget total</p>
          <p className="font-semibold text-primary">{formatCurrency(project.totalBudget)}</p>
        </div>
        <div className="text-center p-2 bg-success/5 rounded-lg">
          <p className="text-textLight text-xs">Restant</p>
          <p className="font-semibold text-success">{formatCurrency(remaining)}</p>
        </div>
      </div>

      {/* Monthly allocation */}
      <div className="p-3 bg-warning/5 rounded-lg border border-warning/20">
        {!isEditingAllocation ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-textLight">Alloué ce mois</p>
              <p className="text-lg font-bold text-warning">{formatCurrency(project.monthlyAllocation)}</p>
            </div>
            <p className="text-xs text-textLight mb-3">
              Prélevé sur votre reste à vivre
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleStartEdit}
              fullWidth
            >
              {project.monthlyAllocation === 0 ? 'Allouer un montant' : 'Modifier le montant'}
            </Button>
          </>
        ) : (
          <>
            <p className="text-xs text-textLight mb-2">Nouveau montant alloué (€)</p>
            <input
              type="number"
              value={tempAllocation}
              onChange={(e) => setTempAllocation(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveAllocation}
                fullWidth
              >
                <Check size={16} className="mr-1" />
                Valider
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancelEdit}
                fullWidth
              >
                <X size={16} className="mr-1" />
                Annuler
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
