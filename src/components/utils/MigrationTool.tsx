import React, { useState } from 'react';
import { Database, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { migrateFromLocalStorage } from '../../services/firestoreService';

/**
 * Composant utilitaire pour migrer les données localStorage vers Firestore
 *
 * À utiliser uniquement lors de la première migration.
 * Peut être supprimé après la migration complète.
 *
 * Pour l'utiliser, ajoutez ce composant dans App.tsx :
 *
 * import { MigrationTool } from './components/utils/MigrationTool';
 *
 * <MigrationTool />
 */
export const MigrationTool: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const handleMigration = async () => {
    try {
      setStatus('migrating');
      setMessage('Migration en cours...');

      await migrateFromLocalStorage();

      setStatus('success');
      setMessage('Migration réussie ! Toutes vos données ont été transférées vers Firestore.');
    } catch (error: any) {
      setStatus('error');
      setMessage(`Erreur lors de la migration : ${error.message}`);
      console.error('Migration error:', error);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-success" size={48} />;
      case 'error':
        return <AlertCircle className="text-danger" size={48} />;
      default:
        return <Database className="text-primary" size={48} />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'border-success bg-success/5';
      case 'error':
        return 'border-danger bg-danger/5';
      case 'migrating':
        return 'border-primary bg-primary/5 animate-pulse';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <Card className={`max-w-2xl mx-auto mb-6 ${getStatusColor()}`}>
      <div className="flex flex-col items-center text-center space-y-4 p-4">
        <div className="p-4 bg-white rounded-full shadow-soft">
          {getStatusIcon()}
        </div>

        <div>
          <h3 className="text-xl font-bold text-text mb-2">
            Migration des données localStorage
          </h3>
          <p className="text-sm text-textLight mb-4">
            Cet outil permet de transférer vos données du localStorage vers Firestore.
            Cette opération est nécessaire une seule fois.
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg w-full ${
            status === 'success' ? 'bg-success/10 text-success' :
            status === 'error' ? 'bg-danger/10 text-danger' :
            'bg-primary/10 text-primary'
          }`}>
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        {status === 'idle' && (
          <div className="space-y-3 w-full">
            <Button
              onClick={handleMigration}
              className="w-full flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              Lancer la migration
            </Button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
              <p className="text-xs text-blue-800">
                <strong>Avant de migrer :</strong>
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Assurez-vous d'être connecté à internet</li>
                <li>Firebase doit être correctement configuré</li>
                <li>Cette action ne peut être effectuée qu'une seule fois</li>
                <li>Les données localStorage seront conservées en backup</li>
              </ul>
            </div>
          </div>
        )}

        {status === 'migrating' && (
          <div className="flex items-center gap-2 text-primary">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Migration en cours...</span>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-3 w-full">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-left">
              <p className="text-xs text-green-800">
                <strong>✓ Migration terminée avec succès</strong>
              </p>
              <p className="text-xs text-green-700 mt-2">
                Vous pouvez maintenant supprimer ce composant de votre application.
                Vos données sont désormais synchronisées avec Firestore.
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <Button
            onClick={handleMigration}
            variant="secondary"
            className="w-full"
          >
            Réessayer
          </Button>
        )}
      </div>
    </Card>
  );
};
