import React, { useState, useMemo } from 'react';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import { VIDatosMaterias } from '../constants/constants';

export const AddSubjectModal = ({ show, onHide, onAdd, existingSubjects }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [numTPs, setNumTPs] = useState(4);

  const filteredSubjects = useMemo(() => {
    // Filtrar materias que no están siendo cursadas
    const availableSubjects = VIDatosMaterias.filter(
      materia => !existingSubjects.some(existing => existing.subjectId === materia.id)
    );

    if (!searchTerm) return availableSubjects;
    
    return availableSubjects.filter(materia => 
      materia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, existingSubjects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedSubject) {
      alert('Por favor seleccione una materia');
      return;
    }

    const subject = VIDatosMaterias.find(m => m.id === parseInt(selectedSubject));
    
    if (onAdd(parseInt(selectedSubject), subject.nombre, numTPs)) {
      handleClose();
    } else {
      alert('Error al agregar la materia');
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedSubject('');
    setNumTPs(4);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-plus-circle me-2"></i>
          Agregar Materia
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Buscar Materia</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escribe para buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Seleccionar Materia <span className="text-danger">*</span></Form.Label>
            <Form.Select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
              size="lg"
              style={{ maxHeight: '250px', overflowY: 'auto' }}
            >
              <option value="">Seleccione una materia...</option>
              {filteredSubjects.map(materia => (
                <option key={materia.id} value={materia.id}>
                  {materia.nombre}
                </option>
              ))}
            </Form.Select>
            
            {filteredSubjects.length === 0 && (
              <Form.Text className="text-muted">
                {searchTerm 
                  ? 'No se encontraron materias disponibles con ese nombre' 
                  : 'Ya estás cursando todas las materias'}
              </Form.Text>
            )}
            
            {filteredSubjects.length > 0 && (
              <Form.Text className="text-muted">
                {filteredSubjects.length} materia{filteredSubjects.length !== 1 ? 's' : ''} disponible{filteredSubjects.length !== 1 ? 's' : ''}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cantidad de Trabajos Prácticos <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="20"
              value={numTPs}
              onChange={(e) => setNumTPs(parseInt(e.target.value) || 1)}
              required
            />
            <Form.Text className="text-muted">
              Especifica cuántos TPs tiene esta materia (sin incluir el TPI)
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={!selectedSubject}>
            Agregar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
