export default async function fetchNekostats(username: string): Promise<NekostatsResponse> {
  const response = await fetch(`https://nekoweb.org/api/site/info/${username}`);

  const data = await response.json();

  return data;
}

export interface NekostatsResponse {
  id: number;
  username: string;
  title: string;
  updates: number;
  followers: number;
  views: number;
  created_at: number;
  updated_at: number;
}
