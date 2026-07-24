'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import { getSubmissionsAction, updateSubmissionStatusAction, deleteSubmissionAction, markSubmissionReadAction } from '@/actions/submissions';
import type { FormSubmission } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'contacto' | 'afiliacion' | 'fiscales'>('contacto');
  const [viewingSubmission, setViewingSubmission] = useState<FormSubmission | null>(null);

  const [isUpdating, startUpdateTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    setIsLoading(true);
    const data = await getSubmissionsAction();
    setSubmissions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleUpdateStatus = (id: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected') => {
    startUpdateTransition(async () => {
      const result = await updateSubmissionStatusAction(id, status);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
        if (viewingSubmission && viewingSubmission.id === id) {
          setViewingSubmission(prev => prev ? { ...prev, status } : null);
        }
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };

  const handleToggleRead = (id: string, read: boolean) => {
    startUpdateTransition(async () => {
      const result = await markSubmissionReadAction(id, read);
      if (result.success) {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, read } : s));
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };

  const handleViewSubmission = (s: FormSubmission) => {
    setViewingSubmission(s);
    if (s.read === false || s.read === undefined) {
      handleToggleRead(s.id, true);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este registro de forma permanente?')) return;
    startDeleteTransition(async () => {
      const result = await deleteSubmissionAction(id);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
        setSubmissions(prev => prev.filter(s => s.id !== id));
        setViewingSubmission(null);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };

  // Status mapping
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const statusLabels = {
    pending: 'Pendiente',
    reviewed: 'Revisado',
    approved: 'Aprobado',
    rejected: 'Rechazado',
  };

  // Filter list
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(s => {
      if (s.type !== activeTab) return false;
      
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        (s.data.name && s.data.name.toLowerCase().includes(searchLower)) ||
        (s.data.dni && s.data.dni.toLowerCase().includes(searchLower)) ||
        (s.data.email && s.data.email.toLowerCase().includes(searchLower)) ||
        (s.data.locality && s.data.locality.toLowerCase().includes(searchLower)) ||
        (s.data.subject && s.data.subject.toLowerCase().includes(searchLower));

      return matchesStatus && matchesSearch;
    });
  }, [submissions, activeTab, statusFilter, searchQuery]);

  // Export CSV helper
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (activeTab === 'contacto') {
      headers = ['Fecha', 'Nombre', 'Email', 'Teléfono', 'Asunto', 'Mensaje', 'Estado'];
      rows = filteredSubmissions.map(s => [
        new Date(s.createdAt).toLocaleString('es-AR'),
        s.data.name || '',
        s.data.email || '',
        s.data.phone || '',
        s.data.subject || '',
        s.data.message || '',
        statusLabels[s.status]
      ]);
    } else if (activeTab === 'afiliacion') {
      headers = ['Fecha', 'Nombre', 'DNI', 'Email', 'Teléfono', 'Localidad', 'Dirección', 'Ocupación', 'Motivos', 'Estado'];
      rows = filteredSubmissions.map(s => [
        new Date(s.createdAt).toLocaleString('es-AR'),
        s.data.name || '',
        s.data.dni || '',
        s.data.email || '',
        s.data.phone || '',
        s.data.locality || '',
        s.data.address || '',
        s.data.occupation || '',
        s.data.comments || '',
        statusLabels[s.status]
      ]);
    } else if (activeTab === 'fiscales') {
      headers = ['Fecha', 'Nombre', 'DNI', 'Email', 'Teléfono', 'Localidad', 'Escuela/Sección de Votación', 'Disponibilidad Horaria', 'Comentarios/Experiencia', 'Estado'];
      rows = filteredSubmissions.map(s => [
        new Date(s.createdAt).toLocaleString('es-AR'),
        s.data.name || '',
        s.data.dni || '',
        s.data.email || '',
        s.data.phone || '',
        s.data.locality || '',
        s.data.electoralSection || '',
        s.data.availability === 'full_day' ? 'Jornada Completa' : s.data.availability === 'morning' ? 'Mañana' : 'Tarde',
        s.data.comments || '',
        statusLabels[s.status]
      ]);
    }

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // BOM character to enforce UTF-8 in Excel
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `solicitudes_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: 'Exportación completada', description: `Descargando listado de ${activeTab} en CSV.` });
  };

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Solicitudes y Formularios Recibidos</h1>
          <p className="text-muted-foreground">Administra y analiza los datos recibidos de pre-afiliación, fiscales y mensajes de contacto.</p>
        </div>
        <Button 
          onClick={handleExportCSV} 
          disabled={filteredSubmissions.length === 0}
          className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-md"
        >
          <Icons.Download className="w-4 h-4 mr-2" />
          Exportar filtrados a CSV
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Icons.Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, DNI, localidad, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 border border-input rounded-xl"
          />
        </div>
        <div className="w-full md:w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-background/50 border rounded-xl">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Estados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="reviewed">Revisados</SelectItem>
              <SelectItem value="approved">Aprobados</SelectItem>
              <SelectItem value="rejected">Rechazados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="contacto" onValueChange={(val: any) => { setActiveTab(val); setSearchQuery(''); }}>
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="contacto" className="rounded-lg font-medium px-4">Contacto ({submissions.filter(s => s.type === 'contacto').length})</TabsTrigger>
          <TabsTrigger value="afiliacion" className="rounded-lg font-medium px-4">Pre-Afiliaciones ({submissions.filter(s => s.type === 'afiliacion').length})</TabsTrigger>
          <TabsTrigger value="fiscales" className="rounded-lg font-medium px-4">Fiscales Mesa ({submissions.filter(s => s.type === 'fiscales').length})</TabsTrigger>
        </TabsList>

        {['contacto', 'afiliacion', 'fiscales'].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <Card className="border shadow-md rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <span className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mr-2" />
                    Cargando solicitudes...
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No se encontraron solicitudes que coincidan con la búsqueda.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="w-12 px-6 py-4 text-center font-semibold text-muted-foreground">Leído</th>
                          <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Fecha</th>
                          <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Nombre</th>
                          {tab !== 'contacto' && <th className="px-6 py-4 text-left font-semibold text-muted-foreground">DNI</th>}
                          <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Teléfono</th>
                          <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                            {tab === 'contacto' ? 'Asunto' : tab === 'afiliacion' ? 'Localidad' : 'Escuela / Sección'}
                          </th>
                          <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Estado</th>
                          <th className="px-6 py-4 text-right font-semibold text-muted-foreground">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-card/10">
                        {filteredSubmissions.map((s) => {
                          const isUnread = s.read === false || s.read === undefined;
                          return (
                            <tr key={s.id} className={cn("hover:bg-muted/10 transition-colors", isUnread ? "font-bold text-foreground bg-blue-500/5" : "text-muted-foreground")}>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <input
                                  type="checkbox"
                                  checked={!isUnread}
                                  onChange={(e) => handleToggleRead(s.id, e.target.checked)}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                                  title={isUnread ? "Marcar como leído" : "Marcar como no leído"}
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {isUnread && <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse" />}
                                  {new Date(s.createdAt).toLocaleDateString('es-AR')}
                                </div>
                              </td>
                              <td className="px-6 py-4 font-medium text-foreground">{s.data.name}</td>
                              {tab !== 'contacto' && <td className="px-6 py-4 text-foreground">{s.data.dni}</td>}
                              <td className="px-6 py-4">{s.data.phone || '-'}</td>
                              <td className="px-6 py-4 truncate max-w-[180px]">
                                {tab === 'contacto' ? s.data.subject : tab === 'afiliacion' ? s.data.locality : s.data.electoralSection}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status]}`}>
                                  {statusLabels[s.status]}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="rounded-lg"
                                  onClick={() => handleViewSubmission(s)}
                                >
                                  <Icons.View className="w-3.5 h-3.5 mr-1" /> Ver
                                </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="rounded-lg"
                                onClick={() => handleDelete(s.id)}
                                disabled={isDeleting}
                              >
                                <Icons.Trash className="w-3.5 h-3.5" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={!!viewingSubmission} onOpenChange={(open) => !open && setViewingSubmission(null)}>
        <DialogContent className="max-w-2xl bg-card text-foreground rounded-2xl border">
          {viewingSubmission && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold text-accent">
                  Detalle de Solicitud ({statusLabels[viewingSubmission.status]})
                </DialogTitle>
                <DialogDescription>
                  Recibida el {new Date(viewingSubmission.createdAt).toLocaleString('es-AR')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 my-4 divide-y divide-border text-sm">
                <div className="grid grid-cols-3 gap-2 py-3">
                  <span className="font-semibold text-muted-foreground col-span-1">Tipo de Formulario:</span>
                  <span className="col-span-2 font-medium uppercase">{viewingSubmission.type}</span>
                </div>
                
                {Object.entries(viewingSubmission.data).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    name: 'Nombre Completo',
                    dni: 'DNI / Documento',
                    email: 'Correo Electrónico',
                    phone: 'Teléfono / WhatsApp',
                    locality: 'Localidad de residencia',
                    address: 'Domicilio Completo',
                    occupation: 'Profesión / Ocupación',
                    subject: 'Asunto de consulta',
                    message: 'Mensaje de contacto',
                    electoralSection: 'Escuela / Sección Escrutinio',
                    availability: 'Disponibilidad horaria',
                    comments: 'Comentarios / Información extra'
                  };
                  
                  let formattedValue = String(value);
                  if (key === 'availability') {
                    formattedValue = value === 'full_day' ? 'Jornada Completa' : value === 'morning' ? 'Turno Mañana' : 'Turno Tarde';
                  }

                  return (
                    <div key={key} className="grid grid-cols-3 gap-2 py-3">
                      <span className="font-semibold text-muted-foreground col-span-1">{labels[key] || key}:</span>
                      <span className="col-span-2 whitespace-pre-wrap">{formattedValue || '-'}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-sm text-muted-foreground font-medium">Cambiar Estado:</span>
                  <Select 
                    value={viewingSubmission.status} 
                    onValueChange={(val: any) => handleUpdateStatus(viewingSubmission.id, val)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-[160px] bg-background/50 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="reviewed">Revisado</SelectItem>
                      <SelectItem value="approved">Aprobado</SelectItem>
                      <SelectItem value="rejected">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <Button 
                    variant="outline" 
                    className="rounded-lg"
                    onClick={() => setViewingSubmission(null)}
                  >
                    Cerrar
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="rounded-lg"
                    onClick={() => handleDelete(viewingSubmission.id)}
                    disabled={isDeleting}
                  >
                    <Icons.Trash className="w-4 h-4 mr-2" /> Eliminar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
