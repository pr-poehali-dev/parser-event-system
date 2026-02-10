import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export interface FilterState {
  hashtags: string[];
  category: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  priority: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onExport: (format: 'csv' | 'json') => void;
}

export default function FilterBar({ filters, onFiltersChange, onExport }: FilterBarProps) {
  const [hashtagInput, setHashtagInput] = useState('');

  const addHashtag = () => {
    if (hashtagInput.trim() && !filters.hashtags.includes(hashtagInput.trim())) {
      onFiltersChange({
        ...filters,
        hashtags: [...filters.hashtags, hashtagInput.trim()],
      });
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    onFiltersChange({
      ...filters,
      hashtags: filters.hashtags.filter(t => t !== tag),
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      hashtags: [],
      category: 'all',
      dateFrom: undefined,
      dateTo: undefined,
      priority: 'all',
    });
  };

  return (
    <div className="space-y-4 p-4 bg-card border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Icon name="Filter" size={20} />
          Фильтры
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport('csv')}
          >
            <Icon name="Download" size={16} className="mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport('json')}
          >
            <Icon name="Download" size={16} className="mr-2" />
            JSON
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Хештеги</label>
          <div className="flex gap-2">
            <Input
              placeholder="#тег"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
            />
            <Button size="sm" onClick={addHashtag}>
              <Icon name="Plus" size={16} />
            </Button>
          </div>
          {filters.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.hashtags.map(tag => (
                <Badge key={tag} variant="secondary" className="cursor-pointer">
                  {tag}
                  <Icon
                    name="X"
                    size={14}
                    className="ml-1"
                    onClick={() => removeHashtag(tag)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Категория</label>
          <Select
            value={filters.category}
            onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              <SelectItem value="politics">Политика</SelectItem>
              <SelectItem value="economy">Экономика</SelectItem>
              <SelectItem value="technology">Технологии</SelectItem>
              <SelectItem value="society">Общество</SelectItem>
              <SelectItem value="sport">Спорт</SelectItem>
              <SelectItem value="culture">Культура</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Приоритет</label>
          <Select
            value={filters.priority}
            onValueChange={(value) => onFiltersChange({ ...filters, priority: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все приоритеты</SelectItem>
              <SelectItem value="high">Высокий</SelectItem>
              <SelectItem value="medium">Средний</SelectItem>
              <SelectItem value="low">Низкий</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Период</label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Icon name="Calendar" size={16} className="mr-2" />
                  {filters.dateFrom ? format(filters.dateFrom, 'dd.MM.yyyy', { locale: ru }) : 'От'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom}
                  onSelect={(date) => onFiltersChange({ ...filters, dateFrom: date })}
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Icon name="Calendar" size={16} className="mr-2" />
                  {filters.dateTo ? format(filters.dateTo, 'dd.MM.yyyy', { locale: ru }) : 'До'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateTo}
                  onSelect={(date) => onFiltersChange({ ...filters, dateTo: date })}
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <Icon name="X" size={16} className="mr-2" />
          Сбросить фильтры
        </Button>
      </div>
    </div>
  );
}
