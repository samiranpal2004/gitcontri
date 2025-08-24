import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  GitBranch,
  FileText,
  Star,
  Users,
  Code,
  Github,
  Crown,
  ArrowRight,
  Activity,
  ExternalLink,
  Share2,
  BookOpen,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

// Card hover animation variants
const statsCardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

// Page transition animation
const pageTransition = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

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
    <motion.div
      className="min-h-screen bg-background flex flex-col"
      initial="hidden"
      animate="show"
      exit="exit"
      variants={pageTransition}
    >
        <motion.header
          className="border-b border-border bg-card sticky top-0 z-10 shadow-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg shadow-md"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <GitBranch className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
            GitHub Contribution Analyzer
              </h1>
              <p className="text-sm text-muted-foreground">
            Analyze repository contributions and collaboration
              </p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a
              href="https://github.com/samiranpal2004/gitcontri"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" className="flex items-center gap-1">
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">View Source</span>
              </Button>
            </a>
          </motion.div>
            </div>
          </div>
        </motion.header>

        <div className="container mx-auto px-4 py-8 space-y-8 flex-grow">
          {/* Repository Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className="border shadow-md transition-all duration-300 overflow-hidden bg-gradient-card dark:bg-gradient-card-dark backdrop-blur-sm">
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
                    className="text-base focus-visible:ring-primary bg-background/60 backdrop-blur-sm"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type="submit"
                    className="px-8 shadow-md hover:shadow-lg bg-gradient-primary transition-shadow"
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
                        Analyzing...
                      </span>
                    ) : (
                      <>
                        <GitBranch className="w-4 h-4 mr-2" />
                        Analyze Repository
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-3 bg-destructive/10 text-destructive rounded-md"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Overview Stats */}
        {searchPerformed && !loading && contributors.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div custom={0} variants={statsCardVariants}>
              <Card className="border shadow-neumorph dark:shadow-neumorph-dark transition-all duration-300 hover:scale-105 bg-card overflow-hidden">
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
                    <motion.div
                      className="p-3 rounded-full bg-blue-100 dark:bg-blue-900"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      <Users className="w-8 h-8 text-blue-500 dark:text-blue-300" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div custom={1} variants={statsCardVariants}>
              <Card className="border shadow-neumorph dark:shadow-neumorph-dark transition-all duration-300 hover:scale-105 bg-card overflow-hidden">
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
                    <motion.div
                      className="p-3 rounded-full bg-green-100 dark:bg-green-900"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      <GitBranch className="w-8 h-8 text-green-500 dark:text-green-300" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div custom={2} variants={statsCardVariants}>
              <Card className="border shadow-neumorph dark:shadow-neumorph-dark transition-all duration-300 hover:scale-105 bg-card overflow-hidden">
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
                    <motion.div
                      className="p-3 rounded-full bg-amber-100 dark:bg-amber-900"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      <FileText className="w-8 h-8 text-amber-500 dark:text-amber-300" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div custom={3} variants={statsCardVariants}>
              <Card className="border shadow-neumorph dark:shadow-neumorph-dark transition-all duration-300 hover:scale-105 bg-card overflow-hidden">
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
                    <motion.div
                      className="p-3 rounded-full bg-purple-100 dark:bg-purple-900"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      <Star className="w-8 h-8 text-purple-500 dark:text-purple-300" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Main Content Tabs */}
        {searchPerformed && !loading && contributors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Tabs defaultValue="contributors" className="space-y-6">
              <div className="bg-card rounded-lg p-1 shadow-sm border backdrop-blur-sm">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="contributors"
                    className="data-[state=active]:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Contributors
                  </TabsTrigger>
                  <TabsTrigger
                    value="leaderboard"
                    className="data-[state=active]:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Leaderboard
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Contributors Tab */}
              <TabsContent value="contributors" className="space-y-6">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {contributors.map((contributor, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.03,
                        boxShadow:
                          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <Card className="border shadow-neumorph dark:shadow-neumorph-dark transition-all duration-300 overflow-hidden bg-gradient-card dark:bg-gradient-card-dark backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Avatar className="w-12 h-12 border-2 border-primary shadow-md">
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
                            </motion.div>
                            <div className="flex-1 space-y-4">
                              <div>
                                <h3 className="font-semibold text-foreground text-lg flex items-center">
                                  {contributor.name || contributor.login}
                                  <a
                                    href={`https://github.com/${contributor.login}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-muted-foreground hover:text-primary inline-flex"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  @{contributor.login}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <motion.div
                                  className="bg-background/60 backdrop-blur-sm p-2 rounded-md"
                                  whileHover={{ y: -3 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                >
                                  <p className="text-muted-foreground">
                                    Commits
                                  </p>
                                  <p className="font-semibold text-foreground text-lg">
                                    {contributor.contributions || 0}
                                  </p>
                                </motion.div>
                                <motion.div
                                  className="bg-background/60 backdrop-blur-sm p-2 rounded-md"
                                  whileHover={{ y: -3 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                >
                                  <p className="text-muted-foreground">
                                    Pull Requests
                                  </p>
                                  <p className="font-semibold text-purple-500 text-lg">
                                    {contributor.pull_requests || 0}
                                  </p>
                                </motion.div>
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
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${calculatePercentage(
                                      contributor.contributions || 0,
                                      totals.commits
                                    )}%`,
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    ease: "easeOut",
                                    delay: 0.2,
                                  }}
                                  className="h-2 bg-primary rounded-full"
                                />
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {contributor.contributions >
                                  totals.commits * 0.3 && (
                                  <Badge className="bg-gradient-primary text-white shadow-sm">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Top Contributor
                                  </Badge>
                                )}
                                {contributor.pull_requests > 0 && (
                                  <Badge className="bg-accent text-white shadow-sm">
                                    <Star className="w-3 h-3 mr-1" />
                                    PR Author
                                  </Badge>
                                )}
                                {contributor.additions + contributor.deletions >
                                  1000 && (
                                  <Badge className="bg-amber-500 text-white shadow-sm">
                                    <FileText className="w-3 h-3 mr-1" />
                                    Code Writer
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              {/* Leaderboard Tab */}
              <TabsContent value="leaderboard" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border shadow-neumorph dark:shadow-neumorph-dark transition-all duration-300 overflow-hidden bg-gradient-card dark:bg-gradient-card-dark backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <Crown className="w-5 h-5 text-primary" />
                        <span>Contribution Leaderboard</span>
                      </CardTitle>
                      <CardDescription>
                        Contributors ranked by commit count
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <motion.div
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                      >
                        {contributors
                          .sort(
                            (a, b) =>
                              (b.contributions || 0) - (a.contributions || 0)
                          )
                          .map((contributor, index) => (
                            <motion.div
                              key={index}
                              variants={itemVariants}
                              whileHover={{
                                scale: 1.02,
                                x: 5,
                                boxShadow:
                                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                              }}
                              transition={{ type: "spring", stiffness: 400 }}
                              className="flex items-center space-x-4 p-4 rounded-lg border border-border bg-card/60 backdrop-blur-sm shadow-sm hover:border-primary/20"
                            >
                              <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold shadow-md ${
                                  index === 0
                                    ? "bg-amber-500 text-white"
                                    : index === 1
                                    ? "bg-slate-400 text-white"
                                    : index === 2
                                    ? "bg-amber-700 text-white"
                                    : "bg-primary text-primary-foreground"
                                }`}
                              >
                                {index + 1}
                              </div>
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                              >
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
                              </motion.div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground flex items-center">
                                  {contributor.name || contributor.login}
                                  <a
                                    href={`https://github.com/${contributor.login}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-muted-foreground hover:text-primary inline-flex"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
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
                            </motion.div>
                          ))}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* Empty state */}
        {!searchPerformed && (
          <motion.div
            className="text-center py-12 my-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="mb-8 relative w-48 h-48 mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 blur-xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <motion.div className="relative">
                <Github className="w-24 h-24 mx-auto text-primary mb-4" />
              </motion.div>
            </motion.div>
            <motion.h2
              className="text-2xl font-bold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Analyze GitHub Repository Contributions
            </motion.h2>
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Enter a GitHub username and repository name in the format
              "username/repository" to analyze contributions from all
              collaborators. See detailed statistics about commits, pull
              requests, and code changes.
            </motion.p>
          </motion.div>
        )}

        {/* No results state */}
        {searchPerformed && !loading && contributors.length === 0 && !error && (
          <motion.div
            className="text-center py-12 my-8 bg-muted/50 rounded-lg border border-border backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            </motion.div>
            <h2 className="text-xl font-semibold mb-2">
              No Contributors Found
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any contributors for the repository "{username}/
              {repo}". Please check the repository name and try again.
            </p>
          </motion.div>
        )}
      </div>

      <motion.footer
        className="mt-auto border-t border-border bg-card py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <motion.div
                className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <GitBranch className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <span className="text-sm font-medium text-foreground">
                GitHub Contribution Analyzer
              </span>
            </div>
            <div className="text-sm text-muted-foreground flex items-center">
              <span>
                © {new Date().getFullYear()} · Built with React and Tailwind CSS
              </span>
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="w-4 h-4" />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}

export default App;
