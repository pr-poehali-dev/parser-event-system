import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import {
  LineChart,
  Line,
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

const mockChannels = [
  { id: 1, name: 'Telegram News', status: 'active', messages: 1247, lastParsed: '2 мин назад', category: 'Новости' },
  { id: 2, name: 'Tech Updates', status: 'active', messages: 892, lastParsed: '5 мин назад', category: 'Технологии' },
  { id: 3, name: 'Business Analytics', status: 'paused', messages: 634, lastParsed: '1 час назад', category: 'Бизнес' },
  { id: 4, name: 'Market Insights', status: 'active', messages: 1523, lastParsed: '3 мин назад', category: 'Финансы' },
  { id: 5, name: 'Crypto News', status: 'error', messages: 445, lastParsed: '30 мин назад', category: 'Криптовалюты' },
];

const mockEvents = [
  { id: 1, channel: 'Telegram News', type: 'Новость', title: 'Обновление регуляций в сфере финтех', time: '14:23', priority: 'high' },
  { id: 2, channel: 'Tech Updates', type: 'Анонс', title: 'Запуск нового API для разработчиков', time: '14:18', priority: 'medium' },
  { id: 3, channel: 'Market Insights', type: 'Аналитика', title: 'Прогноз роста рынка на Q1 2026', time: '14:12', priority: 'high' },
  { id: 4, channel: 'Business Analytics', type: 'Отчёт', title: 'Квартальные показатели крупных компаний', time: '13:45', priority: 'medium' },
  { id: 5, channel: 'Crypto News', type: 'Алерт', title: 'Резкое изменение курса BTC', time: '13:32', priority: 'high' },
  { id: 6, channel: 'Telegram News', type: 'Новость', title: 'Изменения в политике конфиденциальности', time: '13:15', priority: 'low' },
];

const activityData = [
  { time: '10:00', messages: 45, events: 12 },
  { time: '11:00', messages: 67, events: 18 },
  { time: '12:00', messages: 89, events: 24 },
  { time: '13:00', messages: 123, events: 35 },
  { time: '14:00', messages: 156, events: 42 },
  { time: '15:00', messages: 98, events: 28 },
];

const channelStatsData = [
  { name: 'Telegram News', messages: 1247 },
  { name: 'Tech Updates', messages: 892 },
  { name: 'Market Insights', messages: 1523 },
  { name: 'Business Analytics', messages: 634 },
  { name: 'Crypto News', messages: 445 },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityVariant = (priority: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Icon name="Radio" className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">TeleParser Pro</h1>
                <p className="text-sm text-muted-foreground">Система мониторинга Telegram</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Icon name="Settings" size={16} className="mr-2" />
                Настройки
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="Bell" size={16} className="mr-2" />
                Уведомления
              </Button>
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                АП
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="dashboard">
              <Icon name="LayoutDashboard" size={16} className="mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="channels">
              <Icon name="Radio" size={16} className="mr-2" />
              Источники
            </TabsTrigger>
            <TabsTrigger value="events">
              <Icon name="ListFilter" size={16} className="mr-2" />
              События
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Icon name="TrendingUp" size={16} className="mr-2" />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="monitoring">
              <Icon name="Activity" size={16} className="mr-2" />
              Мониторинг
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Управление источниками</h2>
                <p className="text-muted-foreground">Мониторинг и управление Telegram каналами</p>
              </div>
              <Button>
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить канал
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Поиск каналов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  <SelectItem value="news">Новости</SelectItem>
                  <SelectItem value="tech">Технологии</SelectItem>
                  <SelectItem value="business">Бизнес</SelectItem>
                  <SelectItem value="finance">Финансы</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Статус</TableHead>
                      <TableHead>Название</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Сообщений</TableHead>
                      <TableHead>Последний парсинг</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockChannels.map((channel) => (
                      <TableRow key={channel.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(channel.status)}`} />
                            <span className="text-xs capitalize">{channel.status === 'active' ? 'Активен' : channel.status === 'paused' ? 'Пауза' : 'Ошибка'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{channel.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{channel.category}</Badge>
                        </TableCell>
                        <TableCell className="font-data">{channel.messages}</TableCell>
                        <TableCell className="text-muted-foreground">{channel.lastParsed}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Icon name="Play" size={14} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Icon name="Settings" size={14} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Спарсенные события</h2>
                <p className="text-muted-foreground">Просмотр и фильтрация обнаруженных событий</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Icon name="Filter" size={16} className="mr-2" />
                  Фильтры
                </Button>
                <Button variant="outline">
                  <Icon name="Download" size={16} className="mr-2" />
                  Экспорт
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Время</TableHead>
                      <TableHead>Канал</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Описание события</TableHead>
                      <TableHead>Приоритет</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEvents.map((event) => (
                      <TableRow key={event.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-data">{event.time}</TableCell>
                        <TableCell>{event.channel}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.type}</Badge>
                        </TableCell>
                        <TableCell className="max-w-lg">{event.title}</TableCell>
                        <TableCell>
                          <Badge variant={getPriorityVariant(event.priority)}>
                            {event.priority === 'high' ? 'Высокий' : event.priority === 'medium' ? 'Средний' : 'Низкий'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Icon name="Eye" size={14} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Icon name="ExternalLink" size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

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
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
