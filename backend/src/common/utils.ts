export function extractNameAndBackground(response: string): { name: string; background: string } {
    const nameMatch = response.match(/Name:\s*(.*)/);
    const backgroundMatch = response.match(/Background:\s*([\s\S]*)/);
  
    const name = nameMatch ? nameMatch[1].trim() : 'Unknown Name';
    const background = backgroundMatch ? backgroundMatch[1].trim() : 'Unknown Background';
  
    return { name, background };
  }