import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Send, Sparkles, Database, Code, Zap } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      setIsLoading(true);
      
      // Simulate API call with loading state
      setTimeout(() => {
        setIsLoading(false);
        // Navigate to mastermind app with the idea
        navigate("/mastermind", { state: { idea: message } });
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Modern Stack",
      description: "Built with React, TypeScript, Electron & FastAPI"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "SQLite Integration",
      description: "Seamless database operations with full CRUD support"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized performance with hot reload development"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ElectronStack
            </span>
          </div>          <div className="hidden md:flex space-x-6">
            <Button variant="ghost" onClick={() => navigate("/home")}>
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate("/database")}>
              Database
            </Button>
            <Button variant="ghost" onClick={() => navigate("/mastermind")}>
              Mastermind.ai
            </Button>
            <Button variant="outline">
              Documentation
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-10">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Full-Stack Desktop Application Template
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent leading-tight">
            Build Amazing
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Desktop Apps
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            A modern, full-stack template combining React, Electron, FastAPI, and SQLite. 
            Everything you need to build powerful desktop applications.
          </p>
        </div>

        {/* ChatGPT-style Input Field */}
        <div className="w-full max-w-3xl mx-auto mb-12">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={message}                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your business idea... (e.g., AI-powered gym coach app)"
                  className="w-full resize-none border-0 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 text-lg leading-relaxed max-h-32"
                  rows={1}
                  style={{
                    minHeight: "24px",
                    height: "auto",
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "24px";
                    target.style.height = target.scrollHeight + "px";
                  }}
                />
              </div>              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl px-3 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
            {isLoading ? "Generating mind map..." : "Press Enter to send, Shift + Enter for new line"}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 ml-3">
                  {feature.title}
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button
            size="lg"
            onClick={() => navigate("/mastermind")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Mastermind.ai
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/home")}
            className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-3 rounded-xl font-medium transition-all duration-200"
          >
            View Template Demo
          </Button>
        </div>
      </main>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default LandingPage;
