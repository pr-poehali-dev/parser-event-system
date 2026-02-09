import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface ChannelsTabProps {
  mockChannels: Array<{
    id: number;
    name: string;
    status: string;
    messages: number;
    lastParsed: string;
    category: string;
  }>;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  getStatusColor: (status: string) => string;
}

const ChannelsTab = ({
  mockChannels,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  getStatusColor
}: ChannelsTabProps) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default ChannelsTab;
