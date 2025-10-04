import React, { useState, useEffect, useRef } from 'react'
import "./App.css"
import Navbar from './components/Navbar'
import Editor from '@monaco-editor/react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight';
import RingLoader from "react-spinners/RingLoader";
import {
  AlertTriangle,
  CheckCircle,
  ClipboardCopy,
  Code,
  Eraser,
  Key,
  MessageCircle,
  Sparkles,
  Wand2,
  XCircle,
  Zap
} from 'lucide-react';

const App = () => {
  const options = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'rust', label: 'Rust' },
    { value: 'dart', label: 'Dart' },
    { value: 'scala', label: 'Scala' },
    { value: 'perl', label: 'Perl' },
    { value: 'haskell', label: 'Haskell' },
    { value: 'elixir', label: 'Elixir' },
    { value: 'r', label: 'R' },
    { value: 'matlab', label: 'MATLAB' },
    { value: 'bash', label: 'Bash' }
  ];

  // Function to map our language values to Monaco Editor language identifiers
  const getMonacoLanguage = (languageValue) => {
    const languageMap = {
      'javascript': 'javascript',
      'python': 'python',
      'java': 'java',
      'csharp': 'csharp',
      'cpp': 'cpp',
      'c': 'cpp',
      'php': 'php',
      'ruby': 'ruby',
      'go': 'go',
      'swift': 'swift',
      'kotlin': 'kotlin',
      'typescript': 'typescript',
      'rust': 'rust',
      'dart': 'dart',
      'scala': 'scala',
      'perl': 'perl',
      'haskell': 'haskell',
      'elixir': 'elixir',
      'r': 'r',
      'matlab': 'matlab',
      'bash': 'shell'
    };
    return languageMap[languageValue] || 'javascript';
  };

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [apiKeyError, setApiKeyError] = useState("");
  const [apiKeyLoading, setApiKeyLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const DEFAULT_API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY || "";

  const [code, setCode] = useState("");
  const [markers, setMarkers] = useState([]);
  const [ai, setAi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [response, setResponse] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const responseRef = useRef(null);

  // Auto-dismiss notifications after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Auto-scroll response panel while streaming
  useEffect(() => {
    if (streaming && responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response, streaming]);

  // Load API key on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("google-genai-api-key");
    const keyToUse = savedApiKey || DEFAULT_API_KEY;
    if (keyToUse && keyToUse.trim() !== "") {
      initializeAI(keyToUse.trim());
    }
  }, []);

  // Initialize AI service with real validation
  const initializeAI = async (key, { saveKey = false } = {}) => {
    const trimmed = key.trim();
    if (!trimmed) {
      setApiKeyError("API key cannot be empty.");
      return;
    }

    setApiKeyLoading(true);
    setApiKeyError("");

    try {
      const genai = new GoogleGenerativeAI(trimmed);
      const model = genai.getGenerativeModel({ model: "gemini-3.6-flash" });
      await model.generateContent("Respond with only the word OK.");

      setAi(genai);
      setApiKey(trimmed);
      setShowApiKeyInput(false);
      setApiKeyError("");
      setNotification({ type: 'success', message: 'AI service activated successfully!' });

      if (saveKey) {
        localStorage.setItem("google-genai-api-key", trimmed);
      }
    } catch (error) {
      console.error("Failed to initialize AI service:", error);
      const msg = error.message || error.toString();
      if (msg.includes("API_KEY_INVALID") || msg.includes("401") || msg.includes("UNAUTHENTICATED")) {
        setApiKeyError("Invalid API key. Please check your key and try again.");
      } else if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
        setApiKeyError("API quota exceeded. Please try again later or use a different key.");
      } else if (msg.includes("PERMISSION_DENIED") || msg.includes("403")) {
        setApiKeyError("API key doesn't have permission. Enable the Generative Language API in Google Cloud console.");
      } else {
        setApiKeyError("Failed to validate API key: " + msg);
      }
      setAi(null);
      setShowApiKeyInput(true);
    } finally {
      setApiKeyLoading(false);
    }
  };

  const handleApiKeySubmit = () => {
    const trimmedKey = apiKey.trim();
    if (trimmedKey === "") {
      setApiKeyError("Please enter a valid API key.");
      return;
    }
    if (!trimmedKey.startsWith("AIzaSy")) {
      setApiKeyError("API key format looks incorrect. Google AI keys typically start with 'AIzaSy'.");
      return;
    }
    initializeAI(trimmedKey, { saveKey: true });
  };

  // Syntax error detection
  const detectSyntaxErrors = (code, language) => {
    const errors = [];
    const patterns = {
      javascript: [
        { pattern: /if\s*\([^)]*$/gm, message: "Missing closing parenthesis in if statement" },
        { pattern: /for\s*\([^)]*$/gm, message: "Missing closing parenthesis in for loop" },
        { pattern: /while\s*\([^)]*$/gm, message: "Missing closing parenthesis in while loop" },
        { pattern: /function\s+\w*\s*\([^)]*$/gm, message: "Missing closing parenthesis in function declaration" }
      ],
      python: [
        { pattern: /def\s+\w+\s*\([^)]*$/gm, message: "Missing closing parenthesis in function definition" }
      ],
      java: [
        { pattern: /if\s*\([^)]*$/gm, message: "Missing closing parenthesis in if statement" },
        { pattern: /for\s*\([^)]*$/gm, message: "Missing closing parenthesis in for loop" }
      ]
    };

    const langPatterns = patterns[language] || [];
    langPatterns.forEach(({ pattern, message }) => {
      let match;
      while ((match = pattern.exec(code)) !== null) {
        const lines = code.substring(0, match.index).split('\n');
        errors.push({ line: lines.length, message, severity: "error" });
      }
    });
    return errors;
  };

  // ─── STREAMING review ────────────────────────────────
  async function reviewCode() {
    if (!ai) {
      setNotification({ type: 'error', message: 'Please enter your Google GenAI API key first.' });
      setShowApiKeyInput(true);
      return;
    }

    setResponse("");
    setLoading(true);
    setStreaming(true);

    const syntaxErrors = detectSyntaxErrors(code, selectedOption.value);

    const enhancedPrompt = `You are Code Sensei, an expert-level software developer and coding mentor, skilled in writing efficient, clean, and advanced code.
I'm sharing a piece of code written in ${selectedOption.value}.
Your job is to deeply review this code and provide the following:

1️⃣ A quality rating: Better, Good, Normal, or Bad.
2️⃣ Detailed suggestions for improvement, including best practices and advanced alternatives.
3️⃣ A clear explanation of what the code does, step by step.
4️⃣ A list of any potential bugs or logical errors, if found.
5️⃣ Identification of syntax errors or runtime errors, if present.
6️⃣ Solutions and recommendations on how to fix each identified issue.
7️⃣ For each error, specify the exact line number where it occurs.

${syntaxErrors.length > 0 ? `The following syntax errors were detected:\n${syntaxErrors.map((err, idx) => `${idx + 1}. Line ${err.line}: ${err.message}`).join('\n')}` : ''}

Analyze it like a senior developer reviewing a pull request. Be specific about line numbers when identifying issues.

Code:\n\`\`\`${selectedOption.value}\n${code}\n\`\`\`
`;

    try {
      const model = ai.getGenerativeModel({ model: "gemini-3.6-flash" });
      const result = await model.generateContentStream(enhancedPrompt);

      let fullText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        setResponse(fullText);
      }
    } catch (error) {
      console.error("AI request failed:", error);
      const errorMessage = error.message || error.toString();
      if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
        setResponse("⚠️ **API Quota Exceeded**\n\nYou've hit the rate limit. Please wait a moment and try again.");
      } else if (errorMessage.includes("401") || errorMessage.includes("UNAUTHENTICATED") || errorMessage.includes("API_KEY_INVALID")) {
        setResponse("🔑 **Invalid API Key**\n\nYour API key is invalid or has been revoked. Click \"Change API Key\" to fix.");
        setAi(null);
      } else {
        setResponse("❌ **Error:** " + errorMessage);
      }
    }

    setLoading(false);
    setStreaming(false);
  }

  // ─── STREAMING fix ──────────────────────────────────
  async function fixCode() {
    if (!ai) {
      setNotification({ type: 'error', message: 'Please enter your Google GenAI API key first.' });
      setShowApiKeyInput(true);
      return;
    }
    if (code === "") {
      setNotification({ type: 'error', message: 'Please enter code first.' });
      return;
    }

    setResponse("");
    setLoading(true);

    const syntaxErrors = detectSyntaxErrors(code, selectedOption.value);

    const fixPrompt = `You are Code Sensei, an expert-level software developer and coding mentor.
I'm sharing a piece of code written in ${selectedOption.value} that needs to be fixed and improved.

Please provide a corrected version of this code that:
1. Fixes all syntax errors
2. Addresses logical issues
3. Improves code quality and follows best practices
4. Maintains the original functionality

${syntaxErrors.length > 0 ? `Detected syntax errors:\n${syntaxErrors.map((err, idx) => `${idx + 1}. Line ${err.line}: ${err.message}`).join('\n')}` : ''}

Return ONLY the corrected code without any additional explanations or markdown formatting. Do NOT wrap the code in code blocks.

Original Code:\n${code}
`;

    try {
      const model = ai.getGenerativeModel({ model: "gemini-3.6-flash" });
      const result = await model.generateContent(fixPrompt);

      if (!result || !result.response) {
        throw new Error("No response from AI service.");
      }

      let fixedCode = await result.response.text();
      fixedCode = fixedCode.replace(/^```[\w]*\n?/, '').replace(/\n?```\s*$/, '');

      setCode(fixedCode);
      setResponse("✅ Code has been fixed and updated in the editor!");
      setNotification({ type: 'success', message: 'Code fixed successfully!' });
    } catch (error) {
      console.error("AI request failed:", error);
      const errorMessage = error.message || error.toString();
      if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
        setResponse("⚠️ **API Quota Exceeded**\n\nPlease wait and try again.");
      } else if (errorMessage.includes("401") || errorMessage.includes("UNAUTHENTICATED") || errorMessage.includes("API_KEY_INVALID")) {
        setResponse("🔑 **Invalid API Key**\n\nClick \"Change API Key\" to fix.");
        setAi(null);
      } else {
        setResponse("❌ **Error:** " + errorMessage);
      }
    }

    setLoading(false);
  }

  const handleEditorValidation = (markers) => {
    setMarkers(markers);
  };

  const resetApiKey = () => {
    localStorage.removeItem("google-genai-api-key");
    setApiKey("");
    setAi(null);
    setShowApiKeyInput(true);
    setApiKeyError("");
  };

  // Copy code block to clipboard
  const handleCopyCode = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Line & character count
  const lineCount = code ? code.split('\n').length : 0;
  const charCount = code ? code.length : 0;

  return (
    <>
      <Navbar />

      {/* Toast notification */}
      {notification && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border backdrop-blur-md transition-all animate-slide-in ${
          notification.type === 'success'
            ? 'bg-green-900/80 border-green-600/50 text-green-100'
            : 'bg-red-900/80 border-red-600/50 text-red-100'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={18} className="animate-pop" /> : <XCircle size={18} />}
          <span className="text-sm font-medium">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 text-gray-300 hover:text-white transition-colors">
            ✕
          </button>
        </div>
      )}

      <div className="main flex justify-between" style={{ height: "calc(100vh - 70px)" }}>
        {/* ─── LEFT PANEL ─── */}
        <div className="left h-full w-1/2 flex flex-col border-r border-gray-800/60">
          {showApiKeyInput ? (
            <div className="flex-1 flex items-center justify-center p-8 animate-fade-in">
              <div className="w-full max-w-md p-8 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl border border-gray-700/50 shadow-2xl backdrop-blur-sm">
                <div className="text-center mb-8">
                  <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-5 shadow-lg shadow-purple-500/20 animate-float">
                    <Code size={36} color='#ffffff' />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome to Code Sensei</h2>
                  <p className="text-gray-400 text-sm">Intelligent Multi-Stage Code Review & Feedback</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Google GenAI API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => { setApiKey(e.target.value); setApiKeyError(""); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleApiKeySubmit(); }}
                      placeholder="Enter your API key (starts with AIzaSy...)"
                      className={`w-full px-4 py-3.5 bg-gray-800/80 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        apiKeyError
                          ? 'border-red-500 focus:ring-red-500/50'
                          : 'border-gray-700 focus:ring-purple-500/50'
                      }`}
                    />
                    {apiKeyError && (
                      <p className="mt-2.5 text-xs text-red-400 flex items-start gap-1.5 animate-shake">
                        <XCircle size={14} className="flex-shrink-0 mt-0.5" />
                        <span>{apiKeyError}</span>
                      </p>
                    )}
                    <p className="mt-2.5 text-xs text-gray-500">
                      Get your API key from{' '}
                      <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                        Google AI Studio
                      </a>
                    </p>
                  </div>

                  <button
                    onClick={handleApiKeySubmit}
                    disabled={apiKeyLoading}
                    className="w-full px-4 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2.5 active:scale-[0.98]"
                  >
                    {apiKeyLoading ? (
                      <>
                        <RingLoader color="#ffffff" size={18} />
                        <span>Validating...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={18} />
                        <span>Activate AI Power</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Syntax Detection', 'Quality Analysis', 'Auto Fix', 'Multi-Language'].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-400 py-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="toolbar p-3 bg-gray-900/70 border-b border-gray-800/60 backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Language selector */}
                  <div className="min-w-[180px]">
                    <div className="relative">
                      <select
                        value={selectedOption.value}
                        onChange={(e) => {
                          const selected = options.find(option => option.value === e.target.value);
                          setSelectedOption(selected);
                        }}
                        className="w-full py-2.5 pl-3 pr-8 bg-gray-800/80 text-white text-sm rounded-lg border border-gray-700/60 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none appearance-none transition-all duration-200 hover:border-gray-600"
                      >
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <button
                    onClick={fixCode}
                    disabled={loading || code === ""}
                    className="btn-action bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/25"
                  >
                    <Wand2 size={15} />
                    <span>Fix Code</span>
                  </button>

                  <button
                    onClick={() => {
                      if (code === "") {
                        setNotification({ type: 'error', message: 'Please enter code first.' });
                      } else {
                        reviewCode();
                      }
                    }}
                    disabled={loading || code === ""}
                    className="btn-action bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/25"
                  >
                    <Sparkles size={15} />
                    <span>Review</span>
                  </button>

                  <button
                    onClick={() => { setCode(""); setResponse(""); setMarkers([]); }}
                    disabled={loading || code === ""}
                    className="btn-action bg-gray-700/80 hover:bg-gray-600/80 hover:shadow-none"
                  >
                    <Eraser size={15} />
                    <span>Clear</span>
                  </button>

                  {markers.length > 0 && (
                    <div className="px-2.5 py-1.5 bg-red-900/50 text-red-200 text-xs font-medium rounded-lg flex items-center gap-1.5 border border-red-800/40 animate-pulse-soft">
                      <AlertTriangle size={13} />
                      {markers.length} Issues
                    </div>
                  )}

                  <button
                    onClick={resetApiKey}
                    className="ml-auto btn-action bg-gray-700/60 hover:bg-gray-600/60 hover:shadow-none text-gray-400 hover:text-white"
                  >
                    <Key size={14} />
                    <span className="hidden sm:inline">API Key</span>
                  </button>
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 min-h-0 relative">
                <Editor
                  height="100%"
                  theme='vs-dark'
                  language={getMonacoLanguage(selectedOption.value)}
                  value={code}
                  onChange={(e) => { setCode(e) }}
                  onValidate={handleEditorValidation}
                  options={{
                    minimap: { enabled: true, scale: 1 },
                    fontSize: 14,
                    fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
                    fontLigatures: true,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16 },
                    smoothScrolling: true,
                    cursorSmoothCaretAnimation: "on",
                    cursorBlinking: "smooth",
                    bracketPairColorization: { enabled: true },
                    renderLineHighlight: "all",
                    lineHeight: 22,
                  }}
                />
                {/* Status bar */}
                <div className="absolute bottom-0 left-0 right-0 h-7 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800/50 flex items-center px-4 text-xs text-gray-500 gap-4 z-10">
                  <span>{selectedOption.label}</span>
                  <span className="opacity-40">│</span>
                  <span>Ln {lineCount}</span>
                  <span className="opacity-40">│</span>
                  <span>{charCount} chars</span>
                  {ai && (
                    <>
                      <span className="ml-auto flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        AI Ready
                      </span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="right w-1/2 h-full flex flex-col bg-gray-950/40">
          <div className="header p-3.5 border-b border-gray-800/60 bg-gray-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2 uppercase tracking-wider">
                <MessageCircle size={16} className="text-purple-400" />
                AI Analysis
              </h2>
              {(loading || streaming) && (
                <div className="flex items-center gap-2 text-purple-400">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                  <span className="text-xs font-medium">{streaming ? 'Streaming...' : 'Thinking...'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-5 scroll-smooth" ref={responseRef}>
            {loading && !streaming ? (
              /* Skeleton loading */
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <RingLoader color='#9333ea' size={40} />
                  <div>
                    <p className="text-gray-300 font-medium">Analyzing your code...</p>
                    <p className="text-gray-500 text-xs mt-0.5">This usually takes a few seconds</p>
                  </div>
                </div>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2.5" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className={`h-4 bg-gray-800/60 rounded-lg shimmer`} style={{ width: `${70 + Math.random() * 30}%` }}></div>
                    <div className={`h-3 bg-gray-800/40 rounded-lg shimmer`} style={{ width: `${50 + Math.random() * 40}%`, animationDelay: '0.1s' }}></div>
                    <div className={`h-3 bg-gray-800/40 rounded-lg shimmer`} style={{ width: `${40 + Math.random() * 30}%`, animationDelay: '0.2s' }}></div>
                  </div>
                ))}
              </div>
            ) : response ? (
              <div className={`prose prose-invert max-w-none animate-fade-in ${streaming ? 'streaming-cursor' : ''}`}>
                <Markdown
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-white mt-6 mb-3 pb-2 border-b border-gray-800/60" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-purple-300 mt-5 mb-2.5 flex items-center gap-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-base font-bold text-indigo-300 mt-4 mb-2" {...props} />,
                    p: ({ node, ...props }) => <p className="text-gray-300 mb-3 leading-relaxed text-[14px]" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-outside text-gray-300 mb-4 space-y-1.5 pl-5 text-[14px]" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-outside text-gray-300 mb-4 space-y-1.5 pl-5 text-[14px]" {...props} />,
                    li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                    code: ({ node, className, children, ...props }) => {
                      const isInline = !className;
                      if (isInline) {
                        return <code className="bg-gray-800/80 text-purple-300 px-1.5 py-0.5 rounded text-[13px] font-mono" {...props}>{children}</code>;
                      }
                      return <code className={className} {...props}>{children}</code>;
                    },
                    pre: ({ node, children, ...props }) => {
                      const codeText = node?.children?.[0]?.children?.[0]?.value || '';
                      const idx = Math.random();
                      return (
                        <div className="relative group my-4">
                          <pre className="bg-gray-900/80 border border-gray-800/60 p-4 rounded-xl overflow-x-auto text-[13px] leading-relaxed" {...props}>
                            {children}
                          </pre>
                          <button
                            onClick={() => handleCopyCode(codeText, idx)}
                            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-gray-700/60 text-gray-400 hover:text-white hover:bg-gray-600/80 opacity-0 group-hover:opacity-100 transition-all duration-200"
                            title="Copy code"
                          >
                            {copiedIndex === idx ? <CheckCircle size={14} className="text-green-400" /> : <ClipboardCopy size={14} />}
                          </button>
                        </div>
                      );
                    },
                    strong: ({ node, ...props }) => <strong className="text-white font-semibold" {...props} />,
                    a: ({ node, ...props }) => <a className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors" {...props} />,
                    blockquote: ({ node, ...props }) => <blockquote className="border-l-3 border-purple-500 pl-4 my-4 text-gray-400 italic" {...props} />,
                  }}
                >
                  {response}
                </Markdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-800/20 animate-float">
                  <MessageCircle size={44} className="text-purple-400/80" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Awaiting Code Analysis</h3>
                <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
                  Paste your code in the editor and click <strong className="text-purple-400">Review</strong> to get
                  AI-powered feedback on quality, bugs, and improvements.
                </p>
                <div className="flex gap-3 mt-6">
                  <div className="px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-800/20 text-purple-400 text-xs flex items-center gap-1.5">
                    <Sparkles size={12} /> Review
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-emerald-900/30 border border-emerald-800/20 text-emerald-400 text-xs flex items-center gap-1.5">
                    <Wand2 size={12} /> Auto Fix
                  </div>
                </div>
              </div>
            )}

            {/* Editor issues */}
            {markers.length > 0 && !loading && (
              <div className="mt-6 p-4 bg-red-950/30 border border-red-800/30 rounded-xl animate-fade-in">
                <h3 className="font-semibold text-sm mb-3 text-red-300 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Editor Issues ({markers.length})
                </h3>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {markers.map((marker, index) => (
                    <div key={index} className="p-2.5 bg-red-900/20 rounded-lg flex items-start gap-2 text-sm">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                      <div>
                        <span className="font-mono text-xs text-red-300">Line {marker.startLineNumber}: </span>
                        <span className="text-red-200 text-xs">{marker.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App