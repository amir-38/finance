import { RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useFinancialScore } from '../model/useFinancialScore';

export function FinancialScore() {
  const { score, label, color } = useFinancialScore();
  const data = [{ name: 'score', value: score, fill: color }];

  return (
    <Card className="glass-card h-full border-0">
      <CardHeader>
        <CardTitle>Финансовый рейтинг</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative size-44">
          <RadialBarChart
            width={176}
            height={176}
            innerRadius="75%"
            outerRadius="100%"
            barSize={12}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar dataKey="value" angleAxisId={0} background={{ fill: 'var(--muted)' }} cornerRadius={12} />
          </RadialBarChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tabular-nums text-foreground">{score}</span>
            <span className="text-xs text-muted-foreground">из 100</span>
          </div>
        </div>
        <span className="mt-3 rounded-full px-3 py-1 text-sm font-medium" style={{ backgroundColor: `${color}1f`, color }}>
          {label}
        </span>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Учитывает норму сбережений и соблюдение бюджета
        </p>
      </CardContent>
    </Card>
  );
}
