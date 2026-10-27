import type {MetadataRoute} from 'next';
import {projects} from '@/content/projects';
import {profile} from '@/content/profile';
export default function sitemap():MetadataRoute.Sitemap{return [{url:profile.site,changeFrequency:'monthly',priority:1},...projects.filter(p=>p.caseStudy).map(p=>({url:`${profile.site}/projects/${p.slug}`,changeFrequency:'monthly' as const,priority:.8}))];}
