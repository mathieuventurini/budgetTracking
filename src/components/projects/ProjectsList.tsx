import React, { useState } from 'react';
import { FolderKanban, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { ProjectCard } from './ProjectCard';
import { ProjectForm } from './ProjectForm';
import { useBudget } from '../../contexts/BudgetContext';
import type { Project } from '../../types';

export const ProjectsList: React.FC = () => {
  const { monthlyData, addProject, updateProject, deleteProject, updateProjectAllocation, updateProjectStatus } = useBudget();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const handleAdd = (name: string, totalBudget: number, totalSpent: number, monthlyAllocation: number, status: any) => {
    addProject(name, totalBudget, totalSpent, monthlyAllocation, status);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleUpdate = (name: string, totalBudget: number, totalSpent: number, monthlyAllocation: number, status: any) => {
    if (editingProject) {
      updateProject(editingProject.id, name, totalBudget, totalSpent, monthlyAllocation, status);
      setEditingProject(null);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleDeleteClick = (project: Project) => {
    setDeletingProject(project);
  };

  const handleConfirmDelete = () => {
    if (deletingProject) {
      deleteProject(deletingProject.id);
      setDeletingProject(null);
    }
  };

  if (!monthlyData) return null;

  return (
    <>
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-sm">
              <FolderKanban className="text-blue-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-text">Projets</h2>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="group relative p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            title="Nouveau projet"
          >
            <Plus size={24} className="transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {monthlyData.projects.length === 0 ? (
          <div className="text-center py-12 text-textLight">
            <FolderKanban size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg mb-2">Aucun projet pour le moment</p>
            <p className="text-sm">Créez votre premier projet pour suivre vos dépenses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthlyData.projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onUpdateAllocation={updateProjectAllocation}
                onUpdateStatus={updateProjectStatus}
              />
            ))}
          </div>
        )}
      </Card>

      <ProjectForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingProject ? handleUpdate : handleAdd}
        initialData={editingProject ? {
          name: editingProject.name,
          totalBudget: editingProject.totalBudget,
          totalSpent: editingProject.totalSpent,
          monthlyAllocation: editingProject.monthlyAllocation,
          status: editingProject.status,
        } : undefined}
        title={editingProject ? 'Modifier le projet' : 'Nouveau projet'}
      />

      <ConfirmDialog
        isOpen={deletingProject !== null}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleConfirmDelete}
        title="Supprimer le projet ?"
        message={`Êtes-vous sûr de vouloir supprimer le projet "${deletingProject?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </>
  );
};
