import { RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useFinancialScore } from '../model/useFinancialScore';

export function FinancialScore() {
  const { t } = useTranslation();
  const { score, label, color } = useFinancialScore();
  const data = [{ name: 'score', value: score, fill: color }];

  return (
    <Card className="glass-card h-full border-0">
      <CardHeader>
        <CardTitle>{t('dashboard.financialScore')}</CardTitle>
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
            <span className="text-xs text-muted-foreground">{t('dashboard.outOf100')}</span>
          </div>
        </div>
        <span className="mt-3 rounded-full px-3 py-1 text-sm font-medium" style={{ backgroundColor: `${color}1f`, color }}>
          {label}
        </span>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {t('dashboard.scoreDescription')}
        </p>
      </CardContent>
    </Card>
  );
}
