import { profile } from './profile';
export const starterPrompts = ['What should I know about Akib?', 'Which project shows his backend skills?', 'What has he built with AI?'];
export const fallbackLinks = [
  {id:'projects',label:'Explore projects',href:'/#projects'},
  {id:'cv',label:'Read CV',href:profile.resume},
  {id:'contact',label:'Contact Akib',href:'/#contact'},
];
// Add only owner-approved information intended for public visitors here.
export const extraFacts: string[] = [];
