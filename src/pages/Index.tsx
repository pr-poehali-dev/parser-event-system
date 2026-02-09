import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import DashboardTab from '@/components/DashboardTab';
import ChannelsTab from '@/components/ChannelsTab';
import EventsTab from '@/components/EventsTab';
import AnalyticsMonitoringTabs from '@/components/AnalyticsMonitoringTabs';
import { api, type Channel, type Event } from '@/lib/api';

const activityData = [
  { time: '10:00', messages: 45, events: 12 },
  { time: '11:00', messages: 67, events: 18 },
  { time: '12:00', messages: 89, events: 24 },
  { time: '13:00', messages: 123, events: 35 },
  { time: '14:00', messages: 156, events: 42 },
  { time: '15:00', messages: 98, events: 28 },
];

const Index = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [channelsData, eventsData] = await Promise.all([
        api.getChannels(),
        api.getEvents({ limit: 50 })
      ]);
      setChannels(channelsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp?: string) => {
    if (!timestamp) return 'Никогда';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} час${Math.floor(diffMins / 60) === 1 ? '' : 'а'} назад`;
    return `${Math.floor(diffMins / 1440)} дн назад`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const channelStatsData = channels.map(ch => ({
    name: ch.name,
    messages: ch.total_messages
  }));

  const mockChannelsFormatted = channels.map(ch => ({
    id: ch.id,
    name: ch.name,
    status: ch.status,
    messages: ch.total_messages,
    lastParsed: formatTimeAgo(ch.last_parsed_at),
    category: ch.category || 'Без категории'
  }));

  const mockEventsFormatted = events.map(evt => ({
    id: evt.id,
    channel: evt.channel_name,
    type: evt.event_type,
    title: evt.title,
    time: formatTime(evt.detected_at),
    priority: evt.priority
  }));

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Загрузка данных...</p>
        </div>
      </div>
    );
  }

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
              mockEvents={mockEventsFormatted}
              activityData={activityData}
              channelStatsData={channelStatsData}
              getPriorityVariant={getPriorityVariant}
            />
          </TabsContent>

          <TabsContent value="channels">
            <ChannelsTab
              mockChannels={mockChannelsFormatted}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              getStatusColor={getStatusColor}
            />
          </TabsContent>

          <TabsContent value="events">
            <EventsTab
              mockEvents={mockEventsFormatted}
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
