import React, { useState, useEffect } from 'react';
import { Container, Button, Card, ListGroup, Badge, Nav } from 'react-bootstrap';
import { AddSubjectModal } from '../components/AddSubjectModal';
import { SubjectDetail } from '../components/SubjectDetail';
import { GradesTable } from '../components/GradesTable';
import { 
  getMateriasCursando, 
  addMateriaCursando, 
  removeMateriaCursando 
} from '../utils/notasLocalStorage';
import '../styles/Notas.css';

export const Notas = () => {
  const [materias, setMaterias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeView, setActiveView] = useState('list'); // 'list', 'detail', 'summary'

  useEffect(() => {
    loadMaterias();
  }, []);

  const loadMaterias = () => {
    const loaded = getMateriasCursando();
    setMaterias(loaded);
  };

  const handleAddMateria = (subjectId, subjectName, numTPs) => {
    if (addMateriaCursando(subjectId, subjectName, numTPs)) {
      loadMaterias();
      return true;
    }
    return false;
  };

  const handleRemoveMateria = (subjectId, subjectName) => {
    if (window.confirm(`¿Está seguro de eliminar "${subjectName}"? Se perderán todas las notas.`)) {
      if (removeMateriaCursando(subjectId)) {
        loadMaterias();
        if (selectedSubject?.subjectId === subjectId) {
          setSelectedSubject(null);
          setActiveView('list');
        }
      }
    }
  };

  const handleViewSubject = (materia) => {
    setSelectedSubject(materia);
    setActiveView('detail');
  };

  const handleBackToList = () => {
    setSelectedSubject(null);
    setActiveView('list');
    loadMaterias(); // Recargar para actualizar cualquier cambio
  };

  const renderListView = () => (
    <>
      <div className="text-center mb-4">
        <h1 className="display-4">📚 Mis Notas</h1>
        <p className="lead text-muted">
          Gestiona las notas de tus materias en curso
        </p>
      </div>

      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="mb-0">
            <i className="bi bi-book me-2"></i>
            Materias en Curso ({materias.length})
          </h5>
          <Button 
            variant="light" 
            size="sm"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Agregar Materia
          </Button>
        </Card.Header>
        <Card.Body>
          {materias.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-inbox display-1 mb-3 d-block"></i>
              <h5>No hay materias en curso</h5>
              <p>Comienza agregando las materias que estás cursando</p>
              <Button 
                variant="primary" 
                onClick={() => setShowModal(true)}
                className="mt-2"
              >
                <i className="bi bi-plus-lg me-2"></i>
                Agregar Primera Materia
              </Button>
            </div>
          ) : (
            <ListGroup variant="flush">
              {materias.map((materia) => (
                <ListGroup.Item 
                  key={materia.subjectId}
                  className="d-flex justify-content-between align-items-center subject-list-item"
                >
                  <div className="d-flex align-items-center flex-grow-1">
                    <i className="bi bi-journal-text text-primary me-3 fs-4"></i>
                    <div>
                      <h6 className="mb-0">{materia.subjectName}</h6>
                      <small className="text-muted">
                        ID: {materia.subjectId}
                      </small>
                    </div>
                  </div>
                  <div className="btn-group">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleViewSubject(materia)}
                    >
                      <i className="bi bi-pencil-square me-1"></i>
                      Ver/Editar
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleRemoveMateria(materia.subjectId, materia.subjectName)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {materias.length > 0 && (
        <div className="text-center">
          <Button 
            variant="outline-primary" 
            size="lg"
            onClick={() => setActiveView('summary')}
          >
            <i className="bi bi-table me-2"></i>
            Ver Resumen General
          </Button>
        </div>
      )}
    </>
  );

  const renderDetailView = () => (
    <SubjectDetail 
      subjectId={selectedSubject.subjectId}
      subjectName={selectedSubject.subjectName}
      onBack={handleBackToList}
    />
  );

  const renderSummaryView = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-clipboard-data me-2"></i>
          Resumen General
        </h2>
        <Button variant="outline-primary" onClick={() => setActiveView('list')}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver a Materias
        </Button>
      </div>
      <GradesTable />
    </>
  );

  return (
    <Container className="notas-page py-4 my-4">
      {/* Navegación de pestañas */}
      {materias.length > 0 && activeView !== 'detail' && (
        <Nav variant="tabs" className="mb-4" activeKey={activeView}>
          <Nav.Item>
            <Nav.Link 
              eventKey="list" 
              onClick={() => setActiveView('list')}
            >
              <i className="bi bi-list-ul me-2"></i>
              Mis Materias
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              eventKey="summary" 
              onClick={() => setActiveView('summary')}
            >
              <i className="bi bi-table me-2"></i>
              Resumen
            </Nav.Link>
          </Nav.Item>
        </Nav>
      )}

      {/* Renderizar vista activa */}
      {activeView === 'list' && renderListView()}
      {activeView === 'detail' && renderDetailView()}
      {activeView === 'summary' && renderSummaryView()}

      {/* Modal para agregar materia */}
      <AddSubjectModal 
        show={showModal}
        onHide={() => setShowModal(false)}
        onAdd={handleAddMateria}
        existingSubjects={materias}
      />
    </Container>
  );
};
