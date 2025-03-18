import { request, gql } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";

const GITHUB_API_URL = process.env.GITHUB_API_URL;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface GitHubGraphQLResponse {
  user: {
    login: string;
    name: string | null;
    bio: string | null;
    repositories: {
      totalCount: number;
      nodes: Array<{
        name: string;
        description: string | null;
        primaryLanguage: {
          name: string;
        } | null;
        stargazerCount: number;
        forkCount: number;
        createdAt: string;
      }>;
    };
    contributionsCollection: {
      totalCommitContributions: number;
      restrictedContributionsCount: number;
    };
  };
  errors?: Record<string, string>[];
}

export default async function getGitHubUserActivity(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  if (!GITHUB_API_URL) {
    return res.status(500).send({ error: "Somehow we've forgotten where GitHub lives" });
  }

  const query = gql`
    query User($username: String!) {
    user(login: $username) {
        createdAt
        name
        bio
        company
        isEmployee
        login
        repositories(isFork: null) {
            totalCount
            totalDiskUsage
        }
        repositoriesContributedTo(
            contributionTypes: null
            last: 15
            includeUserRepositories: null
            hasIssues: null
        ) {
            totalCount
            totalDiskUsage
            nodes {
                archivedAt
                autoMergeAllowed
                commitComments {
                    totalCount
                }
                createdAt
                deployments {
                    totalCount
                }
                description
                forkCount
                forkingAllowed
                hasIssuesEnabled
                hasDiscussionsEnabled
                hasProjectsEnabled
                isArchived
                isDisabled
                isEmpty
                isFork
                isLocked
                name
                pushedAt
                stargazers {
                    totalCount
                }
            }
        }
    }
}`;

  const variables = { username };

  try {
    const data = await request<GitHubGraphQLResponse>(GITHUB_API_URL, query, variables, {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    });
    return res.status(200).send(JSON.stringify(data.user));
  } catch (error) {
    // There could be other errors but for now I'm just gonna assume the user typed in a non-existent github account
    return res.status(404).send({ error: "USER NOT FOUND" });
  }
}
