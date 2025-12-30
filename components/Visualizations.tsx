import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AnalysisResult } from '../types';

interface VisualizationsProps {
  data: AnalysisResult['charts'];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1', '#EC4899', '#14B8A6'];
const BAR_COLORS = {
    Facility: '#CBD5E1', // Gray-300
    Average: '#3B82F6',  // Blue-500
    Review: '#F97316'    // Orange-500
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg text-xs">
        <p className="font-bold text-gray-800">{label}</p>
        <p className="text-gray-600">
          {payload[0].value.toLocaleString()} {payload[0].payload.unit || ''}
        </p>
      </div>
    );
  }
  return null;
};

const Visualizations: React.FC<VisualizationsProps> = ({ data }) => {
  const { similarFacilities, planAreas, alternativeAreas } = data;

  // Prepare Bar Data: Map category to color
  const barData = similarFacilities.map(item => ({
    ...item,
    fill: BAR_COLORS[item.category as keyof typeof BAR_COLORS] || '#94A3B8'
  }));

  return (
    <div className="h-full overflow-y-auto p-4 bg-gray-50 print:bg-white print:p-0 print:overflow-visible">
      
      {/* 1. Similar Facility Cost Comparison */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 print:border-none print:shadow-none print:mb-8 print:break-inside-avoid print:page-break-inside-avoid">
        <h3 className="text-lg font-bold text-gray-800 mb-1">유사시설 공사비 비교</h3>
        <p className="text-xs text-gray-500 mb-6">단위: 천원/㎡</p>
        <div className="h-80 w-full print:h-[400px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} debounce={50}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} />
              <YAxis tickFormatter={(value) => value.toLocaleString()} tick={{fontSize: 12}} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
              <Bar dataKey="costPerArea" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-xs font-medium">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-300"></div> 유사시설</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500"></div> 평균</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500"></div> 검토안</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:block print:gap-0">
        {/* 2. Plan Areas Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:border-none print:shadow-none print:mb-8 print:break-inside-avoid print:page-break-inside-avoid">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">세부면적 구성 (계획안)</h3>
          <div className="h-64 w-full print:h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} debounce={50}>
              <PieChart>
                <Pie
                  data={planAreas}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {planAreas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString()} ㎡`} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{fontSize: '11px', paddingTop: '10px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Alternative Areas Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:border-none print:shadow-none print:mb-8 print:break-inside-avoid print:page-break-inside-avoid">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">세부면적 구성 (대안)</h3>
          <div className="h-64 w-full print:h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} debounce={50}>
              <PieChart>
                <Pie
                  data={alternativeAreas}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {alternativeAreas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString()} ㎡`} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{fontSize: '11px', paddingTop: '10px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Detailed Area Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:border-none print:shadow-none print:break-inside-avoid print:page-break-inside-avoid">
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">전체 세부실별 면적표</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
            <div>
                <h4 className="text-sm font-semibold text-blue-600 mb-2">계획안 (신청안)</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left font-medium text-gray-500">실명</th>
                                <th className="px-3 py-2 text-right font-medium text-gray-500">면적 (㎡)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {planAreas.length > 0 ? planAreas.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="px-3 py-2 text-gray-700">{item.name}</td>
                                    <td className="px-3 py-2 text-right text-gray-700">{item.value.toLocaleString()}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={2} className="px-3 py-2 text-center text-gray-400">데이터 없음</td></tr>
                            )}
                            <tr className="bg-gray-50 font-bold">
                                <td className="px-3 py-2">합계</td>
                                <td className="px-3 py-2 text-right">
                                    {planAreas.reduce((acc, cur) => acc + cur.value, 0).toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <h4 className="text-sm font-semibold text-orange-600 mb-2">검토안 (대안)</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left font-medium text-gray-500">실명</th>
                                <th className="px-3 py-2 text-right font-medium text-gray-500">면적 (㎡)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {alternativeAreas.length > 0 ? alternativeAreas.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="px-3 py-2 text-gray-700">{item.name}</td>
                                    <td className="px-3 py-2 text-right text-gray-700">{item.value.toLocaleString()}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={2} className="px-3 py-2 text-center text-gray-400">데이터 없음</td></tr>
                            )}
                            <tr className="bg-gray-50 font-bold">
                                <td className="px-3 py-2">합계</td>
                                <td className="px-3 py-2 text-right">
                                    {alternativeAreas.reduce((acc, cur) => acc + cur.value, 0).toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizations;