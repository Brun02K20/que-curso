// Funciones para manejar actividades en localStorage

const STORAGE_KEY = 'calendario_actividades';

export const getActivities = () => {
  try {
    const activities = localStorage.getItem(STORAGE_KEY);
    return activities ? JSON.parse(activities) : [];
  } catch (error) {
    console.error('Error al leer actividades del localStorage:', error);
    return [];
  }
};

export const saveActivity = (activity) => {
  try {
    const activities = getActivities();
    const existingIndex = activities.findIndex(a => a.id === activity.id);
    
    if (existingIndex >= 0) {
      // Actualizar actividad existente
      activities[existingIndex] = activity;
    } else {
      // Agregar nueva actividad
      activities.push(activity);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    return true;
  } catch (error) {
    console.error('Error al guardar actividad en localStorage:', error);
    return false;
  }
};

export const deleteActivity = (activityId) => {
  try {
    const activities = getActivities();
    const filteredActivities = activities.filter(a => a.id !== activityId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredActivities));
    return true;
  } catch (error) {
    console.error('Error al eliminar actividad del localStorage:', error);
    return false;
  }
};

export const getActivitiesForDate = (date) => {
  const activities = getActivities();
  return activities.filter(a => a.date === date);
};

export const getActivitiesForMonth = (year, month) => {
  const activities = getActivities();
  const monthStr = String(month).padStart(2, '0');
  return activities.filter(a => a.date.startsWith(`${year}-${monthStr}`));
};
