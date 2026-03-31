import React, { useState } from 'react';
import { Tooltip, Tag, Badge } from 'antd';

const LABELS_PROB = ['', 'Muy baja', 'Baja', 'Media', 'Alta', 'Muy alta'];
const LABELS_IMP  = ['', 'Muy bajo', 'Bajo', 'Medio', 'Alto', 'Muy alto'];

const getCellColor = (p, i) => {
  const score = p * i;
  if (score >= 20) return { bg: '#ff4d4f', text: '#fff' };
  if (score >= 15) return { bg: '#ff7a45', text: '#fff' };
  if (score >= 8)  return { bg: '#fadb14', text: '#333' };
  if (score >= 4)  return { bg: '#95de64', text: '#333' };
  return                  { bg: '#d9f7be', text: '#333' };
};

const getRiskLevel = (score) => {
  if (score >= 20) return { label: 'Extremo', color: 'error'   };
  if (score >= 15) return { label: 'Alto',    color: 'warning' };
  if (score >= 8)  return { label: 'Medio',   color: 'default' };
  return                  { label: 'Bajo',    color: 'success' };
};

const RiskMatrix = ({ risks = [] }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Agrupar riesgos por celda (probabilidad, impacto)
  const getRisksInCell = (prob, impact) =>
    risks.filter(r => r.probability === prob && r.impact === impact);

  return (
    <div>
      <div className="mb-4 flex gap-4 flex-wrap items-center">
        {[
          { score: '20-25', label: 'Extremo', color: '#ff4d4f' },
          { score: '15-19', label: 'Alto',    color: '#ff7a45' },
          { score: '8-14',  label: 'Medio',   color: '#fadb14' },
          { score: '4-7',   label: 'Bajo',    color: '#95de64' },
          { score: '1-3',   label: 'Muy bajo',color: '#d9f7be' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ background: l.color, border: '1px solid #ddd' }} />
            <span className="text-xs text-gray-600">{l.label} ({l.score})</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th className="p-2 text-xs text-gray-500 border border-gray-200 bg-gray-50 w-24">
                Prob ↓ / Imp →
              </th>
              {[1,2,3,4,5].map(i => (
                <th key={i} className="p-2 text-xs font-semibold text-gray-600 border border-gray-200 bg-gray-50 text-center">
                  {i}<br/><span className="font-normal text-gray-400">{LABELS_IMP[i]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[5,4,3,2,1].map(prob => (
              <tr key={prob}>
                <td className="p-2 text-xs font-semibold text-gray-600 border border-gray-200 bg-gray-50 text-center">
                  {prob}<br/><span className="font-normal text-gray-400">{LABELS_PROB[prob]}</span>
                </td>
                {[1,2,3,4,5].map(impact => {
                  const { bg, text } = getCellColor(prob, impact);
                  const cellRisks = getRisksInCell(prob, impact);
                  const score = prob * impact;
                  const isHovered = hoveredCell === `${prob}-${impact}`;

                  return (
                    <td
                      key={impact}
                      className="border border-gray-200 text-center align-middle cursor-default transition-all"
                      style={{
                        background: bg,
                        minHeight: 72,
                        height: 72,
                        opacity: hoveredCell && !isHovered ? 0.7 : 1,
                        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                      }}
                      onMouseEnter={() => setHoveredCell(`${prob}-${impact}`)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div className="p-1">
                        <div className="text-xs font-bold mb-1" style={{ color: text }}>{score}</div>
                        {cellRisks.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {cellRisks.map(r => (
                              <Tooltip key={r.id} title={
                                <div>
                                  <div className="font-semibold">{r.name}</div>
                                  <div className="text-xs">Responsable: {r.responsible}</div>
                                  <div className="text-xs">Tratamiento: {r.treatment}</div>
                                </div>
                              }>
                                <div
                                  className="rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold cursor-pointer hover:scale-110 transition-transform"
                                  style={{ background: 'rgba(0,0,0,0.2)', color: text }}
                                >
                                  {r.id}
                                </div>
                              </Tooltip>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leyenda de riesgos en la matriz */}
      {risks.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {risks.map(r => {
            const level = getRiskLevel(r.riskLevel);
            return (
              <div key={r.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded border text-xs">
                <div className="font-bold text-gray-500 w-5 text-center">{r.id}</div>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{r.name}</div>
                  <div className="text-gray-400">{r.responsible}</div>
                </div>
                <Badge status={level.color} text={level.label} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RiskMatrix;