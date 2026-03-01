import { NextResponse } from 'next/server';

export async function fetchProductHuntCompanies() {
  const query = `
    query {
      posts(first: 100, order: VOTES) {
        edges {
          node {
            id
            name
            tagline
            description
            website
            votesCount
            createdAt
            topics(first: 1) {
              edges {
                node {
                  name
                }
              }
            }
            thumbnail {
              url
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PRODUCTHUNT_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query }),
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`ProductHunt API error: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0]?.message || 'GraphQL error');
  }

  return data.data.posts.edges.map(({ node }: any) => ({
    id: String(node.id),
    name: node.name,
    website: node.website || '',
    oneLiner: node.tagline,
    description: node.description || node.tagline || '',
    sector: node.topics?.edges?.[0]?.node?.name || 'Technology',
    stage: 'Seed',
    hq: 'Global',
    founded: new Date(node.createdAt).getFullYear(),
    teamSize: '1-50',
    tags: node.topics?.edges?.map((e: any) => e.node.name).filter(Boolean) || [],
    thesisScore: Math.min(96, Math.max(42, Math.floor((node.votesCount / 500) * 50) + 45)),
    enriched: false,
    logo: node.thumbnail?.url || '',
    signals: [],
    votesCount: node.votesCount,
    createdAt: node.createdAt,
    notes: []
  }));
}
