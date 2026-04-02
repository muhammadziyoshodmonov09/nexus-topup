/**
 * [FUTURE EXPANSION] Creator tools — not yet integrated into routing or UI.
 * These will be added as a new category when the creator tools section is built.
 */

export interface CreatorTool {
  id: string;
  name: string;
  image: string;
  color: string;
  description: string;
}

export const creatorTools: CreatorTool[] = [
  {
    id: 'capcut',
    name: 'CapCut Pro',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
    color: 'from-gray-700 to-gray-900',
    description: 'Unlock premium video editing features.'
  },
  {
    id: 'canva',
    name: 'Canva Pro',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
    color: 'from-blue-500 to-purple-500',
    description: 'Design like a professional with premium assets.'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT Plus',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
    color: 'from-emerald-500 to-teal-500',
    description: 'Access GPT-4 and advanced AI capabilities.'
  }
];
