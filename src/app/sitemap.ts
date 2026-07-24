import { MetadataRoute } from 'next';
import { GAMES_CONFIG } from '@/config/games';
import { examProfiles } from '@/data/examProfiles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://type100x.com';

  const baseRoutes = [
    { url: baseUrl, priority: 1, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/practice`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/games`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/exams`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/blog`, priority: 0.7, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/about`, priority: 0.6, changeFrequency: 'monthly' as const },
  ];

  const gameRoutes = GAMES_CONFIG.filter(g => g.enabled).map(game => ({
    url: `${baseUrl}/games/${game.id}`,
    lastModified: new Date(),
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));

  const examRoutes = examProfiles.map(exam => {
    const orgSlug = exam.organization.toLowerCase().replace(/\s+/g, '-');
    return {
      url: `${baseUrl}/exams/${orgSlug}/${exam.id}`,
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    };
  });

  return [
    ...baseRoutes.map(route => ({
      ...route,
      lastModified: new Date(),
    })),
    ...gameRoutes,
    ...examRoutes,
  ];
}
