import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { getAllNotas, calcularPromedioParciales, calcularPromedioTPs } from '../utils/notasLocalStorage';

export const GradesTable = () => {
  const materias = getAllNotas();

  // Calcular el número máximo de TPs entre todas las materias
  const maxTPs = Math.max(...materias.map(m => m.tps?.length || 0), 4);

  const formatNota = (nota) => {
    if (nota === null || nota === undefined || nota === '') return '-';
    return parseFloat(nota).toFixed(2);
  };

  const getCellClass = (nota) => {
    const n = parseFloat(nota);
    if (isNaN(n) || n === 0) return '';
    if (n >= 7) return 'table-success';
    if (n >= 4) return 'table-warning';
    return 'table-danger';
  };

  if (materias.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center text-muted py-5">
          <i className="bi bi-clipboard-data display-1 mb-3 d-block"></i>
          <h5>No hay materias en curso</h5>
          <p>Agrega materias para ver el resumen de notas</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="bg-dark text-white">
        <h5 className="mb-0">
          <i className="bi bi-table me-2"></i>
          Resumen General de Notas
        </h5>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table striped bordered hover className="mb-0 grades-summary-table">
            <thead className="table-dark">
              <tr>
                <th className="sticky-col">Materia</th>
                <th>P1</th>
                <th>P2</th>
                <th>P3</th>
                <th className="bg-primary text-white">Prom P.</th>
                {Array.from({ length: maxTPs }, (_, i) => (
                  <th key={`tp-header-${i}`}>TP{i + 1}</th>
                ))}
                <th className="bg-info text-white">Prom TP</th>
                <th>TPI</th>
              </tr>
            </thead>
            <tbody>
              {materias.map((materia) => {
                const promParciales = calcularPromedioParciales(
                  materia.parcial1,
                  materia.parcial2,
                  materia.parcial3
                );
                const promTPs = calcularPromedioTPs(materia.tps || []);

                return (
                  <tr key={materia.subjectId}>
                    <td className="sticky-col bg-light"><strong>{materia.subjectName}</strong></td>
                    <td className={getCellClass(materia.parcial1)}>{formatNota(materia.parcial1)}</td>
                    <td className={getCellClass(materia.parcial2)}>{formatNota(materia.parcial2)}</td>
                    <td className={getCellClass(materia.parcial3)}>{formatNota(materia.parcial3)}</td>
                    <td className={`fw-bold ${getCellClass(promParciales)}`}>{promParciales.toFixed(2)}</td>
                    {Array.from({ length: maxTPs }, (_, i) => {
                      const tpNota = materia.tps?.[i];
                      return (
                        <td key={`tp-${materia.subjectId}-${i}`} className={getCellClass(tpNota)}>
                          {formatNota(tpNota)}
                        </td>
                      );
                    })}
                    <td className={`fw-bold ${getCellClass(promTPs)}`}>{promTPs.toFixed(2)}</td>
                    <td className={getCellClass(materia.tpi)}>{formatNota(materia.tpi)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        <div className="p-3 bg-light border-top">
          <div className="row text-center">
            <div className="col-md-4">
              <span className="badge bg-success me-2">Verde</span>
              <small>Aprobado (≥ 7)</small>
            </div>
            <div className="col-md-4">
              <span className="badge bg-warning me-2">Amarillo</span>
              <small>Regular (4-6.99)</small>
            </div>
            <div className="col-md-4">
              <span className="badge bg-danger me-2">Rojo</span>
              <small>Desaprobado (&lt; 4)</small>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
