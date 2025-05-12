
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Particles from '@/components/animations/Particles';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Book, Code, Layers, Lock, Unlock, CheckCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Documentation = () => {
  const [accessCode, setAccessCode] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const checkAccessCode = () => {
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      if (accessCode === 'DHBWSTUTTGART') {
        setHasAccess(true);
        toast({
          title: "Access granted",
          description: "You now have access to the full documentation.",
          variant: "default",
        });
      } else {
        toast({
          title: "Invalid access code",
          description: "Please check your code and try again.",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen overflow-hidden animated-gradient-bg flex flex-col">
      <Particles quantity={65} staticity={50} ease={60} />
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 md:pt-28 pb-16 md:px-6 relative z-10 page-transition flex-grow">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]">Documentation</h1>
          <p className="text-muted-foreground drop-shadow-md">Learn about the technologies and functionality of ProgressorAI.</p>
        </div>
        
        {!hasAccess ? (
          <GlassCard className="p-8 max-w-md mx-auto mb-16 animate-fade-in">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock size={32} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Documentation Access</h2>
              <p className="text-muted-foreground">
                Full documentation requires an access code. 
                Please enter your code below to gain access to the complete documentation.
              </p>
              
              <div className="w-full mt-4 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="accessCode" className="text-sm text-left block">
                    Access Code
                  </label>
                  <Input
                    id="accessCode"
                    type="text"
                    placeholder="Enter your access code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <Button 
                  onClick={checkAccessCode} 
                  className="w-full" 
                  disabled={isSubmitting || !accessCode.trim()}
                >
                  {isSubmitting ? "Verifying..." : "Submit"}
                </Button>
              </div>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-8 mb-16 animate-fade-in">
            <GlassCard className="p-6">
              <div className="flex items-center mb-4">
                <Unlock size={20} className="text-green-400 mr-2" />
                <span className="text-green-400 text-sm">Full access granted</span>
              </div>
              
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">
                    <Book size={16} className="mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="tech">
                    <Code size={16} className="mr-2" />
                    Technology
                  </TabsTrigger>
                  <TabsTrigger value="architecture">
                    <Layers size={16} className="mr-2" />
                    Architecture
                  </TabsTrigger>
                  <TabsTrigger value="clientDoc">
                    <FileText size={16} className="mr-2" />
                    Client Details
                  </TabsTrigger>
                  <TabsTrigger value="serverDoc">
                    <Layers size={16} className="mr-2" />
                    Server Details
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">ProgressorAI: Project Overview</h3>
                    <p className="text-muted-foreground mb-4">
                      ProgressorAI is a modern productivity application designed to help users manage tasks, track productivity, and gain insights through AI-powered analytics. It is built on a hybrid architecture, primarily utilizing a Client-Server model. The backend, powered by Django, serves as a central hub for services, while the React-based frontend provides the user interface.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      The system architecture emphasizes modularity, with Django applications organized as distinct components, and employs asynchronous communication via Celery workers for handling computationally intensive tasks. This ensures the main application remains responsive. For deployment, ProgressorAI is containerized using Docker and Docker Compose, guaranteeing consistent and reproducible environments. This architectural design was selected for its reliability, clear separation of concerns between UI and data processing, and overall maintainability, while pragmatically avoiding the complexities of a full microservices setup.
                    </p>
                    <h4 className="text-md font-medium mb-2">Key Features</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Task management with priority levels and due dates</li>
                      <li>Kanban board for visual task organization</li>
                      <li>AI-powered task time estimation</li>
                      <li>Productivity analytics and reporting</li>
                      <li>Real-time chat interface with AI assistant</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-md font-medium mb-2">User Interface</h4>
                    <p className="text-muted-foreground">
                      The application features a modern, responsive design with a dark theme and glassmorphism effects.
                      The UI is built with React and Tailwind CSS, utilizing shadcn/ui components for consistent styling.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="tech" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Technology Stack</h3>
                    <p className="text-muted-foreground mb-4">
                      ProgressorAI leverages a modern technology stack to deliver a robust and scalable application. The core technologies are outlined below:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-md font-medium mb-2">Frontend</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>React 18 with TypeScript</li>
                          <li>Tailwind CSS for styling</li>
                          <li>shadcn/ui component library</li>
                          <li>React Router for navigation</li>
                          <li>Lucide React for icons</li>
                          <li>Recharts for data visualization</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-medium mb-2">Backend</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Django (Python framework)</li>
                          <li>Django REST framework (APIs)</li>
                          <li>Django Channels (WebSockets)</li>
                          <li>Celery (Asynchronous tasks)</li>
                          <li>PostgreSQL (Database)</li>
                          <li>Redis (Message broker & Celery backend)</li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-md font-medium mb-2">State Management (Frontend)</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>React Context API</li>
                          <li>TanStack Query (React Query)</li>
                          <li>Local state with useState</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-md font-medium mb-2">Build, Deployment & Tooling</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Vite (Frontend build tool)</li>
                          <li>Docker & Docker Compose</li>
                          <li>NGINX (Reverse proxy)</li>
                          <li>TypeScript (Type safety)</li>
                          <li>ESLint & Prettier (Code quality)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="architecture" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">System Architecture Overview</h3>
                    <p className="text-muted-foreground mb-4">
                      ProgressorAI employs a hybrid architecture model, primarily based on a <strong>Client-Server</strong> structure. The backend server, built with Django, acts as a central hub providing services, while the React-based frontend client serves as the user interface.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      The system emphasizes modularity, scalability, and asynchronous communication. Key architectural decisions include:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                      <li><strong>Modular Backend:</strong> Django applications are organized as distinct components, facilitating maintainability and adaptability.</li>
                      <li><strong>Asynchronous Operations:</strong> Computationally intensive tasks, especially AI-related processes, are offloaded to Celery workers, ensuring the main application remains responsive.</li>
                      <li><strong>Containerization:</strong> Docker and Docker Compose are used for system deployment, providing isolated and reproducible environments for all components.</li>
                    </ul>

                    <h4 className="text-md font-medium mb-2">Core System Components</h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                      <li>
                        <strong>Web Client (React):</strong> Provides the user interface for task management, analytics, and AI assistant interaction. Communicates via HTTP/REST for standard requests and WebSockets for real-time chat.
                      </li>
                      <li>
                        <strong>API Layer (Django):</strong> The system's backbone, implemented with multiple Docker containers. It exposes RESTful APIs and WebSockets for core functionalities. Three Django instances (api, api2, api3) are load-balanced by NGINX.
                      </li>
                      <li>
                        <strong>NGINX:</strong> Acts as a reverse proxy and load balancer, directing client requests to the appropriate API instances.
                      </li>
                      <li>
                        <strong>Celery &amp; Flower:</strong> Celery manages a distributed task queue for asynchronous background processing (e.g., AI tasks). Flower provides a web-based monitoring tool for Celery tasks and workers.
                      </li>
                      <li>
                        <strong>Redis:</strong> Serves as a message broker for WebSocket communication (via Django Channels) and as the backend for Celery's task queue.
                      </li>
                      <li>
                        <strong>PostgreSQL:</strong> The relational database storing persistent data like user information, tasks, and chat messages.
                      </li>
                      <li>
                        <strong>Docker &amp; Docker Compose:</strong> Orchestrates all system components, ensuring they run in isolated containers and interact seamlessly within a defined Docker network.
                      </li>
                    </ul>

                    <h4 className="text-md font-medium mb-2">Communication and Data Flow</h4>
                    <p className="text-muted-foreground mb-4">
                      Client requests are typically routed through NGINX to the Django API layer. Standard data operations use HTTP/REST, while real-time features like chat utilize WebSockets (managed by Django Channels with Redis). For long-running tasks, the API delegates to Celery workers via Redis. All components communicate over an internal Docker network.
                    </p>

                    <h4 className="text-md font-medium mb-2">Authentication</h4>
                    <p className="text-muted-foreground">
                      JWT (JSON Web Tokens) are used for secure access to the API and WebSocket connections, implemented with Djoser and Django Rest Framework Simple JWT.
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">Source: Ausarbeitung</p>
                  </div>
                </TabsContent>

                <TabsContent value="clientDoc" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Client Application Deep Dive</h3>
                    <p className="text-muted-foreground mb-4">
                      This section provides a detailed overview of the frontend client application, built with React, Vite, and TypeScript.
                    </p>

                    <h4 className="text-md font-medium mt-6 mb-2">Project Setup & Execution</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                      <li><strong>Installation:</strong> Run <code>npm install</code> (or <code>bun install</code>) in the <code>/client</code> directory to install dependencies.</li>
                      <li><strong>Development:</strong> Run <code>npm run dev</code> (or <code>bun run dev</code>) to start the Vite development server.</li>
                      <li><strong>Build:</strong> Run <code>npm run build</code> (or <code>bun run build</code>) to create a production build in the <code>/client/dist</code> folder.</li>
                    </ul>

                    <h4 className="text-md font-medium mt-6 mb-2">Key Root Files & Folders</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                      <li><code>index.html</code>: The main HTML entry point for the application.</li>
                      <li><code>package.json</code>: Lists project dependencies, scripts, and metadata.</li>
                      <li><code>vite.config.ts</code>: Configuration file for Vite, the build tool and dev server.</li>
                      <li><code>tailwind.config.ts</code>: Configuration for Tailwind CSS.</li>
                      <li><code>tsconfig.json</code> (and variants): TypeScript compiler options.</li>
                      <li><code>public/</code>: Contains static assets that are served directly (e.g., <code>favicon.ico</code>).</li>
                      <li><code>src/</code>: Contains all the application's source code.</li>
                    </ul>

                    <h4 className="text-md font-medium mt-6 mb-2"><code>src/</code> Directory Structure</h4>
                    <p className="text-muted-foreground mb-2">
                      The <code>src</code> directory is organized to promote modularity and maintainability:
                    </p>
                    <div className="bg-background/50 p-4 rounded-md mb-4">
                      <pre className="text-xs overflow-auto">
{`src/
├── App.css             # Global application styles
├── App.tsx             # Root application component, sets up routing
├── main.tsx            # Main entry point, renders App.tsx
├── index.css           # Base styles, Tailwind directives
├── components/         # Reusable UI components
│   ├── AIChat.tsx      # Main AI Chat component
│   ├── animations/     # Animation-specific components
│   ├── chat/           # Other chat interface sub-components
│   ├── layout/         # Layout components (Navbar, Footer)
│   ├── onboarding/     # Components for user onboarding
│   ├── tasks/          # Task management components
│   └── ui/             # Base UI elements (shadcn/ui)
├── constants.tsx       # Application-wide constants
├── hooks/              # Custom React hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── pages/              # Top-level route components
├── providers/          # React Context providers & related logic
│   ├── AuthProvider.tsx
│   ├── ProtectedRoute.tsx
│   ├── ThemeProvider.tsx
│   └── authService.ts  # Authentication service logic (Note: consider moving to /services)
├── services/           # API interaction logic
│   ├── auth.ts         # User authentication related services
│   └── tasks.ts        # Task management related services
├── types/              # TypeScript type definitions
│   └── task.ts
└── vite-env.d.ts       # TypeScript definitions for Vite`}
                      </pre>
                    </div>

                    <h5 className="text-sm font-medium mt-4 mb-1">Detailed Breakdown of <code>src/</code> Subdirectories:</h5>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>
                        <strong><code>components/</code></strong>: Houses all reusable React components.
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                          <li><code>AIChat.tsx</code>: The primary component for the AI chat interface.</li>
                          <li><code>animations/</code>: Components dedicated to visual animations, like particle effects.</li>
                          <li><code>chat/</code>: UI elements specific to the chat functionality.</li>
                          <li><code>layout/</code>: Structural components such as <code>Navbar</code>, <code>Footer</code>.</li>
                          <li><code>onboarding/</code>: Components used during the user registration or initial setup process.</li>
                          <li><code>tasks/</code>: Components related to creating, displaying, and managing tasks.</li>
                          <li><code>ui/</code>: Generic UI building blocks, often from shadcn/ui.</li>
                        </ul>
                      </li>
                      <li><strong><code>constants.tsx</code></strong>: Central place for application-wide constants.</li>
                      <li><strong><code>hooks/</code></strong>: Custom React Hooks for reusable stateful logic (e.g., <code>useToast</code>, <code>useMobile</code>).</li>
                      <li><strong><code>pages/</code></strong>: Distinct page components mapped to routes (e.g., <code>Login.tsx</code>, <code>Tasks.tsx</code>).</li>
                      <li><strong><code>providers/</code></strong>: React Context providers for global state/functionality (e.g., <code>AuthProvider</code>, <code>ThemeProvider</code>). Also includes <code>authService.ts</code> which handles authentication logic (Note: Its placement here is project-specific).</li>
                      <li><strong><code>services/</code></strong>: Modules for external API calls and data logic (e.g., <code>auth.ts</code>, <code>tasks.ts</code>).</li>
                      <li><strong><code>types/</code></strong>: TypeScript interface and type definitions.</li>
                    </ul>

                    <h4 className="text-md font-medium mt-6 mb-2">Styling</h4>
                    <p className="text-muted-foreground mb-4">
                      Styling uses Tailwind CSS. Global styles are in <code>src/index.css</code> and <code>src/App.css</code>. shadcn/ui components provide pre-built UI elements.
                    </p>

                    <h4 className="text-md font-medium mt-6 mb-2">State Management</h4>
                    <p className="text-muted-foreground mb-4">
                      The app uses local state (<code>useState</code>), Context API (<code>AuthProvider</code>, <code>ThemeProvider</code>), and TanStack Query for server state.
                    </p>

                    <h4 className="text-md font-medium mt-6 mb-2">Routing</h4>
                    <p className="text-muted-foreground mb-4">
                      Client-side routing is handled by React Router, configured in <code>App.tsx</code> or a dedicated routing file, mapping paths to components in <code>src/pages/</code>.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="serverDoc" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Server Application Deep Dive</h3>
                    <p className="text-muted-foreground mb-4">
                      This section provides a detailed overview of the backend server application, built with Django and Python.
                    </p>

                    <h4 className="text-md font-medium mt-6 mb-2">Core Architecture & Technologies</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                      <li><strong>Framework:</strong> Django (Python web framework)</li>
                      <li><strong>API:</strong> Django REST framework for building RESTful APIs.</li>
                      <li><strong>Database:</strong> PostgreSQL for persistent data storage.</li>
                      <li><strong>Asynchronous Tasks:</strong> Celery with Redis as a message broker for handling background tasks.</li>
                      <li><strong>Real-time Communication:</strong> Django Channels for WebSocket support, also using Redis.</li>
                      <li><strong>Deployment:</strong> Docker and Docker Compose for containerization, with NGINX as a reverse proxy and load balancer.</li>
                    </ul>

                    <h4 className="text-md font-medium mt-6 mb-2">Project Structure (<code>progressorFullStack/</code>)</h4>
                    <p className="text-muted-foreground mb-2">
                      The server-side code is primarily located within the <code>progressor/</code> and <code>apps/</code> directories.
                    </p>
                    <div className="bg-background/50 p-4 rounded-md mb-4">
                      <pre className="text-xs overflow-auto">
{`progressorFullStack/
├── apps/                 # Contains individual Django applications (modules)
│   ├── chat/             # Real-time chat functionality
│   ├── common/           # Shared utilities or models
│   ├── profiles/         # User profiles and related data
│   ├── ratings/          # Rating system (if applicable)
│   ├── tasks/            # Task management logic
│   └── users/            # User authentication and management
├── progressor/           # Core Django project configuration
│   ├── __init__.py
│   ├── asgi.py           # ASGI entry point (for Channels)
│   ├── celery.py         # Celery application definition
│   ├── settings/         # Django settings (base, development, production)
│   ├── urls.py           # Root URL configurations
│   ├── wsgi.py           # WSGI entry point (for traditional HTTP)
├── manage.py             # Django's command-line utility
├── requirements.txt      # Python dependencies
├── Dockerfile.dev        # (for backend development)
├── docker-compose.yaml   # Docker Compose configuration for all services
└── ... (other project files)`}
                      </pre>
                    </div>

                    <h5 className="text-sm font-medium mt-4 mb-1">Detailed Breakdown of Key Server Directories:</h5>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>
                        <strong><code>progressor/</code> (Main Project Directory)</strong>:
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                          <li><code>settings/</code>: Contains different settings files (<code>base.py</code>, <code>development.py</code>, <code>production.py</code>) for various environments.</li>
                          <li><code>urls.py</code>: The main URL dispatcher for the project, routing requests to different apps.</li>
                          <li><code>asgi.py</code> & <code>wsgi.py</code>: Entry points for ASGI (asynchronous) and WSGI (synchronous) compatible web servers, respectively. <code>asgi.py</code> is crucial for Django Channels.</li>
                          <li><code>celery.py</code>: Configures the Celery instance for managing asynchronous tasks.</li>
                        </ul>
                      </li>
                      <li>
                        <strong><code>apps/</code> (Application Modules)</strong>:
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                          <li><code>users</code>: Handles user registration, authentication (with Djoser and Simple JWT), and user model management.</li>
                          <li><code>profiles</code>: Manages user profile information, extending the base user model.</li>
                          <li><code>tasks</code>: Contains models, views, and serializers for task management functionalities.</li>
                          <li><code>chat</code>: Implements real-time chat features using Django Channels, including consumers, routing, and models for messages.</li>
                          <li><code>common</code>: May contain shared models, utilities, or custom middleware used across multiple applications.</li>
                          <li><code>ratings</code>: for a system allowing users to rate items or content within the application.</li>
                          <li>Each app typically contains: <code>models.py</code>, <code>views.py</code>, <code>serializers.py</code> (for DRF), <code>urls.py</code>, <code>admin.py</code>, and <code>apps.py</code>.</li>
                        </ul>
                      </li>
                    </ul>

                    <h4 className="text-md font-medium mt-6 mb-2">Authentication & Authorization</h4>
                    <p className="text-muted-foreground mb-4">
                      Authentication is handled using JSON Web Tokens (JWT). Djoser and Django REST Framework Simple JWT are commonly used libraries in Django for this purpose, providing endpoints for token generation, refresh, and verification. Authorization is managed via Django's built-in permission system, potentially extended with custom permissions.
                    </p>

                    <h4 className="text-md font-medium mt-6 mb-2">Data Flow and Communication</h4>
                    <p className="text-muted-foreground mb-4">
                      1. Client sends HTTP requests (for REST API) or WebSocket connections to NGINX.
                      2. NGINX acts as a reverse proxy, load balancing requests to one of the Django application instances.
                      3. Django processes the request: 
                         - For API calls: Django REST Framework views handle the request, interact with models, and return JSON responses.
                         - For WebSocket connections: Django Channels consumers handle the connection and message passing, often using Redis as a channel layer.
                      4. For database operations, Django's ORM interacts with the PostgreSQL database.
                      5. For long-running or background tasks, API views can dispatch tasks to Celery workers via the Redis message broker. Celery workers process these tasks asynchronously.
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">Note: Refer to <code>Ausarbeitung</code> for the most definitive details.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </GlassCard>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Documentation;
