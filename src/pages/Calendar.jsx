import React, { useState, useEffect } from 'react';
import { Container, Button, Card, ListGroup, Badge } from 'react-bootstrap';
import { CalendarGrid } from '../components/CalendarGrid';
import { ActivityModal } from '../components/ActivityModal';
import { getActivities, saveActivity, deleteActivity } from '../utils/localStorage';
import '../styles/Calendar.css';

export const Calendar = () => {
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    const loadedActivities = getActivities();
    setActivities(loadedActivities);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dayActivities = activities.filter(act => act.date === date);
    setSelectedActivities(dayActivities);
    setShowModal(true);
  };

  const handleSaveActivity = (activity) => {
    if (saveActivity(activity)) {
      loadActivities();
    } else {
      alert('Error al guardar la actividad');
    }
  };

  const handleDeleteActivity = (activityId) => {
    if (window.confirm('¿Está seguro de eliminar esta actividad?')) {
      if (deleteActivity(activityId)) {
        loadActivities();
        const updatedActivities = selectedActivities.filter(a => a.id !== activityId);
        setSelectedActivities(updatedActivities);
      } else {
        alert('Error al eliminar la actividad');
      }
    }
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
    <Container className="calendar-page py-4 my-4">
      <div className="text-center mb-4">
        <h1 className="display-4">📅 Calendario de Actividades</h1>
        <p className="lead text-muted">
          Organiza tus parciales, exposiciones, trabajos prácticos y TPIs
        </p>
      </div>

      <CalendarGrid 
        activities={activities} 
        onDateClick={handleDateClick}
      />

      <ActivityModal 
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedDate(null);
          setSelectedActivities([]);
        }}
        onSave={handleSaveActivity}
        selectedDate={selectedDate}
        existingActivities={selectedActivities}
        onDeleteActivity={handleDeleteActivity}
      />

      {/* Resumen de próximas actividades */}
      <div className="upcoming-activities mt-5">
        <h3 className="mb-3">
          <i className="bi bi-calendar-event me-2"></i>
          Próximas Actividades
        </h3>
        {activities
          .filter(act => new Date(act.date + 'T00:00:00') >= new Date(new Date().setHours(0, 0, 0, 0)))
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5)
          .length > 0 ? (
          <ListGroup>
            {activities
              .filter(act => new Date(act.date + 'T00:00:00') >= new Date(new Date().setHours(0, 0, 0, 0)))
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 5)
              .map(activity => (
                <ListGroup.Item key={activity.id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Badge bg={getActivityBadgeVariant(activity.type)} className="me-2">
                        {activity.type}
                      </Badge>
                      <strong>{activity.subject}</strong>
                      <span className="text-muted ms-2">
                        - {formatDate(activity.date)}
                      </span>
                    </div>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteActivity(activity.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
          </ListGroup>
        ) : (
          <Card style={{marginBottom: "80px"}}>
            <Card.Body className="text-center text-muted">
              No hay actividades próximas programadas
            </Card.Body>
          </Card>
        )}
      </div>
    </Container>
  );
};
