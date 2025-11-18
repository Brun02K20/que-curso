// Funciones para manejar notas en localStorage

const NOTAS_STORAGE_KEY = 'materias_notas';
const CURSANDO_STORAGE_KEY = 'materias_cursando';

// Estructura de una materia con notas:
// {
//   subjectId: number,
//   subjectName: string,
//   parcial1: number | null,
//   parcial2: number | null,
//   parcial3: number | null,
//   tps: Array<number | null>, // Array dinámico de TPs
//   tpi: number | null,
//   numTPs: number // Cantidad de TPs para esta materia
// }

export const getMateriasCursando = () => {
  try {
    const materias = localStorage.getItem(CURSANDO_STORAGE_KEY);
    const parsedMaterias = materias ? JSON.parse(materias) : [];
    
    // Migrar datos antiguos al nuevo formato
    const migratedMaterias = parsedMaterias.map(materia => {
      // Si ya tiene el formato nuevo, retornar sin cambios
      if (Array.isArray(materia.tps)) {
        return materia;
      }
      
      // Migrar del formato antiguo al nuevo
      const tps = [];
      if (materia.tp1 !== undefined) tps.push(materia.tp1);
      if (materia.tp2 !== undefined) tps.push(materia.tp2);
      if (materia.tp3 !== undefined) tps.push(materia.tp3);
      if (materia.tp4 !== undefined) tps.push(materia.tp4);
      
      return {
        ...materia,
        tps: tps.length > 0 ? tps : [null, null, null, null],
        numTPs: tps.length > 0 ? tps.length : 4,
        // Eliminar propiedades antiguas
        tp1: undefined,
        tp2: undefined,
        tp3: undefined,
        tp4: undefined
      };
    });
    
    // Guardar datos migrados si hubo cambios
    if (JSON.stringify(parsedMaterias) !== JSON.stringify(migratedMaterias)) {
      localStorage.setItem(CURSANDO_STORAGE_KEY, JSON.stringify(migratedMaterias));
    }
    
    return migratedMaterias;
  } catch (error) {
    console.error('Error al leer materias cursando:', error);
    return [];
  }
};

export const addMateriaCursando = (subjectId, subjectName, numTPs = 4) => {
  try {
    const materias = getMateriasCursando();
    
    // Verificar si ya existe
    if (materias.find(m => m.subjectId === subjectId)) {
      return false;
    }
    
    const nuevaMateria = {
      subjectId,
      subjectName,
      parcial1: null,
      parcial2: null,
      parcial3: null,
      tps: Array(numTPs).fill(null), // Array dinámico según numTPs
      tpi: null,
      numTPs: numTPs
    };
    
    materias.push(nuevaMateria);
    localStorage.setItem(CURSANDO_STORAGE_KEY, JSON.stringify(materias));
    return true;
  } catch (error) {
    console.error('Error al agregar materia:', error);
    return false;
  }
};

export const removeMateriaCursando = (subjectId) => {
  try {
    const materias = getMateriasCursando();
    const filtered = materias.filter(m => m.subjectId !== subjectId);
    localStorage.setItem(CURSANDO_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error al eliminar materia:', error);
    return false;
  }
};

export const getNotasMateria = (subjectId) => {
  try {
    const materias = getMateriasCursando();
    return materias.find(m => m.subjectId === subjectId) || null;
  } catch (error) {
    console.error('Error al obtener notas:', error);
    return null;
  }
};

export const updateNotaMateria = (subjectId, field, value) => {
  try {
    const materias = getMateriasCursando();
    const index = materias.findIndex(m => m.subjectId === subjectId);
    
    if (index === -1) return false;
    
    // Validar que el valor sea un número válido o null
    const numValue = value === '' || value === null ? null : parseFloat(value);
    
    if (numValue !== null && (isNaN(numValue) || numValue < 0 || numValue > 10)) {
      return false;
    }
    
    // Si es un TP (formato: tp0, tp1, tp2, etc.), actualizar en el array
    if (field.startsWith('tp') && field !== 'tpi') {
      const tpIndex = parseInt(field.substring(2));
      if (!isNaN(tpIndex) && tpIndex >= 0 && tpIndex < materias[index].tps.length) {
        materias[index].tps[tpIndex] = numValue;
      } else {
        return false;
      }
    } else {
      materias[index][field] = numValue;
    }
    
    localStorage.setItem(CURSANDO_STORAGE_KEY, JSON.stringify(materias));
    return true;
  } catch (error) {
    console.error('Error al actualizar nota:', error);
    return false;
  }
};

export const updateNumTPs = (subjectId, newNumTPs) => {
  try {
    const materias = getMateriasCursando();
    const index = materias.findIndex(m => m.subjectId === subjectId);
    
    if (index === -1) return false;
    
    const currentTPs = materias[index].tps || [];
    const currentNumTPs = currentTPs.length;
    
    // Si aumenta la cantidad, agregar nulls
    if (newNumTPs > currentNumTPs) {
      const additionalTPs = Array(newNumTPs - currentNumTPs).fill(null);
      materias[index].tps = [...currentTPs, ...additionalTPs];
    } 
    // Si disminuye, recortar el array
    else if (newNumTPs < currentNumTPs) {
      materias[index].tps = currentTPs.slice(0, newNumTPs);
    }
    
    materias[index].numTPs = newNumTPs;
    localStorage.setItem(CURSANDO_STORAGE_KEY, JSON.stringify(materias));
    return true;
  } catch (error) {
    console.error('Error al actualizar cantidad de TPs:', error);
    return false;
  }
};

export const calcularPromedioParciales = (parcial1, parcial2, parcial3) => {
  const p1 = parseFloat(parcial1);
  const p2 = parseFloat(parcial2);
  const p3 = parseFloat(parcial3);
  
  const hasP1 = !isNaN(p1) && p1 !== null;
  const hasP2 = !isNaN(p2) && p2 !== null;
  const hasP3 = !isNaN(p3) && p3 !== null;
  
  // Si no hay ninguna nota
  if (!hasP1 && !hasP2 && !hasP3) return 0;
  
  // Si solo hay parcial 1
  if (hasP1 && !hasP2 && !hasP3) return p1;
  
  // Si hay parcial 1 y 2
  if (hasP1 && hasP2 && !hasP3) return (p1 + p2) / 2;
  
  // Si hay los 3
  if (hasP1 && hasP2 && hasP3) return (p1 + p2 + p3) / 3;
  
  // Casos edge: solo p2, solo p3, etc.
  const notas = [];
  if (hasP1) notas.push(p1);
  if (hasP2) notas.push(p2);
  if (hasP3) notas.push(p3);
  
  return notas.length > 0 ? notas.reduce((a, b) => a + b, 0) / notas.length : 0;
};

export const calcularPromedioTPs = (tps) => {
  if (!Array.isArray(tps)) return 0;
  
  const tpsValidos = tps
    .map(tp => parseFloat(tp))
    .filter(tp => !isNaN(tp) && tp !== null);
  
  if (tpsValidos.length === 0) return 0;
  
  return tpsValidos.reduce((a, b) => a + b, 0) / tpsValidos.length;
};

export const getAllNotas = () => {
  return getMateriasCursando();
};
