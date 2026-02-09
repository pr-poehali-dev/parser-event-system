import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DashboardTabProps {
  mockEvents: Array<{
    id: number;
    channel: string;
    type: string;
    title: string;
    time: string;
    priority: string;
  }>;
  activityData: Array<{
    time: string;
    messages: number;
    events: number;
  }>;
  channelStatsData: Array<{
    name: string;
    messages: number;
  }>;
  getPriorityVariant: (priority: string) => "default" | "secondary" | "destructive" | "outline";
}

const DashboardTab = ({ mockEvents, activityData, channelStatsData, getPriorityVariant }: DashboardTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные каналы</CardTitle>
            <Icon name="Radio" className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73</div>
            <p className="text-xs text-muted-foreground">+4 за последний час</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сообщений сегодня</CardTitle>
            <Icon name="MessageSquare" className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,892</div>
            <p className="text-xs text-muted-foreground">+12% от вчера</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Новые события</CardTitle>
            <Icon name="AlertCircle" className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">159</div>
            <p className="text-xs text-muted-foreground">23 высокий приоритет</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Время отклика</CardTitle>
            <Icon name="Clock" className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.8с</div>
            <p className="text-xs text-muted-foreground">-0.2с от нормы</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Активность в реальном времени</CardTitle>
            <CardDescription>Сообщения и события за последние 6 часов</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="messages" stackId="1" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.6} name="Сообщения" />
                <Area type="monotone" dataKey="events" stackId="1" stroke="#8A898C" fill="#8A898C" fillOpacity={0.6} name="События" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Топ каналов по активности</CardTitle>
            <CardDescription>Количество сообщений за сегодня</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelStatsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" width={140} className="text-xs" />
                <Tooltip />
                <Bar dataKey="messages" fill="#0EA5E9" name="Сообщений" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Последние события</CardTitle>
          <CardDescription>Недавно обнаруженные события в каналах</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Время</TableHead>
                <TableHead>Канал</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Приоритет</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEvents.slice(0, 5).map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-data">{event.time}</TableCell>
                  <TableCell>{event.channel}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-md">{event.title}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(event.priority)}>
                      {event.priority === 'high' ? 'Высокий' : event.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab;
