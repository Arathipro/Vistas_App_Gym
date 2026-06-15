import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  PRIVACY_OPTIONS,
  SOCIAL_GROUPS,
  SOCIAL_NOTIFICATIONS,
  SOCIAL_USERS,
} from '../data/socialMock';

const SocialContext = createContext(null);

export function SocialProvider({ children }) {
  const [usuarios, setUsuarios] = useState(SOCIAL_USERS);
  const [grupos, setGrupos] = useState(SOCIAL_GROUPS);
  const [notificaciones, setNotificaciones] = useState(SOCIAL_NOTIFICATIONS);
  const [permisos, setPermisos] = useState(
    Object.fromEntries(PRIVACY_OPTIONS.map(option => [option.key, option.initial])),
  );

  function addFeedbackNotification(titulo, detalle, icon = '✅', tipo = 'sistema') {
    setNotificaciones(prev => [
      {
        id: Date.now() + Math.random(),
        tipo,
        icon,
        titulo,
        detalle,
        tiempo: 'Ahora',
        unread: true,
      },
      ...prev,
    ]);
  }

  function enviarSolicitud(id) {
    const user = usuarios.find(item => item.id === id);
    if (!user || user.estado !== 'disponible') return;
    setUsuarios(prev => prev.map(item => (
      item.id === id
        ? { ...item, estado: 'enviada', actividad: 'Solicitud enviada · pendiente' }
        : item
    )));
    addFeedbackNotification('Solicitud enviada', `Tu solicitud para ${user.nombre} está pendiente.`, '📨');
  }

  function cancelarSolicitud(id) {
    const user = usuarios.find(item => item.id === id);
    setUsuarios(prev => prev.map(item => (
      item.id === id
        ? { ...item, estado: 'disponible', actividad: 'Disponible para conectar' }
        : item
    )));
    if (user) addFeedbackNotification('Solicitud cancelada', `Puedes volver a enviar una solicitud a ${user.nombre}.`, '↩️');
  }

  function aceptarSolicitud(id) {
    const user = usuarios.find(item => item.id === id);
    setUsuarios(prev => prev.map(item => (
      item.id === id
        ? { ...item, estado: 'amigo', actividad: 'Nueva amistad · progreso compartido' }
        : item
    )));
    setNotificaciones(prev => prev.map(item => (
      item.userId === id && item.tipo === 'solicitud'
        ? { ...item, unread: false, tipo: 'sistema', icon: '✅', titulo: 'Solicitud aceptada', detalle: `Ahora tú y ${user?.nombre || 'este usuario'} son amigos.` }
        : item
    )));
  }

  function rechazarSolicitud(id) {
    const user = usuarios.find(item => item.id === id);
    setUsuarios(prev => prev.map(item => (
      item.id === id
        ? { ...item, estado: 'disponible', actividad: 'Solicitud rechazada' }
        : item
    )));
    setNotificaciones(prev => prev.map(item => (
      item.userId === id && item.tipo === 'solicitud'
        ? { ...item, unread: false, tipo: 'sistema', icon: '✕', titulo: 'Solicitud rechazada', detalle: `La solicitud de ${user?.nombre || 'este usuario'} fue rechazada.` }
        : item
    )));
  }

  function eliminarAmistad(id) {
    const user = usuarios.find(item => item.id === id);
    setUsuarios(prev => prev.map(item => (
      item.id === id
        ? { ...item, estado: 'disponible', actividad: 'Amistad eliminada' }
        : item
    )));
    if (user) addFeedbackNotification('Amistad eliminada', `Ya no compartes métricas con ${user.nombre}.`, '🔒');
  }

  function crearGrupo(nombre, descripcion) {
    const nuevo = {
      id: Date.now(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || 'Grupo privado creado por ti.',
      miembros: 1,
      joined: true,
      color: '#ffa032',
      icon: '✨',
      meta: 'Creado ahora',
      objetivo: 'Define una meta con tus amigos',
      progreso: 0,
      miembrosPreview: ['YO'],
      actividad: ['Grupo creado · invita amigos desde la lista'],
    };
    setGrupos(prev => [nuevo, ...prev]);
    addFeedbackNotification('Grupo creado', `${nuevo.nombre} ya está disponible para invitar amigos.`, '👥', 'grupo');
    return nuevo.id;
  }

  function unirseGrupo(id) {
    const group = grupos.find(item => item.id === id);
    setGrupos(prev => prev.map(item => (
      item.id === id
        ? { ...item, joined: true, miembros: item.miembros + 1, miembrosPreview: ['YO', ...item.miembrosPreview.slice(0, 3)] }
        : item
    )));
    if (group) addFeedbackNotification('Te uniste al grupo', `Ahora formas parte de ${group.nombre}.`, group.icon, 'grupo');
  }

  function salirGrupo(id) {
    const group = grupos.find(item => item.id === id);
    setGrupos(prev => prev.map(item => (
      item.id === id
        ? { ...item, joined: false, miembros: Math.max(0, item.miembros - 1), miembrosPreview: item.miembrosPreview.filter(member => member !== 'YO') }
        : item
    )));
    if (group) addFeedbackNotification('Saliste del grupo', `Dejaste de recibir actividad de ${group.nombre}.`, '↩️', 'grupo');
  }

  function notificarEntrenamiento(id) {
    const group = grupos.find(item => item.id === id);
    if (!group) return;
    addFeedbackNotification('Actividad compartida', `Avisaste a ${group.nombre} que comenzaste a entrenar.`, '🏋️', 'actividad');
  }

  function marcarNotificacion(id) {
    setNotificaciones(prev => prev.map(item => item.id === id ? { ...item, unread: false } : item));
  }

  function marcarTodas() {
    setNotificaciones(prev => prev.map(item => ({ ...item, unread: false })));
  }

  function togglePermiso(key) {
    const option = PRIVACY_OPTIONS.find(item => item.key === key);
    if (option?.locked) return;
    setPermisos(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const value = useMemo(() => {
    const amigos = usuarios.filter(item => item.estado === 'amigo');
    const solicitudesRecibidas = usuarios.filter(item => item.estado === 'recibida');
    const solicitudesEnviadas = usuarios.filter(item => item.estado === 'enviada');
    const misGrupos = grupos.filter(item => item.joined);
    const unreadCount = notificaciones.filter(item => item.unread).length;

    return {
      usuarios,
      grupos,
      notificaciones,
      permisos,
      amigos,
      solicitudesRecibidas,
      solicitudesEnviadas,
      misGrupos,
      unreadCount,
      enviarSolicitud,
      cancelarSolicitud,
      aceptarSolicitud,
      rechazarSolicitud,
      eliminarAmistad,
      crearGrupo,
      unirseGrupo,
      salirGrupo,
      notificarEntrenamiento,
      marcarNotificacion,
      marcarTodas,
      togglePermiso,
    };
  }, [usuarios, grupos, notificaciones, permisos]);

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (!context) throw new Error('useSocial debe utilizarse dentro de SocialProvider');
  return context;
}
