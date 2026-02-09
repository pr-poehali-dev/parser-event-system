import funcUrls from '../../backend/func2url.json';

const API_URLS = {
  channels: funcUrls['api-channels'],
  events: funcUrls['api-events'],
  parser: funcUrls['telegram-parser'],
  settings: funcUrls['api-settings'],
};

export interface Channel {
  id: number;
  name: string;
  username?: string;
  status: 'active' | 'paused' | 'error';
  category?: string;
  total_messages: number;
  last_parsed_at?: string;
  created_at?: string;
}

export interface Event {
  id: number;
  channel_id: number;
  channel_name: string;
  event_type: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  message_id?: number;
  detected_at: string;
}

export const api = {
  async getChannels(): Promise<Channel[]> {
    const response = await fetch(API_URLS.channels);
    const data = await response.json();
    return data.channels;
  },

  async createChannel(channel: Partial<Channel>): Promise<Channel> {
    const response = await fetch(API_URLS.channels, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(channel),
    });
    const data = await response.json();
    return data.channel;
  },

  async updateChannel(id: number, updates: Partial<Channel>): Promise<Channel> {
    const response = await fetch(API_URLS.channels, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    const data = await response.json();
    return data.channel;
  },

  async getEvents(params?: { limit?: number; priority?: string }): Promise<Event[]> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.priority) query.set('priority', params.priority);
    
    const url = `${API_URLS.events}${query.toString() ? '?' + query.toString() : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.events;
  },

  async createEvent(event: Partial<Event>): Promise<Event> {
    const response = await fetch(API_URLS.events, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    const data = await response.json();
    return data.event;
  },

  async getParserStatus(): Promise<{
    status: string;
    active_channels: number;
    has_credentials: boolean;
    has_session: boolean;
  }> {
    const response = await fetch(`${API_URLS.parser}?action=status`);
    const data = await response.json();
    return data;
  },

  async parseChannel(channelId: number): Promise<{
    success: boolean;
    parsed_messages: number;
    channel: string;
  }> {
    const response = await fetch(`${API_URLS.parser}?action=parse&channel_id=${channelId}`);
    const data = await response.json();
    return data;
  },

  async getSettings(): Promise<Record<string, { value: string; description: string }>> {
    const response = await fetch(API_URLS.settings);
    const data = await response.json();
    return data.settings;
  },

  async updateSettings(settings: Record<string, string>): Promise<{ success: boolean; updated: number }> {
    const response = await fetch(API_URLS.settings, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    });
    const data = await response.json();
    return data;
  },
};