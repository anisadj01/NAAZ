import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Sector } from 'recharts';

const Dashboard = () => {
  // Données factices pour les missions par mois et lieu (avec villes algériennes)
  const missionData = [
    { mois: 'Jan', nombreMissions: 12, tarifMoyen: 85000, lieu: 'Alger' },
    { mois: 'Fév', nombreMissions: 19, tarifMoyen: 92000, lieu: 'Oran' },
    { mois: 'Mar', nombreMissions: 15, tarifMoyen: 78000, lieu: 'Constantine' },
    { mois: 'Avr', nombreMissions: 25, tarifMoyen: 105000, lieu: 'Annaba' },
    { mois: 'Mai', nombreMissions: 22, tarifMoyen: 95000, lieu: 'Sétif' },
    { mois: 'Juin', nombreMissions: 30, tarifMoyen: 110000, lieu: 'Tlemcen' },
  ];

  // Données pour le diagramme circulaire - répartition des missions par lieu (villes algériennes)
  const missionsByLocation = [
    { name: 'Alger', value: 35 },
    { name: 'Oran', value: 20 },
    { name: 'Constantine', value: 15 },
    { name: 'Annaba', value: 12 },
    { name: 'Sétif', value: 10 },
    { name: 'Tlemcen', value: 8 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
          {`${value} missions`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  // État pour le secteur actif dans le diagramme circulaire
  const [activeIndex, setActiveIndex] = React.useState(0);
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // Style du conteneur principal pour centrer les diagrammes
  const dashboardContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '20px',
  };

  // Style personnalisé pour les diagrammes - 70% largeur, marge gauche augmentée
  const chartContainerStyle = {
    background: 'linear-gradient(to right, #f8f9fa, #e9ecef)',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    margin: '20px 0',
    width: '70%',
    marginLeft: '100px', // Marge gauche augmentée
    marginRight: '60px',
  };

  // Formatteur pour afficher les valeurs en DZA
  const formatMoneyDZA = (value) => {
    return `${value.toLocaleString()} DZA`;
  };

  return (
    <div style={dashboardContainerStyle}>
      <h1 className="dashboard-title">Tableau de Bord des Missions</h1>
      
      {/* Diagramme de bateaux (Bar Chart représentant les missions par mois) */}
      <div style={chartContainerStyle}>
        <h2>Suivi des Missions par Mois</h2>
        <p>Nombre de missions et tarif moyen par mois</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={missionData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis dataKey="mois" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tickFormatter={formatMoneyDZA} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              formatter={(value, name) => {
                if (name === "Tarif Moyen (DZA)") {
                  return [`${value.toLocaleString()} DZA`, name];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Bar 
              yAxisId="left" 
              dataKey="nombreMissions" 
              name="Nombre de Missions" 
              fill="#8884d8" 
              radius={[5, 5, 0, 0]}
              barSize={30}
            />
            <Bar 
              yAxisId="right" 
              dataKey="tarifMoyen" 
              name="Tarif Moyen (DZA)" 
              fill="#82ca9d" 
              radius={[5, 5, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Diagramme circulaire (répartition des missions par lieu) */}
      <div style={chartContainerStyle}>
        <h2>Répartition des Missions par Lieu</h2>
        <p>Distribution géographique des missions en Algérie</p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={missionsByLocation}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
            >
              {missionsByLocation.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;