import React, { useState, useMemo } from 'react';
import { Modal, Button, Form, ListGroup, Badge } from 'react-bootstrap';
import { VIDatosMaterias } from '../constants/constants';

const ACTIVITY_TYPES = ['Parcial', 'Exposicion', 'Trabajo Practico', 'TPI'];

export const ActivityModal = ({ show, onHide, onSave, selectedDate, existingActivity, existingActivities = [], onDeleteActivity }) => {
  const [activityType, setActivityType] = useState(existingActivity?.type || '');
  const [selectedSubject, setSelectedSubject] = useState(existingActivity?.subjectId || '');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = useMemo(() => {
    if (!searchTerm) return VIDatosMaterias;
    return VIDatosMaterias.filter(materia => 
      materia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!activityType || !selectedSubject) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const subject = VIDatosMaterias.find(m => m.id === parseInt(selectedSubject));
    
    const activity = {
      id: existingActivity?.id || Date.now(),
      date: selectedDate,
      type: activityType,
      subjectId: parseInt(selectedSubject),
      subject: subject.nombre,
      createdAt: existingActivity?.createdAt || new Date().toISOString()
    };

    onSave(activity);
    handleClose();
  };

  const handleClose = () => {
    setActivityType('');
    setSelectedSubject('');
    setSearchTerm('');
    onHide();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-AR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getActivityBadgeVariant = (type) => {
    const variants = {
      'Parcial': 'danger',
      'Exposicion': 'warning',
      'Trabajo Practico': 'info',
      'TPI': 'success'
    };
    return variants[type] || 'secondary';
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {existingActivity ? 'Editar Actividad' : 'Gestionar Actividades'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3">
            <p className="text-muted">
              <i className="bi bi-calendar-event me-2"></i>
              {formatDate(selectedDate)}
            </p>
          </div>

          {/* Mostrar actividades existentes */}
          {existingActivities && existingActivities.length > 0 && (
            <div className="mb-4">
              <h6 className="mb-2">Actividades programadas:</h6>
              <ListGroup variant="flush">
                {existingActivities.map(activity => (
                  <ListGroup.Item key={activity.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <Badge bg={getActivityBadgeVariant(activity.type)} className="me-2">
                        {activity.type}
                      </Badge>
                      <strong>{activity.subject}</strong>
                    </div>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => onDeleteActivity(activity.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <hr className="my-3" />
            </div>
          )}

          <h6 className="mb-3">Agregar nueva actividad:</h6>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de Actividad <span className="text-danger">*</span></Form.Label>
            <Form.Select 
              value={activityType} 
              onChange={(e) => setActivityType(e.target.value)}
              required
            >
              <option value="">Seleccione un tipo...</option>
              {ACTIVITY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Materia <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Buscar materia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            <Form.Select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
              size="lg"
              style={{ maxHeight: '200px' }}
            >
              <option value="">Seleccione una materia...</option>
              {filteredSubjects.map(materia => (
                <option key={materia.id} value={materia.id}>
                  {materia.nombre}
                </option>
              ))}
            </Form.Select>
            {searchTerm && filteredSubjects.length === 0 && (
              <Form.Text className="text-muted">
                No se encontraron materias con ese nombre
              </Form.Text>
            )}
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar Actividad
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
