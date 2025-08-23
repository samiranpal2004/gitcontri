import { useState } from "react";
import { Search, GitBranch, FileText, Star, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Progress } from "./components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

// Example of accessing the GitHub token from environment variables
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
console.log("GitHub Token available:", !!GITHUB_TOKEN);

function App() {
  // State for GitHub username and repository
  const [username, setUsername] = useState("");
  const [repo, setRepo] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // State for API data
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [stats, setStats] = useState(null);

  // Handle search submission
  const handleSearch = async (e) => {
    if (e) {
      e.preventDefault();
    }

    // Parse input for username/repo format
    const parts = searchInput.split("/");
    const newUsername = parts[0]?.trim();
    const newRepo = parts[1]?.trim();

    if (!newUsername || !newRepo) {
      setError(
        "Please enter a valid GitHub repository in the format username/repository"
      );
      return;
    }

    setUsername(newUsername);
    setRepo(newRepo);
    setError(null);
    setSearchPerformed(true);

    try {
      setLoading(true);

      // Fetch contributors from backend API
      const contributorsResponse = await fetch(
        `http://localhost:5000/api/contributors/${newUsername}/${newRepo}`
      );
      if (!contributorsResponse.ok) {
        throw new Error(
          `Failed to fetch contributors: ${contributorsResponse.statusText}`
        );
      }
      const contributorsData = await contributorsResponse.json();
      setContributors(contributorsData);

      // Fetch repository stats from backend API
      try {
        const statsResponse = await fetch(
          `http://localhost:5000/api/stats/${newUsername}/${newRepo}`
        );
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (statsErr) {
        console.warn("Could not fetch repository statistics:", statsErr);
        // Don't fail the whole operation if stats can't be fetched
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || "Failed to fetch data from the API");
      setContributors([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals for metrics
  const calculateTotals = () => {
    // If we have stats from the API, use those values
    if (stats && stats.contributions) {
      return {
        commits: stats.totalCommits || 0,
        additions: stats.totalAdditions || 0,
        deletions: stats.totalDeletions || 0,
        pullRequests: stats.totalPRs || 0,
        // Include any other metrics from the stats API
      };
    }

    // Otherwise, calculate from contributors array
    if (!contributors || contributors.length === 0)
      return { commits: 0, additions: 0, deletions: 0, pullRequests: 0 };

    return contributors.reduce(
      (totals, contributor) => {
        return {
          commits: totals.commits + (contributor.contributions || 0),
          additions: totals.additions + (contributor.additions || 0),
          deletions: totals.deletions + (contributor.deletions || 0),
          pullRequests: totals.pullRequests + (contributor.pull_requests || 0),
        };
      },
      { commits: 0, additions: 0, deletions: 0, pullRequests: 0 }
    );
  };

  // Calculate contribution percentage for visualizations
  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Get the totals for all metrics
  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg shadow-md">
                <GitBranch className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  GitHub Contribution Analyzer
                </h1>
                <p className="text-sm text-muted-foreground">
                  Analyze repository contributions and collaboration
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8 flex-grow">
        {/* Repository Input Section */}
        <Card className="border shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-primary" />
              <span>Repository Analysis</span>
            </CardTitle>
            <CardDescription>
              Enter a GitHub repository to analyze contributor metrics and
              workload distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
            >
              <div className="flex-1">
                <Input
                  placeholder="username/repository-name"
                  className="text-base focus-visible:ring-primary"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="px-8 shadow-md hover:shadow-lg transition-shadow"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  <>
                    <GitBranch className="w-4 h-4 mr-2" />
                    Analyze Repository
                  </>
                )}
              </Button>
            </form>
            {error && (
              <div className="mt-3 p-3 bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overview Stats */}
        {searchPerformed && !loading && contributors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Contributors
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {contributors.length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                    <Users className="w-8 h-8 text-blue-500 dark:text-blue-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Commits
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {totals.commits}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                    <GitBranch className="w-8 h-8 text-green-500 dark:text-green-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Lines of Code Changed
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {(totals.additions + totals.deletions).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900">
                    <FileText className="w-8 h-8 text-amber-500 dark:text-amber-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Pull Requests
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {totals.pullRequests}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                    <Star className="w-8 h-8 text-purple-500 dark:text-purple-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        {searchPerformed && !loading && contributors.length > 0 && (
          <Tabs defaultValue="contributors" className="space-y-6">
            <div className="bg-card rounded-lg p-1 shadow-sm border">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="contributors"
                  className="data-[state=active]:shadow-md"
                >
                  Contributors
                </TabsTrigger>
                <TabsTrigger
                  value="leaderboard"
                  className="data-[state=active]:shadow-md"
                >
                  Leaderboard
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Contributors Tab */}
            <TabsContent value="contributors" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contributors.map((contributor, index) => (
                  <Card
                    key={index}
                    className="border shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12 border-2 border-primary shadow-md">
                          <AvatarImage
                            src={
                              contributor.avatar_url || "/placeholder-user.jpg"
                            }
                            alt={contributor.login}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                            {contributor.login?.substring(0, 2).toUpperCase() ||
                              "GH"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="font-semibold text-foreground text-lg">
                              {contributor.name || contributor.login}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              @{contributor.login}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-background p-2 rounded-md">
                              <p className="text-muted-foreground">Commits</p>
                              <p className="font-semibold text-foreground text-lg">
                                {contributor.contributions || 0}
                              </p>
                            </div>
                            <div className="bg-background p-2 rounded-md">
                              <p className="text-muted-foreground">
                                Pull Requests
                              </p>
                              <p className="font-semibold text-purple-500 text-lg">
                                {contributor.pull_requests || 0}
                              </p>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">
                                Contribution Rate
                              </span>
                              <span className="text-sm font-semibold text-foreground">
                                {calculatePercentage(
                                  contributor.contributions || 0,
                                  totals.commits
                                )}
                                %
                              </span>
                            </div>
                            <Progress
                              value={calculatePercentage(
                                contributor.contributions || 0,
                                totals.commits
                              )}
                              className="h-2"
                            />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {contributor.contributions >
                              totals.commits * 0.3 && (
                              <Badge className="bg-blue-500 text-white shadow-sm">
                                Top Contributor
                              </Badge>
                            )}
                            {contributor.pull_requests > 0 && (
                              <Badge className="bg-purple-500 text-white shadow-sm">
                                PR Author
                              </Badge>
                            )}
                            {contributor.additions + contributor.deletions >
                              1000 && (
                              <Badge className="bg-amber-500 text-white shadow-sm">
                                Code Writer
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="space-y-6">
              <Card className="border shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Star className="w-5 h-5 text-primary" />
                    <span>Contribution Leaderboard</span>
                  </CardTitle>
                  <CardDescription>
                    Contributors ranked by commit count
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-4">
                    {contributors
                      .sort(
                        (a, b) =>
                          (b.contributions || 0) - (a.contributions || 0)
                      )
                      .map((contributor, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 p-4 rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shadow-md">
                            {index + 1}
                          </div>
                          <Avatar className="w-10 h-10 border-2 border-primary/50 shadow-md">
                            <AvatarImage
                              src={
                                contributor.avatar_url ||
                                "/placeholder-user.jpg"
                              }
                              alt={contributor.login}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                              {contributor.login
                                ?.substring(0, 2)
                                .toUpperCase() || "GH"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">
                              {contributor.name || contributor.login}
                            </h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <Badge
                                variant="secondary"
                                className="text-xs shadow-sm"
                              >
                                {contributor.pull_requests || 0} PRs
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="text-xs shadow-sm"
                              >
                                {calculatePercentage(
                                  contributor.contributions || 0,
                                  totals.commits
                                )}
                                % of commits
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-foreground">
                              {contributor.contributions || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              commits
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Empty state */}
        {!searchPerformed && (
          <div className="text-center py-12 my-8">
            {/* <img
              src="/developer-woman.png"
              alt="GitHub Contributions"
              className="mx-auto h-48 mb-6"
            /> */}
            <h2 className="text-2xl font-bold mb-2">
              Analyze GitHub Repository Contributions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enter a GitHub username and repository name in the format
              "username/repository" to analyze contributions from all
              collaborators. See detailed statistics about commits, pull
              requests, and code changes.
            </p>
          </div>
        )}

        {/* No results state */}
        {searchPerformed && !loading && contributors.length === 0 && !error && (
          <div className="text-center py-12 my-8 bg-muted/50 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-2">
              No Contributors Found
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any contributors for the repository "{username}/
              {repo}". Please check the repository name and try again.
            </p>
          </div>
        )}
      </div>

      <footer className="mt-auto border-t border-border bg-card py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">
                GitHub Contribution Analyzer
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} · Built with React and Tailwind CSS
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
