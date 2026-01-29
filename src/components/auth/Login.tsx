import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ALLOWED_EMAILS } from '../../utils/constants';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, error: authError, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        // Vérifier si l'email est autorisé pour l'inscription
        if (!ALLOWED_EMAILS.includes(email as any)) {
          setLocalError(
            'Cet email n\'est pas autorisé. Seuls Mathieu et Assia peuvent créer un compte.'
          );
          setIsSubmitting(false);
          return;
        }
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setLocalError('');
    clearError();
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-soft-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Familial</h1>
          <p className="text-gray-600 mt-2 text-center">
            {isRegistering
              ? 'Créez votre compte pour commencer'
              : 'Connectez-vous pour accéder à votre budget'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLocalError('');
                  clearError();
                }}
                className="w-full pl-10"
                autoFocus
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="password"
                placeholder={isRegistering ? 'Minimum 6 caractères' : 'Votre mot de passe'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLocalError('');
                  clearError();
                }}
                className="w-full pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          {displayError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {displayError}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!email || !password || isSubmitting}
          >
            {isSubmitting
              ? 'Chargement...'
              : isRegistering
                ? 'Créer mon compte'
                : 'Se connecter'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleMode}
            className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {isRegistering
              ? 'Vous avez déjà un compte ? Connectez-vous'
              : 'Pas encore de compte ? Créez-en un'}
          </button>
        </form>

        {isRegistering && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Budget familial privé</strong><br />
              Seuls les emails autorisés peuvent créer un compte :<br />
              • mathieu.venturini@gmail.com<br />
              • assiap1@outlook.fr
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
