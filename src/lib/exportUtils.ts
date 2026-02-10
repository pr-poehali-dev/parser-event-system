import { Event } from './api';

export function exportToCSV(events: Event[], filename: string = 'events.csv') {
  const headers = [
    'ID',
    'Заголовок',
    'Описание',
    'Категория',
    'Приоритет',
    'Источник',
    'Дата',
    'Хештеги',
    'Просмотры',
    'Лайки',
  ];

  const rows = events.map(event => [
    event.id,
    `"${event.title.replace(/"/g, '""')}"`,
    `"${event.description.replace(/"/g, '""')}"`,
    event.category,
    event.priority,
    event.source,
    new Date(event.timestamp).toLocaleString('ru-RU'),
    event.hashtags?.join(' ') || '',
    event.views || 0,
    event.reactions || 0,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(events: Event[], filename: string = 'events.json') {
  const jsonContent = JSON.stringify(events, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function filterEvents(events: Event[], filters: {
  hashtags: string[];
  category: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  priority: string;
}): Event[] {
  return events.filter(event => {
    if (filters.hashtags.length > 0) {
      const eventHashtags = event.hashtags || [];
      const hasMatchingHashtag = filters.hashtags.some(filterTag => 
        eventHashtags.some(eventTag => 
          eventTag.toLowerCase().includes(filterTag.toLowerCase().replace('#', ''))
        )
      );
      if (!hasMatchingHashtag) return false;
    }

    if (filters.category !== 'all' && event.category !== filters.category) {
      return false;
    }

    if (filters.priority !== 'all' && event.priority !== filters.priority) {
      return false;
    }

    const eventDate = new Date(event.timestamp);
    if (filters.dateFrom && eventDate < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo) {
      const endOfDay = new Date(filters.dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      if (eventDate > endOfDay) {
        return false;
      }
    }

    return true;
  });
}
