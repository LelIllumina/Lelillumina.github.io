export interface DiscordActivity {
  id: string;
  name?: string;
  state?: string;
  details?: string;
  emoji?: {
    name: string;
  };
  assets?: {
    large_image?: string;
    small_image?: string;
  };
}

export interface DiscordData {
  discord_user: {
    global_name: string;
    username: string;
  };
  discord_status: string;
  activities: DiscordActivity[];
}

export async function fetchDiscordData(discordId: string): Promise<DiscordData> {
  const response = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
  const { data } = await response.json();
  return data;
}
