import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Search, 
  FileText, 
  Image as ImageIcon, 
  Video as VideoIcon,
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Fingerprint, 
  Activity,
  Upload,
  X,
  RefreshCw,
  Terminal,
  Newspaper,
  Globe,
  ExternalLink,
  Info,
  Lock,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { analyzeContent, verifyNews, VeritasResult, NewsVerificationResult } from "@/src/lib/gemini";
import { cn } from "@/lib/utils";

type AppMode = "forensic" | "news";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [mode, setMode] = useState<AppMode>("forensic");
  const [activeTab, setActiveTab] = useState("text");
  
  // Forensic State
  const [textInput, setTextInput] = useState("");
  const [mediaInput, setMediaInput] = useState<{ mimeType: string; data: string } | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [forensicResult, setForensicResult] = useState<VeritasResult | null>(null);
  
  // News State
  const [newsQuery, setNewsQuery] = useState("");
  const [isVerifyingNews, setIsVerifyingNews] = useState(false);
  const [newsResult, setNewsResult] = useState<NewsVerificationResult | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(",")[1];
        setMediaInput({ mimeType: file.type, data: base64Data });
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runForensicAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setForensicResult(null);
    try {
      const input = activeTab === "text" ? textInput : mediaInput;
      if (!input) throw new Error("Please provide input for analysis.");
      const data = await analyzeContent(input);
      setForensicResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runNewsVerification = async () => {
    if (!newsQuery.trim()) return;
    setIsVerifyingNews(true);
    setError(null);
    setNewsResult(null);
    try {
      const data = await verifyNews(newsQuery);
      setNewsResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsVerifyingNews(false);
    }
  };

  const reset = () => {
    setTextInput("");
    setMediaInput(null);
    setMediaPreview(null);
    setForensicResult(null);
    setNewsQuery("");
    setNewsResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center relative overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="scanline" />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-12 max-w-md"
            >
              <div className="space-y-2">
                <h1 className="text-6xl font-bold tracking-tighter uppercase">sach ai</h1>
                <p className="text-primary font-mono text-xs tracking-[0.3em] uppercase">Truth in the Age of Synthesis</p>
              </div>

              <div className="pt-4 space-y-6 flex flex-col items-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU0q7ZdQjxXx2bmydYiz2q0W7r3RwXCplO-w&s" 
                    alt="AICUF Logo" 
                    className="w-20 h-20 object-contain relative z-10"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest">
                  Developed by<br/>
                  <span className="text-foreground font-bold">nbsxc aicuf students</span>
                </p>
                <Button 
                  onClick={() => setShowSplash(false)}
                  className="rounded-full px-8 py-6 font-mono uppercase tracking-widest group"
                >
                  Initialize System
                  <Zap className="w-4 h-4 ml-2 group-hover:animate-pulse" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="scanline" />
      
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
      </div>

      <main className="w-full max-w-6xl z-10 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-primary/20 pb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/30"
              >
                <Shield className="w-20 h-20" />
              </motion.div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border border-primary/20 rounded-lg p-1.5 shadow-xl">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU0q7ZdQjxXx2bmydYiz2q0W7r3RwXCplO-w&s" 
                  alt="AICUF" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
                sach ai
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="font-mono text-[10px] border-primary/30 text-primary">v3.5 ENTERPRISE</Badge>
                <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em]">
                  Developed by nbsxc aicuf students
                </p>
              </div>
            </div>
          </div>

          <div className="flex bg-muted/50 p-1 rounded-xl border border-primary/10 backdrop-blur-md">
            <Button 
              variant={mode === "forensic" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setMode("forensic")}
              className="rounded-lg gap-2"
            >
              <Fingerprint className="w-4 h-4" /> Forensic
            </Button>
            <Button 
              variant={mode === "news" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setMode("news")}
              className="rounded-lg gap-2"
            >
              <Newspaper className="w-4 h-4" /> News Check
            </Button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {mode === "forensic" ? (
            <motion.div 
              key="forensic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Input Section */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="border-primary/20 bg-card/40 backdrop-blur-xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-primary" /> Forensic Buffer
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Analyze text, images, or videos for synthetic artifacts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/30 p-1">
                        <TabsTrigger value="text" className="gap-2"><FileText className="w-3.5 h-3.5" /> Text</TabsTrigger>
                        <TabsTrigger value="image" className="gap-2"><ImageIcon className="w-3.5 h-3.5" /> Image</TabsTrigger>
                        <TabsTrigger value="video" className="gap-2"><VideoIcon className="w-3.5 h-3.5" /> Video</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="text">
                        <textarea
                          className="w-full h-56 p-4 bg-muted/20 border border-primary/10 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                          placeholder="Paste content for deep structural analysis..."
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                        />
                      </TabsContent>
                      
                      <TabsContent value="image" className="space-y-4">
                        <div 
                          className={cn(
                            "w-full h-56 border-2 border-dashed border-primary/10 rounded-xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer hover:bg-primary/5 hover:border-primary/30 group",
                            mediaPreview && "border-none p-0 overflow-hidden"
                          )}
                          onClick={() => !mediaPreview && fileInputRef.current?.click()}
                        >
                          {mediaPreview ? (
                            <div className="relative w-full h-full group">
                              <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <Button variant="destructive" size="sm" className="rounded-full" onClick={(e) => { e.stopPropagation(); reset(); }}>
                                  <X className="w-4 h-4 mr-1" /> Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="p-4 bg-primary/5 rounded-full group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-primary/40" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-semibold">Upload Forensic Target</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">PNG, JPG, WEBP (MAX 10MB)</p>
                              </div>
                            </>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="video" className="space-y-4">
                        <div 
                          className={cn(
                            "w-full h-56 border-2 border-dashed border-primary/10 rounded-xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer hover:bg-primary/5 hover:border-primary/30 group",
                            mediaPreview && mediaInput?.mimeType.startsWith('video') && "border-none p-0 overflow-hidden"
                          )}
                          onClick={() => !mediaPreview && fileInputRef.current?.click()}
                        >
                          {mediaPreview && mediaInput?.mimeType.startsWith('video') ? (
                            <div className="relative w-full h-full group">
                              <video src={mediaPreview} className="w-full h-full object-cover" controls />
                              <div className="absolute top-2 right-2 z-20">
                                <Button variant="destructive" size="icon" className="rounded-full h-8 w-8" onClick={(e) => { e.stopPropagation(); reset(); }}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="p-4 bg-primary/5 rounded-full group-hover:scale-110 transition-transform">
                                <VideoIcon className="w-8 h-8 text-primary/40" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-semibold">Upload Video Stream</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">MP4, MOV, WEBM (MAX 20MB)</p>
                              </div>
                            </>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>

                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept={activeTab === "image" ? "image/*" : "video/*"} 
                      onChange={handleMediaUpload} 
                    />

                    <div className="mt-8 flex gap-3">
                      <Button 
                        className="flex-1 font-mono uppercase tracking-widest py-6 shadow-xl shadow-primary/20" 
                        disabled={isAnalyzing || (activeTab === "text" ? !textInput : !mediaInput)}
                        onClick={runForensicAnalysis}
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2 fill-current" />
                            Analyze Target
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {error && (
                  <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-xs uppercase font-bold">System Error</AlertTitle>
                    <AlertDescription className="text-[10px] font-mono opacity-80">{error}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Results Section */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
                    <motion.div
                      key="analyzing"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      className="h-full flex flex-col items-center justify-center space-y-8 min-h-[500px] bg-card/20 rounded-3xl border border-primary/5"
                    >
                      <div className="relative">
                        <div className="w-40 h-40 border-4 border-primary/10 rounded-full" />
                        <motion.div 
                          className="absolute inset-0 w-40 h-40 border-t-4 border-primary rounded-full shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Cpu className="w-16 h-16 text-primary animate-pulse" />
                        </div>
                      </div>
                      <div className="text-center space-y-4">
                        <h3 className="text-2xl font-bold uppercase tracking-[0.3em] text-primary">Scanning</h3>
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono text-muted-foreground animate-pulse">EXTRACTING TEMPORAL FEATURES...</p>
                          <p className="text-[10px] font-mono text-muted-foreground animate-pulse delay-75">MAPPING BIOMETRIC VECTORS...</p>
                          <p className="text-[10px] font-mono text-muted-foreground animate-pulse delay-150">NEURAL PATTERN MATCHING...</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : forensicResult ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <Card className="border-primary/20 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                        <div className={cn(
                          "h-2 w-full",
                          forensicResult.authenticity_score > 0.7 ? "bg-green-500" : forensicResult.authenticity_score > 0.4 ? "bg-yellow-500" : "bg-red-500"
                        )} />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                          <div className="space-y-1">
                            <CardTitle className="text-lg font-mono uppercase tracking-wider flex items-center gap-2">
                              <Fingerprint className="w-5 h-5 text-primary" /> Analysis Verdict
                            </CardTitle>
                            <CardDescription className="text-xs">
                              Target classification and authenticity metrics.
                            </CardDescription>
                          </div>
                          <Badge 
                            variant={forensicResult.authenticity_score > 0.7 ? "default" : "destructive"} 
                            className="uppercase font-mono text-[10px] px-3 py-1"
                          >
                            {forensicResult.classification}
                          </Badge>
                        </CardHeader>
                        <CardContent className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                              <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                                <span>Authenticity Score</span>
                                <span className="text-foreground font-bold">{(forensicResult.authenticity_score * 100).toFixed(1)}%</span>
                              </div>
                              <Progress value={forensicResult.authenticity_score * 100} className="h-2.5 bg-primary/10" />
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                                <span>Confidence Interval</span>
                                <span className="text-foreground font-bold">{forensicResult.confidence_interval}%</span>
                              </div>
                              <Progress value={forensicResult.confidence_interval} className="h-2.5 bg-primary/10" />
                            </div>
                          </div>

                          <div className="bg-muted/30 p-6 rounded-2xl border border-primary/5 space-y-4">
                            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2 text-primary">
                              <Activity className="w-3.5 h-3.5" /> Technical Summary
                            </h4>
                            <p className="text-sm leading-relaxed font-medium italic text-foreground/80">
                              "{forensicResult.technical_summary}"
                            </p>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2 text-muted-foreground">
                              <AlertTriangle className="w-3.5 h-3.5" /> Forensic Anomalies
                            </h4>
                            <ScrollArea className="h-[160px] w-full rounded-2xl border border-primary/10 p-5 bg-muted/10">
                              <ul className="space-y-3">
                                {forensicResult.red_flags.map((flag, i) => (
                                  <li key={i} className="text-xs font-mono flex items-start gap-3 text-foreground/70">
                                    <span className="text-primary font-bold">[{i+1}]</span>
                                    {flag}
                                  </li>
                                ))}
                                {forensicResult.red_flags.length === 0 && (
                                  <li className="text-xs font-mono text-green-500 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    No significant synthetic artifacts detected.
                                  </li>
                                )}
                              </ul>
                            </ScrollArea>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center space-y-6 min-h-[500px] border-2 border-dashed border-primary/5 rounded-[2rem] bg-muted/5">
                      <div className="relative">
                        <Shield className="w-24 h-24 text-primary/5" />
                        <motion.div 
                          className="absolute inset-0 border border-primary/20 rounded-full"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-muted-foreground/40">Awaiting Signal</h3>
                        <p className="text-xs text-muted-foreground/30 max-w-[320px] font-mono uppercase tracking-tighter">
                          Initialize forensic buffer to begin content authentication sequence.
                        </p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="news"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <Card className="border-primary/20 bg-card/40 backdrop-blur-xl shadow-2xl max-w-3xl mx-auto">
                <CardHeader className="text-center">
                  <div className="mx-auto p-4 bg-primary/10 rounded-2xl w-fit mb-4">
                    <Globe className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold uppercase tracking-tighter">News Verification Engine</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-widest font-mono">
                    Cross-referencing global databases for official confirmation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative">
                    <Input 
                      className="py-8 pl-14 pr-32 bg-muted/30 border-primary/10 rounded-2xl text-lg font-medium focus:ring-primary/20"
                      placeholder="Enter news claim or headline to verify..."
                      value={newsQuery}
                      onChange={(e) => setNewsQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && runNewsVerification()}
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/40" />
                    <Button 
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-6"
                      disabled={isVerifyingNews || !newsQuery.trim()}
                      onClick={runNewsVerification}
                    >
                      {isVerifyingNews ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-8 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    <div className="flex items-center gap-2"><Lock className="w-3 h-3" /> Encrypted Search</div>
                    <div className="flex items-center gap-2"><Globe className="w-3 h-3" /> Multi-Source</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> Official Sources</div>
                  </div>
                </CardContent>
              </Card>

              <AnimatePresence mode="wait">
                {isVerifyingNews ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 space-y-6"
                  >
                    <div className="flex gap-2">
                      {[0, 1, 2].map(i => (
                        <motion.div 
                          key={i}
                          className="w-3 h-3 bg-primary rounded-full"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary animate-pulse">Querying Global News Repositories...</p>
                  </motion.div>
                ) : newsResult ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                  >
                    <div className="lg:col-span-8 space-y-6">
                      <Card className="border-primary/20 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                        <div className={cn(
                          "h-2 w-full",
                          newsResult.is_official ? "bg-green-500" : "bg-red-500"
                        )} />
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                              {newsResult.is_official ? (
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                              ) : (
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                              )}
                              {newsResult.verdict}
                            </CardTitle>
                            <CardDescription className="text-xs font-mono uppercase tracking-widest">
                              Credibility Score: {newsResult.credibility_score}/100
                            </CardDescription>
                          </div>
                          <Badge variant={newsResult.is_official ? "default" : "destructive"} className="uppercase">
                            {newsResult.is_official ? "Official" : "Unofficial"}
                          </Badge>
                        </CardHeader>
                        <CardContent className="space-y-8">
                          <div className="bg-muted/30 p-6 rounded-2xl border border-primary/5 space-y-4">
                            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2 text-primary">
                              <Info className="w-3.5 h-3.5" /> Technical Analysis
                            </h4>
                            <p className="text-sm leading-relaxed text-foreground/80">
                              {newsResult.technical_analysis}
                            </p>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2 text-muted-foreground">
                              <Search className="w-3.5 h-3.5" /> Key Findings
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {newsResult.key_findings.map((finding, i) => (
                                <div key={i} className="p-4 bg-muted/20 rounded-xl border border-primary/5 text-xs font-medium flex gap-3">
                                  <span className="text-primary font-bold">0{i+1}</span>
                                  {finding}
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                      <Card className="border-primary/20 bg-card/40 backdrop-blur-xl shadow-2xl">
                        <CardHeader>
                          <CardTitle className="text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" /> Evidence Sources
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-4">
                              {newsResult.evidence_sources.map((source, i) => (
                                <motion.div 
                                  key={i}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="p-4 bg-muted/30 rounded-xl border border-primary/5 space-y-2 group hover:bg-primary/5 transition-colors"
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <h5 className="text-xs font-bold leading-tight group-hover:text-primary transition-colors">{source.title}</h5>
                                    <Badge variant="outline" className={cn(
                                      "text-[8px] uppercase px-1.5 py-0",
                                      source.reliability === "High" ? "text-green-500 border-green-500/30" : "text-yellow-500 border-yellow-500/30"
                                    )}>
                                      {source.reliability}
                                    </Badge>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground line-clamp-2 italic">"{source.snippet}"</p>
                                  <a 
                                    href={source.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[9px] font-mono text-primary flex items-center gap-1 hover:underline pt-1"
                                  >
                                    <ExternalLink className="w-2.5 h-2.5" /> Source Protocol
                                  </a>
                                </motion.div>
                              ))}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest border-t border-primary/10 pt-8 pb-12 z-10">
        <div className="flex items-center gap-4">
          <span>© 2026 sach ai Systems</span>
          <Separator orientation="vertical" className="h-3 bg-primary/20" />
          <span className="text-primary">Global Authentication Network</span>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span>Node: 0x8F2A-sach</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3" />
            <span>End-to-End Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
