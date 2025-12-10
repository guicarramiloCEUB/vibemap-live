import React, { useState } from 'react';
import { X, Camera, MapPin, Clock, DollarSign, Type, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: { lat: number; lng: number } | null;
  onEventCreated: () => void;
}

const categories = [
  'Música ao vivo',
  'Feira',
  'Festival',
  'Happy Hour',
  'Esportes',
  'Arte',
  'Gastronomia',
  'Outro',
];

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  userLocation,
  onEventCreated,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Você precisa estar logado para criar um evento');
      return;
    }

    if (!userLocation) {
      toast.error('Não foi possível obter sua localização');
      return;
    }

    if (!formData.name || !formData.category) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('events').insert({
        user_id: user.id,
        name: formData.name,
        description: formData.description || null,
        category: formData.category,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        price: formData.price ? parseFloat(formData.price) : null,
      });

      if (error) throw error;

      toast.success('Evento criado com sucesso!');
      onEventCreated();
      onClose();
      setFormData({ name: '', description: '', category: '', price: '' });
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Erro ao criar evento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-vibe-overlay/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-md bg-card rounded-t-[2rem] slide-up safe-area-inset-bottom max-h-[85vh] overflow-y-auto">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 sticky top-0 bg-card z-10">
          <div className="w-12 h-1 bg-border rounded-full" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center
                     hover:bg-muted/80 transition-colors z-20"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="px-6 pb-6">
          <h2 className="text-xl font-bold text-foreground text-center mb-6">
            Criar Novo Evento
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo upload placeholder */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border cursor-pointer hover:bg-muted/80 transition-colors">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>

            {/* Name */}
            <div className="relative">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Nome do evento *"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="auth-input"
                required
              />
            </div>

            {/* Category */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="auth-input appearance-none cursor-pointer"
                required
              >
                <option value="">Selecione uma categoria *</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
              <textarea
                placeholder="Descrição (opcional)"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="auth-input min-h-[100px] resize-none pt-3"
                rows={3}
              />
            </div>

            {/* Price */}
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                placeholder="Preço (R$) - deixe vazio se gratuito"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="auth-input"
                min="0"
                step="0.01"
              />
            </div>

            {/* Location info */}
            <div className="bg-muted rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full vibe-gradient flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Localização atual</p>
                <p className="text-xs text-muted-foreground">
                  O evento será criado na sua localização atual
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Evento'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
