import React, { useState, useEffect } from 'react';
import { Card, Table, Form, Button, Badge } from 'react-bootstrap';
import { 
  getNotasMateria, 
  updateNotaMateria,
  updateNumTPs,
  calcularPromedioParciales, 
  calcularPromedioTPs 
} from '../utils/notasLocalStorage';

export const SubjectDetail = ({ subjectId, subjectName, onBack }) => {
  const [notas, setNotas] = useState({
    parcial1: '',
    parcial2: '',
    parcial3: '',
    tps: [],
    tpi: '',
    numTPs: 4
  });

  useEffect(() => {
    loadNotas();
  }, [subjectId]);

  const loadNotas = () => {
    const data = getNotasMateria(subjectId);
    if (data) {
      setNotas({
        parcial1: data.parcial1 ?? '',
        parcial2: data.parcial2 ?? '',
        parcial3: data.parcial3 ?? '',
        tps: data.tps || [],
        tpi: data.tpi ?? '',
        numTPs: data.numTPs || data.tps?.length || 4
      });
    }
  };

  const handleNotaChange = (field, value) => {
    // Validar entrada
    if (value !== '' && (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 10)) {
      return;
    }

    // Si es un TP, actualizar el array
    if (field.startsWith('tp') && field !== 'tpi') {
      const tpIndex = parseInt(field.substring(2));
      const newTps = [...notas.tps];
      newTps[tpIndex] = value;
      setNotas(prev => ({ ...prev, tps: newTps }));
    } else {
      setNotas(prev => ({ ...prev, [field]: value }));
    }
    
    updateNotaMateria(subjectId, field, value);
  };

  const handleNumTPsChange = (newNum) => {
    const num = parseInt(newNum);
    if (isNaN(num) || num < 1 || num > 20) return;
    
    if (updateNumTPs(subjectId, num)) {
      loadNotas();
    }
  };

  const promedioParciales = calcularPromedioParciales(
    notas.parcial1, 
    notas.parcial2, 
    notas.parcial3
  );

  const promedioTPs = calcularPromedioTPs(notas.tps);

  const getStatusBadge = (nota) => {
    const n = parseFloat(nota);
    if (isNaN(n) || n === 0) return <Badge bg="secondary">Sin nota</Badge>;
    if (n >= 7) return <Badge bg="success">Aprobado</Badge>;
    if (n >= 4) return <Badge bg="warning">Regular</Badge>;
    return <Badge bg="danger">Desaprobado</Badge>;
  };

  const getPromedioColor = (promedio) => {
    if (promedio >= 7) return 'table-success';
    if (promedio >= 4) return 'table-warning';
    if (promedio > 0) return 'table-danger';
    return '';
  };

  return (
    <div className="subject-detail">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button variant="outline-primary" onClick={onBack} className="mb-2">
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </Button>
          <h2 className="mb-0">{subjectName}</h2>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">
            <i className="bi bi-file-earmark-text me-2"></i>
            Parciales
          </h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Evaluación</th>
                <th>Nota</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1er Parcial</strong></td>
                <td>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={notas.parcial1}
                    onChange={(e) => handleNotaChange('parcial1', e.target.value)}
                    placeholder="0.00"
                    className="nota-input"
                  />
                </td>
                <td>{getStatusBadge(notas.parcial1)}</td>
              </tr>
              <tr>
                <td><strong>2do Parcial</strong></td>
                <td>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={notas.parcial2}
                    onChange={(e) => handleNotaChange('parcial2', e.target.value)}
                    placeholder="0.00"
                    className="nota-input"
                  />
                </td>
                <td>{getStatusBadge(notas.parcial2)}</td>
              </tr>
              <tr>
                <td><strong>3er Parcial</strong></td>
                <td>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={notas.parcial3}
                    onChange={(e) => handleNotaChange('parcial3', e.target.value)}
                    placeholder="0.00"
                    className="nota-input"
                  />
                </td>
                <td>{getStatusBadge(notas.parcial3)}</td>
              </tr>
              <tr className={getPromedioColor(promedioParciales)}>
                <td><strong>Promedio Parciales</strong></td>
                <td><strong>{promedioParciales.toFixed(2)}</strong></td>
                <td>{getStatusBadge(promedioParciales)}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-journal-code me-2"></i>
            Trabajos Prácticos
          </h5>
          <div className="d-flex align-items-center">
            <Form.Label className="text-white mb-0 me-2">Cantidad:</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="20"
              value={notas.numTPs}
              onChange={(e) => handleNumTPsChange(e.target.value)}
              style={{ width: '80px' }}
              size="sm"
            />
          </div>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Trabajo</th>
                <th>Nota</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {notas.tps.map((tp, index) => (
                <tr key={index}>
                  <td><strong>TP {index + 1}</strong></td>
                  <td>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={tp ?? ''}
                      onChange={(e) => handleNotaChange(`tp${index}`, e.target.value)}
                      placeholder="0.00"
                      className="nota-input"
                    />
                  </td>
                  <td>{getStatusBadge(tp)}</td>
                </tr>
              ))}
              <tr className={getPromedioColor(promedioTPs)}>
                <td><strong>Promedio TPs</strong></td>
                <td><strong>{promedioTPs.toFixed(2)}</strong></td>
                <td>{getStatusBadge(promedioTPs)}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header className="bg-success text-white">
          <h5 className="mb-0">
            <i className="bi bi-trophy me-2"></i>
            Trabajo Práctico Integrador
          </h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Evaluación</th>
                <th>Nota</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>TPI</strong></td>
                <td>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={notas.tpi}
                    onChange={(e) => handleNotaChange('tpi', e.target.value)}
                    placeholder="0.00"
                    className="nota-input"
                  />
                </td>
                <td>{getStatusBadge(notas.tpi)}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <div className="alert alert-info mt-4">
        <i className="bi bi-info-circle me-2"></i>
        <strong>Nota:</strong> Las notas se guardan automáticamente al modificarlas. Los promedios se calculan en tiempo real.
      </div>
    </div>
  );
};
