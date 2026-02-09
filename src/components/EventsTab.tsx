import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';

interface EventsTabProps {
  mockEvents: Array<{
    id: number;
    channel: string;
    type: string;
    title: string;
    time: string;
    priority: string;
  }>;
  getPriorityVariant: (priority: string) => "default" | "secondary" | "destructive" | "outline";
}

const EventsTab = ({ mockEvents, getPriorityVariant }: EventsTabProps) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default EventsTab;
