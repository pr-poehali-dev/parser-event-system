import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import FilterBar, { FilterState } from './FilterBar';
import { exportToCSV, exportToJSON, filterEvents } from '@/lib/exportUtils';
import { Event } from '@/lib/api';

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
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    hashtags: [],
    category: 'all',
    dateFrom: undefined,
    dateTo: undefined,
    priority: 'all',
  });

  const convertedEvents: Event[] = useMemo(() => mockEvents.map(event => ({
    id: event.id,
    title: event.title,
    description: event.title,
    category: event.type,
    priority: event.priority,
    source: event.channel,
    timestamp: event.time,
    hashtags: [],
  })), [mockEvents]);

  const filteredEvents = useMemo(() => {
    const filtered = filterEvents(convertedEvents, filters);
    return mockEvents.filter(event => 
      filtered.some(f => f.id === event.id)
    );
  }, [convertedEvents, mockEvents, filters]);

  const handleExport = (format: 'csv' | 'json') => {
    const eventsToExport = filterEvents(convertedEvents, filters);
    if (format === 'csv') {
      exportToCSV(eventsToExport, `events_${new Date().toISOString().split('T')[0]}.csv`);
    } else {
      exportToJSON(eventsToExport, `events_${new Date().toISOString().split('T')[0]}.json`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Спарсенные события</h2>
          <p className="text-muted-foreground">
            Просмотр и фильтрация обнаруженных событий 
            {filteredEvents.length < mockEvents.length && (
              <span className="ml-2 text-primary">
                ({filteredEvents.length} из {mockEvents.length})
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Icon name="Filter" size={16} className="mr-2" />
            Фильтры
          </Button>
        </div>
      </div>

      {showFilters && (
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onExport={handleExport}
        />
      )}

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
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <Icon name="Search" size={48} className="mx-auto mb-2 opacity-50" />
                    <p>События не найдены</p>
                    <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsTab;
