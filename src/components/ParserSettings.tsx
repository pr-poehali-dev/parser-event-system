import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';

const ParserSettings = () => {
  const [settings, setSettings] = useState<Record<string, { value: string; description: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parserStatus, setParserStatus] = useState<{
    status: string;
    has_credentials: boolean;
    has_session: boolean;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [settingsData, statusData] = await Promise.all([
        api.getSettings(),
        api.getParserStatus()
      ]);
      setSettings(settingsData);
      setParserStatus(statusData);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: Record<string, string> = {};
      Object.keys(settings).forEach(key => {
        updates[key] = settings[key].value;
      });
      
      await api.updateSettings(updates);
      alert('Настройки сохранены!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Icon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isConfigured = parserStatus?.has_credentials && parserStatus?.has_session;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Статус парсера</CardTitle>
              <CardDescription>Проверка подключения к Telegram API</CardDescription>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isConfigured ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {isConfigured ? 'Настроен' : 'Требуется настройка'}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${parserStatus?.has_credentials ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">API ключи {parserStatus?.has_credentials ? 'добавлены' : 'отсутствуют'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${parserStatus?.has_session ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">Сессия {parserStatus?.has_session ? 'активна' : 'не создана'}</span>
          </div>
          {!isConfigured && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800">
              Для работы парсера необходимо добавить секреты TELEGRAM_API_ID, TELEGRAM_API_HASH и TELEGRAM_SESSION_STRING
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Настройки парсинга</CardTitle>
          <CardDescription>Управление параметрами автоматического парсинга каналов</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Автоматический парсинг</Label>
              <p className="text-sm text-muted-foreground">
                {settings.auto_parse_enabled?.description}
              </p>
            </div>
            <Switch
              checked={settings.auto_parse_enabled?.value === 'true'}
              onCheckedChange={(checked) => updateSetting('auto_parse_enabled', checked ? 'true' : 'false')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parse_interval">Интервал парсинга (мин)</Label>
            <Input
              id="parse_interval"
              type="number"
              value={settings.parse_interval_minutes?.value || '5'}
              onChange={(e) => updateSetting('parse_interval_minutes', e.target.value)}
              placeholder="5"
            />
            <p className="text-sm text-muted-foreground">
              {settings.parse_interval_minutes?.description}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="messages_per_parse">Сообщений за раз</Label>
            <Input
              id="messages_per_parse"
              type="number"
              value={settings.messages_per_parse?.value || '50'}
              onChange={(e) => updateSetting('messages_per_parse', e.target.value)}
              placeholder="50"
            />
            <p className="text-sm text-muted-foreground">
              {settings.messages_per_parse?.description}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min_message_length">Минимальная длина сообщения</Label>
            <Input
              id="min_message_length"
              type="number"
              value={settings.min_message_length?.value || '10'}
              onChange={(e) => updateSetting('min_message_length', e.target.value)}
              placeholder="10"
            />
            <p className="text-sm text-muted-foreground">
              {settings.min_message_length?.description}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords_filter">Ключевые слова для фильтрации</Label>
            <Input
              id="keywords_filter"
              value={settings.keywords_filter?.value || ''}
              onChange={(e) => updateSetting('keywords_filter', e.target.value)}
              placeholder="новость, анонс, обновление"
            />
            <p className="text-sm text-muted-foreground">
              {settings.keywords_filter?.description}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority_keywords">Ключевые слова высокого приоритета</Label>
            <Input
              id="priority_keywords"
              value={settings.priority_keywords?.value || ''}
              onChange={(e) => updateSetting('priority_keywords', e.target.value)}
              placeholder="срочно, важно, критично"
            />
            <p className="text-sm text-muted-foreground">
              {settings.priority_keywords?.description}
            </p>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? (
              <>
                <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Icon name="Save" className="mr-2 h-4 w-4" />
                Сохранить настройки
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParserSettings;
