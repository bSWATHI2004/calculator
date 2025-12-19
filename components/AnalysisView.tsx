
import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface AnalysisViewProps {
  analysis: AnalysisResult;
}

const getRiskColor = (level: RiskLevel) => {
  switch (level) {
    case RiskLevel.LOW: return 'text-green-600 bg-green-50 border-green-200';
    case RiskLevel.MEDIUM: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case RiskLevel.HIGH: return 'text-orange-600 bg-orange-50 border-orange-200';
    case RiskLevel.CRITICAL: return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getProgressBarColor = (score: number) => {
  if (score < 30) return 'bg-green-500';
  if (score < 60) return 'bg-yellow-500';
  if (score < 85) return 'bg-orange-500';
  return 'bg-red-600';
};

export const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis }) => {
  const chartData = [
    { name: 'Risk', value: analysis.riskScore },
    { name: 'Safe', value: 100 - analysis.riskScore },
  ];

  const COLORS = [getProgressBarColor(analysis.riskScore), '#e5e7eb'];

  return (
    <div className="mt-4 space-y-6">
      <div className={`p-4 rounded-xl border-2 flex items-center justify-between ${getRiskColor(analysis.riskLevel)}`}>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider">Overall Risk Level</h3>
          <p className="text-2xl font-black">{analysis.riskLevel}</p>
        </div>
        <div className="h-16 w-16">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={20}
                outerRadius={30}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <Label value={`${analysis.riskScore}%`} position="center" className="text-[10px] font-bold fill-current" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
          <i className="fas fa-microscope text-blue-500"></i> Expert Summary
        </h4>
        <p className="text-gray-600 text-sm leading-relaxed">{analysis.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Sender Integrity</h5>
          <p className="text-sm text-slate-700">{analysis.senderAnalysis}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Link/Attachment Analysis</h5>
          <p className="text-sm text-slate-700">{analysis.linkAnalysis}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Psychological Tactics</h5>
          <p className="text-sm text-slate-700">{analysis.toneAnalysis}</p>
        </div>
      </div>

      {analysis.redFlags.length > 0 && (
        <div>
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fas fa-flag text-red-500"></i> Red Flags Detected
          </h4>
          <div className="space-y-2">
            {analysis.redFlags.map((flag, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-red-50/50 rounded-lg border border-red-100">
                <i className={`fas fa-circle-exclamation mt-1 ${
                  flag.severity === 'high' ? 'text-red-500' : 
                  flag.severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'
                }`}></i>
                <div>
                  <span className="text-xs font-bold uppercase text-red-700">{flag.category}</span>
                  <p className="text-sm text-gray-700">{flag.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-600 p-5 rounded-xl text-white">
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <i className="fas fa-shield-halved"></i> Recommended Actions
        </h4>
        <ul className="space-y-2">
          {analysis.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm">
              <i className="fas fa-check-circle text-blue-200 text-xs"></i>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
