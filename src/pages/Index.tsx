import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import DashboardTab from '@/components/DashboardTab';
import ChannelsTab from '@/components/ChannelsTab';
import EventsTab from '@/components/EventsTab';
import AnalyticsMonitoringTabs from '@/components/AnalyticsMonitoringTabs';

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

          <TabsContent value="dashboard">
            <DashboardTab
              mockEvents={mockEvents}
              activityData={activityData}
              channelStatsData={channelStatsData}
              getPriorityVariant={getPriorityVariant}
            />
          </TabsContent>

          <TabsContent value="channels">
            <ChannelsTab
              mockChannels={mockChannels}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              getStatusColor={getStatusColor}
            />
          </TabsContent>

          <TabsContent value="events">
            <EventsTab
              mockEvents={mockEvents}
              getPriorityVariant={getPriorityVariant}
            />
          </TabsContent>

          <AnalyticsMonitoringTabs
            activityData={activityData}
            channelStatsData={channelStatsData}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
