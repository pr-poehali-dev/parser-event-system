import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface AnalyticsMonitoringTabsProps {
  activityData: Array<{
    time: string;
    messages: number;
    events: number;
  }>;
  channelStatsData: Array<{
    name: string;
    messages: number;
  }>;
}

const AnalyticsMonitoringTabs = ({ activityData, channelStatsData }: AnalyticsMonitoringTabsProps) => {
  return (
    <>
      <TabsContent value="analytics" className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Аналитика и статистика</h2>
          <p className="text-muted-foreground">Глубокий анализ данных парсинга</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Динамика сообщений</CardTitle>
              <CardDescription>Тренд за последние 6 часов</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="messages" stroke="#0EA5E9" strokeWidth={2} name="Сообщения" />
                  <Line type="monotone" dataKey="events" stroke="#8A898C" strokeWidth={2} name="События" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Распределение по каналам</CardTitle>
              <CardDescription>Активность по источникам</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={channelStatsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" angle={-45} textAnchor="end" height={100} />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="messages" fill="#0EA5E9" name="Сообщений" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Средняя скорость парсинга</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">67</div>
              <p className="text-xs text-muted-foreground">сообщений/минуту</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Успешность парсинга</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">98.7%</div>
              <p className="text-xs text-muted-foreground">без ошибок</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Уникальных событий</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">за последние 24 часа</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="monitoring" className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Системный мониторинг</h2>
          <p className="text-muted-foreground">Состояние парсера и инфраструктуры</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Статус сервисов</CardTitle>
              <CardDescription>Работоспособность компонентов системы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Telegram Client Manager</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">Работает</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Парсер сообщений</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">Работает</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>База данных PostgreSQL</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">Работает</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>WebSocket Server</span>
                </div>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">Частичная нагрузка</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>API Layer</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">Работает</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Использование ресурсов</CardTitle>
              <CardDescription>Нагрузка на систему</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">CPU</span>
                  <span className="text-sm font-data">42%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">RAM</span>
                  <span className="text-sm font-data">68%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Диск</span>
                  <span className="text-sm font-data">34%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '34%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Сеть</span>
                  <span className="text-sm font-data">56%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '56%' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Последние логи системы</CardTitle>
            <CardDescription>Журнал событий и ошибок</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-data text-sm">
              <div className="flex items-start gap-3 p-2 rounded bg-muted/50">
                <span className="text-muted-foreground">14:23:15</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-700">INFO</Badge>
                <span>Successfully parsed 45 messages from Telegram News</span>
              </div>
              <div className="flex items-start gap-3 p-2 rounded bg-muted/50">
                <span className="text-muted-foreground">14:22:48</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-700">INFO</Badge>
                <span>Connection pool refreshed, 12 active connections</span>
              </div>
              <div className="flex items-start gap-3 p-2 rounded bg-muted/50">
                <span className="text-muted-foreground">14:21:32</span>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700">WARN</Badge>
                <span>Rate limit approaching for session #7, switching to backup</span>
              </div>
              <div className="flex items-start gap-3 p-2 rounded bg-muted/50">
                <span className="text-muted-foreground">14:20:15</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-700">INFO</Badge>
                <span>Event classifier identified 8 high-priority events</span>
              </div>
              <div className="flex items-start gap-3 p-2 rounded bg-muted/50">
                <span className="text-muted-foreground">14:18:47</span>
                <Badge variant="outline" className="bg-red-500/10 text-red-700">ERROR</Badge>
                <span>Failed to connect to channel @crypto_alerts, retrying with exponential backoff</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};

export default AnalyticsMonitoringTabs;
