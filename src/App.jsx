import {
  Search,
  Download,
  Trophy,
  GitBranch,
  FileText,
  Star,
  Users,
  TrendingUp,
  Calendar,
  BarChart3,
  LucidePieChart as RechartsPieChart,
  Bell as Cell,
} from "lucide-react";
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
import ThemeToggle from "./components/ThemeToggle";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";

// Dummy data for demonstration
const contributorsData = [
  {
    id: 1,
    name: "Sarah Chen",
    username: "sarahc",
    avatar: "/developer-woman.png",
    commits: 127,
    linesAdded: 8420,
    linesRemoved: 2341,
    score: 94,
    badges: ["Feature Hero", "Code Quality"],
    contributions: [
      { date: "2024-01", commits: 15 },
      { date: "2024-02", commits: 22 },
      { date: "2024-03", commits: 18 },
      { date: "2024-04", commits: 25 },
      { date: "2024-05", commits: 20 },
      { date: "2024-06", commits: 27 },
    ],
  },
  {
    id: 2,
    name: "Alex Rodriguez",
    username: "alexr",
    avatar: "/developer-man.png",
    commits: 89,
    linesAdded: 5230,
    linesRemoved: 1876,
    score: 87,
    badges: ["Bug Fixer", "Reviewer"],
    contributions: [
      { date: "2024-01", commits: 12 },
      { date: "2024-02", commits: 16 },
      { date: "2024-03", commits: 14 },
      { date: "2024-04", commits: 18 },
      { date: "2024-05", commits: 15 },
      { date: "2024-06", commits: 14 },
    ],
  },
  {
    id: 3,
    name: "Maya Patel",
    username: "mayap",
    avatar: "/placeholder-pkuk3.png",
    commits: 156,
    linesAdded: 12340,
    linesRemoved: 4521,
    score: 92,
    badges: ["Doc Master", "Feature Hero"],
    contributions: [
      { date: "2024-01", commits: 20 },
      { date: "2024-02", commits: 28 },
      { date: "2024-03", commits: 24 },
      { date: "2024-04", commits: 32 },
      { date: "2024-05", commits: 26 },
      { date: "2024-06", commits: 26 },
    ],
  },
  {
    id: 4,
    name: "David Kim",
    username: "davidk",
    avatar: "/placeholder-3fjvb.png",
    commits: 73,
    linesAdded: 3890,
    linesRemoved: 1234,
    score: 78,
    badges: ["Tester", "Bug Fixer"],
    contributions: [
      { date: "2024-01", commits: 8 },
      { date: "2024-02", commits: 12 },
      { date: "2024-03", commits: 10 },
      { date: "2024-04", commits: 15 },
      { date: "2024-05", commits: 14 },
      { date: "2024-06", commits: 14 },
    ],
  },
];

const pieChartData = [
  { name: "Sarah Chen", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Maya Patel", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Alex Rodriguez", value: 22, color: "hsl(var(--chart-3))" },
  { name: "David Kim", value: 15, color: "hsl(var(--chart-4))" },
];

const timelineData = [
  { month: "Jan", Sarah: 15, Maya: 20, Alex: 12, David: 8 },
  { month: "Feb", Sarah: 22, Maya: 28, Alex: 16, David: 12 },
  { month: "Mar", Sarah: 18, Maya: 24, Alex: 14, David: 10 },
  { month: "Apr", Sarah: 25, Maya: 32, Alex: 18, David: 15 },
  { month: "May", Sarah: 20, Maya: 26, Alex: 15, David: 14 },
  { month: "Jun", Sarah: 27, Maya: 26, Alex: 14, David: 14 },
];

const badgeColors = {
  "Feature Hero": "bg-chart-1 text-white",
  "Bug Fixer": "bg-chart-5 text-white",
  "Doc Master": "bg-chart-2 text-white",
  "Code Quality": "bg-chart-3 text-white",
  Reviewer: "bg-chart-4 text-white",
  Tester: "bg-secondary text-secondary-foreground",
};

function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg shadow-md">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  GitHub Contribution Analyzer
                </h1>
                <p className="text-sm text-muted-foreground">
                  Fair contribution scoring beyond commit counts
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm hover:shadow"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Repository Input Section */}
        <Card className="border shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-primary" />
              <span>Repository Analysis</span>
            </CardTitle>
            <CardDescription>
              Enter a GitHub repository to analyze contributor fairness and
              workload distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="owner/repository-name"
                  className="text-base focus-visible:ring-primary"
                  defaultValue="facebook/react"
                />
              </div>
              <Button className="px-8 shadow-md hover:shadow-lg transition-shadow">
                <GitBranch className="w-4 h-4 mr-2" />
                Analyze Repository
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Contributors
                  </p>
                  <p className="text-3xl font-bold text-foreground">4</p>
                </div>
                <div className="p-3 rounded-full bg-chart-1/10">
                  <Users className="w-8 h-8 text-chart-1" />
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
                  <p className="text-3xl font-bold text-foreground">445</p>
                </div>
                <div className="p-3 rounded-full bg-chart-2/10">
                  <GitBranch className="w-8 h-8 text-chart-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Lines of Code
                  </p>
                  <p className="text-3xl font-bold text-foreground">29.9K</p>
                </div>
                <div className="p-3 rounded-full bg-chart-3/10">
                  <FileText className="w-8 h-8 text-chart-3" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Score
                  </p>
                  <p className="text-3xl font-bold text-foreground">87.8</p>
                </div>
                <div className="p-3 rounded-full bg-chart-4/10">
                  <Star className="w-8 h-8 text-chart-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="contributors" className="space-y-6">
          <div className="bg-card rounded-lg p-1 shadow-sm border">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="contributors"
                className="data-[state=active]:shadow-md"
              >
                Contributors
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="data-[state=active]:shadow-md"
              >
                Visual Insights
              </TabsTrigger>
              <TabsTrigger
                value="leaderboard"
                className="data-[state=active]:shadow-md"
              >
                Leaderboard
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:shadow-md"
              >
                Timeline
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Contributors Tab */}
          <TabsContent value="contributors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {contributorsData.map((contributor) => (
                <Card
                  key={contributor.id}
                  className="border shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12 border-2 border-primary shadow-md">
                        <AvatarImage
                          src={contributor.avatar || "/placeholder.svg"}
                          alt={contributor.name}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                          {contributor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">
                            {contributor.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            @{contributor.username}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="bg-background p-2 rounded-md">
                            <p className="text-muted-foreground">Commits</p>
                            <p className="font-semibold text-foreground text-lg">
                              {contributor.commits}
                            </p>
                          </div>
                          <div className="bg-background p-2 rounded-md">
                            <p className="text-muted-foreground">Lines Added</p>
                            <p className="font-semibold text-chart-2 text-lg">
                              +{contributor.linesAdded.toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-background p-2 rounded-md">
                            <p className="text-muted-foreground">
                              Lines Removed
                            </p>
                            <p className="font-semibold text-chart-5 text-lg">
                              -{contributor.linesRemoved.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">
                              Contribution Score
                            </span>
                            <span className="text-sm font-semibold text-foreground">
                              {contributor.score}/100
                            </span>
                          </div>
                          <Progress value={contributor.score} className="h-2" />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {contributor.badges.map((badge) => (
                            <Badge
                              key={badge}
                              className={`${
                                badgeColors[badge] ||
                                "bg-secondary text-secondary-foreground"
                              } shadow-sm`}
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Visual Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <RechartsPieChart className="w-5 h-5 text-primary" />
                    <span>Contribution Distribution</span>
                  </CardTitle>
                  <CardDescription>
                    Percentage of total project work by contributor
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-80 chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        className="recharts-pie-custom"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span>Monthly Contributions</span>
                  </CardTitle>
                  <CardDescription>
                    Commit activity over the last 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-80 chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timelineData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          strokeOpacity={0.8}
                        />
                        <XAxis
                          dataKey="month"
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="Sarah"
                          stackId="1"
                          stroke="hsl(var(--chart-1))"
                          fill="hsl(var(--chart-1))"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="Maya"
                          stackId="1"
                          stroke="hsl(var(--chart-2))"
                          fill="hsl(var(--chart-2))"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="Alex"
                          stackId="1"
                          stroke="hsl(var(--chart-3))"
                          fill="hsl(var(--chart-3))"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="David"
                          stackId="1"
                          stroke="hsl(var(--chart-4))"
                          fill="hsl(var(--chart-4))"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="border shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span>Contribution Leaderboard</span>
                </CardTitle>
                <CardDescription>
                  Contributors ranked by fair contribution score
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  {contributorsData
                    .sort((a, b) => b.score - a.score)
                    .map((contributor, index) => (
                      <div
                        key={contributor.id}
                        className="flex items-center space-x-4 p-4 rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shadow-md">
                          {index + 1}
                        </div>
                        <Avatar className="w-10 h-10 border-2 border-primary/50 shadow-md">
                          <AvatarImage
                            src={contributor.avatar || "/placeholder.svg"}
                            alt={contributor.name}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                            {contributor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">
                            {contributor.name}
                          </h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {contributor.badges.map((badge) => (
                              <Badge
                                key={badge}
                                variant="secondary"
                                className="text-xs shadow-sm"
                              >
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">
                            {contributor.score}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            score
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className="border shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Contribution Timeline</span>
                </CardTitle>
                <CardDescription>
                  Individual contributor activity over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-96 chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        strokeOpacity={0.8}
                      />
                      <XAxis
                        dataKey="month"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Sarah"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={3}
                        dot={{
                          fill: "hsl(var(--chart-1))",
                          strokeWidth: 2,
                          r: 4,
                        }}
                        activeDot={{
                          r: 6,
                          stroke: "hsl(var(--chart-1))",
                          strokeWidth: 2,
                          fill: "hsl(var(--background))",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Maya"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={3}
                        dot={{
                          fill: "hsl(var(--chart-2))",
                          strokeWidth: 2,
                          r: 4,
                        }}
                        activeDot={{
                          r: 6,
                          stroke: "hsl(var(--chart-2))",
                          strokeWidth: 2,
                          fill: "hsl(var(--background))",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Alex"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={3}
                        dot={{
                          fill: "hsl(var(--chart-3))",
                          strokeWidth: 2,
                          r: 4,
                        }}
                        activeDot={{
                          r: 6,
                          stroke: "hsl(var(--chart-3))",
                          strokeWidth: 2,
                          fill: "hsl(var(--background))",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="David"
                        stroke="hsl(var(--chart-4))"
                        strokeWidth={3}
                        dot={{
                          fill: "hsl(var(--chart-4))",
                          strokeWidth: 2,
                          r: 4,
                        }}
                        activeDot={{
                          r: 6,
                          stroke: "hsl(var(--chart-4))",
                          strokeWidth: 2,
                          fill: "hsl(var(--background))",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="mt-12 border-t border-border bg-card py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">
                GitHub Contribution Analyzer
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 · Built with React and Tailwind CSS
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
