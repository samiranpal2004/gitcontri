import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
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
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
console.log("GitHub Token available:", !!GITHUB_TOKEN);
console.log("API Base URL:", API_BASE_URL);

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
        `${API_BASE_URL}/api/contributors/${newUsername}/${newRepo}`
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
          `${API_BASE_URL}/api/stats/${newUsername}/${newRepo}`
        );
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log("Stats data received:", statsData);
          setStats(statsData);

          // Enhance contributors with stats data if possible
          if (statsData && Array.isArray(statsData)) {
            const enhancedContributors = contributorsData.map((contributor) => {
              const contributorStats = statsData.find(
                (s) => s.username === contributor.login
              );
              if (contributorStats) {
                return {
                  ...contributor,
                  contributions:
                    contributorStats.commits || contributor.contributions || 0, // Use commits from stats if available
                  additions: contributorStats.additions || 0,
                  deletions: contributorStats.deletions || 0,
                  features: contributorStats.features || 0,
                  bugfixes: contributorStats.bugfixes || 0,
                };
              }
              return contributor;
            });
            setContributors(enhancedContributors);
          }
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
    console.log("Calculating totals...");
    let totals = {
      commits: 0,
      additions: 0,
      deletions: 0,
      pullRequests: 0,
      features: 0,
      bugfixes: 0,
    };

    // Use stats API data if available
    if (stats && Array.isArray(stats) && stats.length > 0) {
      console.log("Using stats API data for totals");
      stats.forEach((contributor) => {
        totals.commits += contributor.commits || 0;
        totals.additions += contributor.additions || 0;
        totals.deletions += contributor.deletions || 0;
        totals.pullRequests += contributor.pull_requests || 0;
        totals.features += contributor.features || 0;
        totals.bugfixes += contributor.bugfixes || 0;
      });
      return totals;
    }

    // Otherwise use contributors data
    if (contributors && contributors.length > 0) {
      console.log("Using contributors data for totals");
      contributors.forEach((contributor) => {
        totals.commits += contributor.contributions || 0;
        totals.additions += contributor.additions || 0;
        totals.deletions += contributor.deletions || 0;
        totals.pullRequests += contributor.pull_requests || 0;
        totals.features += contributor.features || 0;
        totals.bugfixes += contributor.bugfixes || 0;
      });
    }

    console.log("Calculated totals:", totals);
    return totals;
  };

  // Calculate contribution percentage for visualizations
  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Get the totals for all metrics
  const totals = calculateTotals();

  // Prepare data for charts
  const prepareContributionChartData = () => {
    // Create data for top contributors only
    return contributors
      .slice(0, 5)
      .map((contributor) => ({
        name: contributor.login,
        commits: contributor.contributions || 0,
        features: contributor.features || 0,
        bugfixes: contributor.bugfixes || 0,
      }))
      .sort(
        (a, b) =>
          b.commits +
          b.features +
          b.bugfixes -
          (a.commits + a.features + a.bugfixes)
      );
  };

  const preparePieChartData = () => {
    const totalAdditions = contributors.reduce(
      (sum, c) => sum + (c.additions || 0),
      0
    );
    const totalDeletions = contributors.reduce(
      (sum, c) => sum + (c.deletions || 0),
      0
    );

    return [
      { name: "Added", value: totalAdditions, color: "#22c55e" },
      { name: "Deleted", value: totalDeletions, color: "#ef4444" },
    ];
  };

  const prepareFeaturesBugsData = () => {
    return [
      { name: "Features", value: totals.features, color: "#eab308" },
      { name: "Bugfixes", value: totals.bugfixes, color: "#8b5cf6" },
    ];
  };

  return (
    <motion.div
      className="min-h-screen bg-background flex flex-col"
      initial="hidden"
      animate="show"
      exit="exit"
      variants={pageTransition}
    >
      <motion.header
        className=" bg-[#fbffd4] sticky top-0 z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                className="flex items-center justify-center w-10 h-10 bg-gradient-primary shadow-md"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <GitBranch className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Commit Scope
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
                    className="text-base focus-visible:ring-black bg-background/60 backdrop-blur-sm rounded-[4px]"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type="submit"
                    className="px-8  rounded-[6px] shadow-none hover:-translate-y-[3px] hover:-translate-x-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,_0,_0)]  transition-all duration-200 bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black "
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
                    className="mt-3 p-3 bg-destructive/10 text-destructive"
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 xl:gap-4 mx-auto w-full"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div
              custom={0}
              variants={statsCardVariants}
              className="w-full"
            >
              <Card
                className="border shadow-[6px_6px_0px_0px_rgba(0,_0,_0)]
  transition-all duration-300 hover:scale-[1.01] bg-card overflow-hidden h-full min-h-[160px] flex flex-col"
              >
                <CardContent className="p-6 flex-grow flex flex-col justify-center">
                  <div className="flex items-center justify-between h-full">
                    <div className="flex flex-col justify-between min-h-[80px]">
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Contributors
                      </p>
                      <p className="text-4xl font-bold text-foreground mt-auto">
                        {contributors.length}
                      </p>
                    </div>
                    <motion.div
                      className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center w-14 h-14 self-center"
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

            <motion.div
              custom={1}
              variants={statsCardVariants}
              className="w-full"
            >
              <Card
                className="border shadow-[6px_6px_0px_0px_rgba(0,_0,_0)]
  transition-all duration-300 hover:scale-[1.01] bg-card overflow-hidden h-full min-h-[160px] flex flex-col"
              >
                <CardContent className="p-6 flex-grow flex flex-col justify-center">
                  <div className="flex items-center justify-between h-full">
                    <div className="flex flex-col justify-between min-h-[80px]">
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Commits
                      </p>
                      <p className="text-4xl font-bold text-foreground mt-auto">
                        {totals.commits}
                      </p>
                    </div>
                    <motion.div
                      className="p-3 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center w-14 h-14 self-center"
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

            <motion.div
              custom={2}
              variants={statsCardVariants}
              className="w-full"
            >
              <Card
                className="border shadow-[6px_6px_0px_0px_rgba(0,_0,_0)]
  transition-all duration-300 hover:scale-[1.01] bg-card overflow-hidden h-full min-h-[160px] flex flex-col"
              >
                <CardContent className="p-6 flex-grow flex flex-col justify-center">
                  <div className="flex items-center justify-between h-full">
                    <div className="flex flex-col justify-between min-h-[80px]">
                      <p className="text-sm font-medium text-muted-foreground">
                        Lines of Code Changed
                      </p>
                      <p className="text-4xl font-bold text-foreground mt-auto">
                        {(totals.additions + totals.deletions).toLocaleString()}
                      </p>
                    </div>
                    <motion.div
                      className="p-3 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center w-14 h-14 self-center"
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

            <motion.div
              custom={3}
              variants={statsCardVariants}
              className="w-full"
            >
              <Card
                className="border shadow-[6px_6px_0px_0px_rgba(0,_0,_0)]
  transition-all duration-300 hover:scale-[1.01] bg-card overflow-hidden h-full min-h-[160px] flex flex-col"
              >
                <CardContent className="p-6 flex-grow flex flex-col justify-center">
                  <div className="flex items-center justify-between h-full">
                    <div className="flex flex-col justify-between min-h-[80px]">
                      <p className="text-sm font-medium text-muted-foreground">
                        Pull Requests
                      </p>
                      <p className="text-4xl font-bold text-foreground mt-auto">
                        {totals.pullRequests}
                      </p>
                    </div>
                    <motion.div
                      className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center w-14 h-14 self-center"
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

            <motion.div
              custom={4}
              variants={statsCardVariants}
              className="w-full"
            >
              <Card
                className="border shadow-[6px_6px_0px_0px_rgba(0,_0,_0)]
  transition-all duration-300 hover:scale-[1.01] bg-card overflow-hidden h-full min-h-[160px] flex flex-col"
              >
                <CardContent className="p-6 flex-grow flex flex-col justify-center">
                  <div className="flex items-center justify-between h-full">
                    <div className="flex flex-col justify-between min-h-[80px]">
                      <p className="text-sm font-medium text-muted-foreground">
                        Features Added
                      </p>
                      <p className="text-4xl font-bold text-amber-500 mt-auto">
                        {totals.features}
                      </p>
                    </div>
                    <motion.div
                      className="p-3 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center w-14 h-14 self-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      <Code className="w-8 h-8 text-amber-500 dark:text-amber-300" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={5}
              variants={statsCardVariants}
              className="w-full"
            >
              <Card
                className="border shadow-[6px_6px_0px_0px_rgba(0,_0,_0)]
  transition-all duration-300 hover:scale-[1.01] bg-card overflow-hidden h-full min-h-[160px] flex flex-col"
              >
                <CardContent className="p-6 flex-grow flex flex-col justify-center">
                  <div className="flex items-center justify-between h-full">
                    <div className="flex flex-col justify-between min-h-[80px]">
                      <p className="text-sm font-medium text-muted-foreground">
                        Bugs Fixed
                      </p>
                      <p className="text-4xl font-bold text-accent mt-auto">
                        {totals.bugfixes}
                      </p>
                    </div>
                    <motion.div
                      className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center w-14 h-14 self-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      <Activity className="w-8 h-8 text-accent dark:text-accent" />
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
              <div>
                <TabsList>
                  {/* <TabsList className="grid w-full grid-cols-3"> */}
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
                  <TabsTrigger
                    value="codeAnalysis"
                    className="data-[state=active]:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Code Analysis
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Contributors Tab */}
              <TabsContent value="contributors" className="space-y-6">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto w-full"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {contributors.map((contributor, index) => (
                    <Card className="border shadow-none hover:-translate-y-[6px] hover:-translate-x-[6px] hover:shadow-[6px_6px_0px_0px_rgba(0,_0,_0)]  transition-all duration-300 overflow-hidden bg-gradient-card dark:bg-gradient-card-dark backdrop-blur-sm h-full flex flex-col">
                      <CardContent className="p-6 flex-grow">
                        <div className="flex items-start space-x-4 mb-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="flex-shrink-0"
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
                          <div className="flex-1 space-y-4 min-w-0">
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
                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-2 gap-4 text-sm h-[80px]">
                              <motion.div
                                className="bg-background/60 backdrop-blur-sm p-2 flex flex-col justify-between h-full"
                                whileHover={{ y: -3 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                }}
                              >
                                <p className="text-muted-foreground">Commits</p>
                                <p className="font-semibold text-foreground text-lg">
                                  {contributor.contributions || 0}
                                </p>
                              </motion.div>
                              <motion.div
                                className="bg-background/60 backdrop-blur-sm p-2 flex flex-col justify-between h-full"
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
                            {/* Code Changes Section */}
                            <div className="bg-background/60 backdrop-blur-sm p-3 h-[100px] flex flex-col">
                              <p className="text-sm font-medium text-foreground mb-2 flex items-center">
                                <FileText className="w-4 h-4 mr-1 text-primary" />
                                Code Changes
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                  <span className="text-xs text-muted-foreground">
                                    Added
                                  </span>
                                  <span className="ml-auto font-medium text-green-500">
                                    +
                                    {contributor.additions?.toLocaleString() ||
                                      0}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                  <span className="text-xs text-muted-foreground">
                                    Deleted
                                  </span>
                                  <span className="ml-auto font-medium text-red-500">
                                    -
                                    {contributor.deletions?.toLocaleString() ||
                                      0}
                                  </span>
                                </div>
                              </div>
                              <div className="h-2 bg-background rounded-full mt-2 overflow-hidden flex">
                                <motion.div
                                  className="h-full bg-green-500"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${calculatePercentage(
                                      contributor.additions || 0,
                                      (contributor.additions || 0) +
                                        (contributor.deletions || 0)
                                    )}%`,
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    ease: "easeOut",
                                  }}
                                />
                                <motion.div
                                  className="h-full bg-red-500"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${calculatePercentage(
                                      contributor.deletions || 0,
                                      (contributor.additions || 0) +
                                        (contributor.deletions || 0)
                                    )}%`,
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    ease: "easeOut",
                                  }}
                                />
                              </div>
                            </div>
                            {/* Features & Bugs Section */}
                            <div className="grid grid-cols-2 gap-4 text-sm h-[80px]">
                              <motion.div
                                className="bg-background/60 backdrop-blur-sm p-2 flex flex-col justify-between h-full"
                                whileHover={{ y: -3 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                }}
                              >
                                <div className="flex items-center mb-1">
                                  <Star className="w-3 h-3 text-amber-500 mr-1" />
                                  <p className="text-muted-foreground text-xs">
                                    Features Added
                                  </p>
                                </div>
                                <p className="font-semibold text-amber-500 text-lg">
                                  {contributor.features || 0}
                                </p>
                              </motion.div>
                              <motion.div
                                className="bg-background/60 backdrop-blur-sm p-2 flex flex-col justify-between h-full"
                                whileHover={{ y: -3 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                }}
                              >
                                <div className="flex items-center mb-1">
                                  <Activity className="w-3 h-3 text-accent mr-1" />
                                  <p className="text-muted-foreground text-xs">
                                    Bugs Fixed
                                  </p>
                                </div>
                                <p className="font-semibold text-accent text-lg">
                                  {contributor.bugfixes || 0}
                                </p>
                              </motion.div>
                            </div>{" "}
                            <div className="mt-4">
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
                            <div className="flex flex-wrap gap-2 mt-4">
                              {contributor.contributions >
                                totals.commits * 0.3 && (
                                <Badge className="bg-gradient-primary text-white shadow-sm">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Top Contributor
                                </Badge>
                              )}
                              {stats &&
                                stats.find(
                                  (s) => s.username === contributor.login
                                )?.features > 0 && (
                                  <Badge className="bg-amber-500 text-white shadow-sm">
                                    <Star className="w-3 h-3 mr-1" />
                                    Feature Developer
                                  </Badge>
                                )}
                              {stats &&
                                stats.find(
                                  (s) => s.username === contributor.login
                                )?.bugfixes > 0 && (
                                  <Badge className="bg-accent text-white shadow-sm">
                                    <Activity className="w-3 h-3 mr-1" />
                                    Bug Fixer
                                  </Badge>
                                )}
                              {contributor.additions + contributor.deletions >
                                1000 && (
                                <Badge className="bg-green-500 text-white shadow-sm">
                                  <FileText className="w-3 h-3 mr-1" />
                                  Code Writer
                                </Badge>
                              )}
                              {Math.floor(
                                (contributor.pull_requests || 0) * 0.7
                              ) > 3 && (
                                <Badge className="bg-green-500 text-white shadow-sm">
                                  <Activity className="w-3 h-3 mr-1" />
                                  Feature Developer
                                </Badge>
                              )}
                              {Math.floor(
                                (contributor.pull_requests || 0) * 0.3
                              ) > 2 && (
                                <Badge className="bg-blue-500 text-white shadow-sm">
                                  <Code className="w-3 h-3 mr-1" />
                                  Bug Fixer
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
                  <Card
                    className="border shadow-[6px_6px_0px_0px_rgba(0,_0,_0)]
  transition-all duration-300 overflow-hidden bg-gradient-card dark:bg-gradient-card-dark backdrop-blur-sm"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <Crown className="w-5 h-5 text-primary" />
                        <span>Contribution Leaderboard</span>
                      </CardTitle>
                      <CardDescription>
                        Contributors ranked by contribution rate (percentage of
                        total commits)
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
                          .sort((a, b) => {
                            // Sort by contribution rate (percentage of total commits)
                            const aRate = calculatePercentage(
                              a.contributions || 0,
                              totals.commits
                            );
                            const bRate = calculatePercentage(
                              b.contributions || 0,
                              totals.commits
                            );
                            return bRate - aRate;
                          })
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
                              className="flex items-center space-x-4 p-4 border border-border bg-card/60 backdrop-blur-sm shadow-sm hover:border-primary/20"
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
                                    className="text-xs shadow-sm flex items-center"
                                  >
                                    <FileText className="w-3 h-3 mr-1" />
                                    {(contributor.additions || 0) +
                                      (contributor.deletions || 0)}{" "}
                                    lines
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs shadow-sm flex items-center"
                                  >
                                    <Star className="w-3 h-3 mr-1 text-amber-500" />
                                    {contributor.features || 0} features
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs shadow-sm flex items-center"
                                  >
                                    <Activity className="w-3 h-3 mr-1 text-accent" />
                                    {contributor.bugfixes || 0} fixes
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="text-xs shadow-sm flex items-center ml-auto"
                                  >
                                    Total:{" "}
                                    {(contributor.contributions || 0) +
                                      (contributor.features || 0) +
                                      (contributor.bugfixes || 0)}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right flex flex-col items-end">
                                <div className="text-2xl font-bold text-foreground">
                                  {calculatePercentage(
                                    contributor.contributions || 0,
                                    totals.commits
                                  )}
                                  %
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  contribution rate
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {contributor.contributions || 0} commits
                                </div>
                                <div className="w-24 h-2 bg-background rounded-full mt-2 overflow-hidden">
                                  <motion.div
                                    className="h-full bg-primary"
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
                                    }}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Code Analysis Tab */}
              <TabsContent value="codeAnalysis" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Code Contribution Card */}
                    <Card
                      className="border shadow-[6px_6px_0px_0px_rgba(0,_0,_0)]
  transition-all duration-300 overflow-hidden bg-gradient-card dark:bg-gradient-card-dark backdrop-blur-sm"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center space-x-2 text-lg">
                          <FileText className="w-5 h-5 text-primary" />
                          <span>Code Changes Analysis</span>
                        </CardTitle>
                        <CardDescription>
                          Lines added and deleted by contributors
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="mb-6 h-64">
                          <h4 className="text-sm font-medium mb-2">
                            Lines of Code Visualization
                          </h4>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={preparePieChartData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) =>
                                  `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                              >
                                {preparePieChartData().map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value) => value.toLocaleString()}
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-5">
                          {contributors
                            .sort(
                              (a, b) =>
                                (b.additions || 0) +
                                (b.deletions || 0) -
                                ((a.additions || 0) + (a.deletions || 0))
                            )
                            .slice(0, 5)
                            .map((contributor, index) => (
                              <div key={index} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Avatar className="w-6 h-6 mr-2">
                                      <AvatarImage
                                        src={
                                          contributor.avatar_url ||
                                          "/placeholder-user.jpg"
                                        }
                                        alt={contributor.login}
                                      />
                                      <AvatarFallback className="text-xs">
                                        {contributor.login
                                          ?.substring(0, 2)
                                          .toUpperCase() || "GH"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">
                                      {contributor.name || contributor.login}
                                    </span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-green-500 font-medium">
                                      +
                                      {contributor.additions?.toLocaleString() ||
                                        0}
                                    </span>
                                    <span className="mx-1 text-muted-foreground">
                                      /
                                    </span>
                                    <span className="text-red-500 font-medium">
                                      -
                                      {contributor.deletions?.toLocaleString() ||
                                        0}
                                    </span>
                                  </div>
                                </div>
                                <div className="h-2 bg-background rounded-full overflow-hidden flex">
                                  <motion.div
                                    className="h-full bg-green-500"
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${calculatePercentage(
                                        contributor.additions || 0,
                                        (contributor.additions || 0) +
                                          (contributor.deletions || 0)
                                      )}%`,
                                    }}
                                    transition={{
                                      duration: 0.8,
                                      ease: "easeOut",
                                    }}
                                  />
                                  <motion.div
                                    className="h-full bg-red-500"
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${calculatePercentage(
                                        contributor.deletions || 0,
                                        (contributor.additions || 0) +
                                          (contributor.deletions || 0)
                                      )}%`,
                                    }}
                                    transition={{
                                      duration: 0.8,
                                      ease: "easeOut",
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-border">
                          <h4 className="text-sm font-medium mb-2">
                            Total Code Changes
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background/60 backdrop-blur-sm p-3 flex flex-col items-center">
                              <div className="text-green-500 font-bold text-2xl">
                                +
                                {contributors
                                  .reduce(
                                    (sum, c) => sum + (c.additions || 0),
                                    0
                                  )
                                  .toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Lines Added
                              </div>
                            </div>
                            <div className="bg-background/60 backdrop-blur-sm p-3 flex flex-col items-center">
                              <div className="text-red-500 font-bold text-2xl">
                                -
                                {contributors
                                  .reduce(
                                    (sum, c) => sum + (c.deletions || 0),
                                    0
                                  )
                                  .toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Lines Deleted
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Features and Bugs Card */}
                    <Card
                      className="border shadow-[6px_6px_0px_0px_rgba(0,_0,_0)]
  transition-all duration-300 overflow-hidden bg-gradient-card dark:bg-gradient-card-dark backdrop-blur-sm"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center space-x-2 text-lg">
                          <Activity className="w-5 h-5 text-primary" />
                          <span>Features & Bug Fixes</span>
                        </CardTitle>
                        <CardDescription>
                          Features added and bugs fixed by contributors
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="mb-6 h-64">
                          <h4 className="text-sm font-medium mb-2">
                            Features vs Bugfixes
                          </h4>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={prepareFeaturesBugsData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) =>
                                  `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                              >
                                {prepareFeaturesBugsData().map(
                                  (entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={entry.color}
                                    />
                                  )
                                )}
                              </Pie>
                              <Tooltip
                                formatter={(value) => value.toLocaleString()}
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-5">
                          {contributors
                            .sort(
                              (a, b) =>
                                (b.pull_requests || 0) - (a.pull_requests || 0)
                            )
                            .slice(0, 5)
                            .map((contributor, index) => {
                              const featureCount =
                                (stats &&
                                  stats.find(
                                    (s) => s.username === contributor.login
                                  )?.features) ||
                                0;
                              const bugCount =
                                (stats &&
                                  stats.find(
                                    (s) => s.username === contributor.login
                                  )?.bugfixes) ||
                                0;
                              const total = featureCount + bugCount;

                              return (
                                <div key={index} className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <Avatar className="w-6 h-6 mr-2">
                                        <AvatarImage
                                          src={
                                            contributor.avatar_url ||
                                            "/placeholder-user.jpg"
                                          }
                                          alt={contributor.login}
                                        />
                                        <AvatarFallback className="text-xs">
                                          {contributor.login
                                            ?.substring(0, 2)
                                            .toUpperCase() || "GH"}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm font-medium">
                                        {contributor.name || contributor.login}
                                      </span>
                                    </div>
                                    <div className="text-sm">
                                      <span className="text-amber-500 font-medium">
                                        {featureCount} features
                                      </span>
                                      <span className="mx-1 text-muted-foreground">
                                        /
                                      </span>
                                      <span className="text-accent font-medium">
                                        {bugCount} fixes
                                      </span>
                                    </div>
                                  </div>
                                  <div className="h-2 bg-background rounded-full overflow-hidden flex">
                                    <motion.div
                                      className="h-full bg-amber-500"
                                      initial={{ width: 0 }}
                                      animate={{
                                        width:
                                          total > 0
                                            ? `${(featureCount / total) * 100}%`
                                            : "0%",
                                      }}
                                      transition={{
                                        duration: 0.8,
                                        ease: "easeOut",
                                      }}
                                    />
                                    <motion.div
                                      className="h-full bg-accent"
                                      initial={{ width: 0 }}
                                      animate={{
                                        width:
                                          total > 0
                                            ? `${(bugCount / total) * 100}%`
                                            : "0%",
                                      }}
                                      transition={{
                                        duration: 0.8,
                                        ease: "easeOut",
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                        </div>

                        <div className="mt-6 pt-4 border-t border-border">
                          <h4 className="text-sm font-medium mb-2">
                            Repository Summary
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background/60 backdrop-blur-sm p-3 flex flex-col items-center">
                              <div className="text-amber-500 font-bold text-2xl">
                                {totals.features || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Features Added
                              </div>
                            </div>
                            <div className="bg-background/60 backdrop-blur-sm p-3 flex flex-col items-center">
                              <div className="text-accent font-bold text-2xl">
                                {totals.bugfixes || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Bugs Fixed
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Top Contributors Bar Chart */}
                    <Card
                      className="border shadow-[6px_6px_0px_0px_rgba(0,_0,_0)]
  transition-all duration-300 overflow-hidden bg-gradient-card dark:bg-gradient-card-dark backdrop-blur-sm lg:col-span-2"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center space-x-2 text-lg">
                          <Users className="w-5 h-5 text-primary" />
                          <span>Top Contributors Activity</span>
                        </CardTitle>
                        <CardDescription>
                          Breakdown of commits, features, and bugfixes by top
                          contributors
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={prepareContributionChartData()}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="var(--border)"
                              />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "var(--background)",
                                  border: "1px solid var(--border)",
                                  borderRadius: "8px",
                                }}
                                formatter={(value) => [value, ""]}
                              />
                              <Legend
                                payload={[
                                  {
                                    value: "Commits",
                                    type: "rect",
                                    color: "var(--primary)",
                                  },
                                  {
                                    value: "Features",
                                    type: "rect",
                                    color: "var(--amber-500)",
                                  },
                                  {
                                    value: "Bugfixes",
                                    type: "rect",
                                    color: "var(--accent)",
                                  },
                                ]}
                              />
                              <Bar
                                dataKey="commits"
                                name="Commits"
                                fill="var(--primary)"
                                radius={[4, 4, 0, 0]}
                              >
                                <LabelList
                                  dataKey="commits"
                                  position="top"
                                  fill="var(--foreground)"
                                />
                              </Bar>
                              <Bar
                                dataKey="features"
                                name="Features"
                                fill="var(--amber-500)"
                                radius={[4, 4, 0, 0]}
                              >
                                <LabelList
                                  dataKey="features"
                                  position="top"
                                  fill="var(--foreground)"
                                />
                              </Bar>
                              <Bar
                                dataKey="bugfixes"
                                name="Bugfixes"
                                fill="var(--accent)"
                                radius={[4, 4, 0, 0]}
                              >
                                <LabelList
                                  dataKey="bugfixes"
                                  position="top"
                                  fill="var(--foreground)"
                                />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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
            className="text-center py-12 my-8 bg-muted/50 border border-border backdrop-blur-sm"
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
        className="mt-auto  bg-black text-white py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <motion.div
                className="w-8 h-8 bg-gradient-primary flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <GitBranch className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <span className="text-sm font-medium text-foreground">
                GitHub Contribution Analyzer
              </span>
            </div>
            <div className="text-sm text-accent-foreground flex items-center">
              <span>
                © {new Date().getFullYear()} · Built with React and Tailwind CSS
              </span>
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 text-accent-foreground "
                whileHover={{ scale: 1 }}
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
