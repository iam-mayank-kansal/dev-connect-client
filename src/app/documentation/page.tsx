'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Copy } from 'lucide-react';

interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  requestBody?: { [key: string]: string } | null; // Fixed here to allow null
  responseExample?: any;
}

interface ApiGroup {
  title: string;
  endpoints: ApiEndpoint[];
}

const apiDocumentation: ApiGroup[] = [
  {
    title: "Authentication",
    endpoints: [
      {
        path: "/sign-up",
        method: "POST",
        description: "Register a new user with validation.",
        requestBody: { email: "string", password: "string" },
        responseExample: { "message": "User registered successfully." }
      },
      {
        path: "/login",
        method: "POST",
        description: "User login with validation.",
        requestBody: { email: "string", password: "string" },
        responseExample: { "token": "jwt_token_here", "user_id": "string" }
      }
    ]
  },
  {
    title: "User",
    endpoints: [
      {
        path: "/delete",
        method: "DELETE",
        description: "Delete user account (Auth required).",
        requestBody: null, // This is now a valid type
        responseExample: { "message": "User account deleted." }
      },
      {
        path: "/set-new-password",
        method: "PATCH",
        description: "Set a new password after verification.",
        requestBody: { resetToken: "string", newPassword: "string" },
        responseExample: { "message": "Password updated successfully." }
      }
    ]
  },
  {
    title: "OTP",
    endpoints: [
      {
        path: "/send-otp",
        method: "POST",
        description: "Send a one-time password for verification.",
        requestBody: { email: "string", mobile: "string" },
        responseExample: { "message": "OTP sent successfully.", "contact": "email" }
      },
      {
        path: "/verify-otp",
        method: "POST",
        description: "Verify the one-time password.",
        requestBody: { email: "string", otp: "string" },
        responseExample: { "message": "OTP verified successfully.", "token": "string" }
      }
    ]
  }
];

// Helper to get method color
const getMethodColor = (method: string) => {
  switch (method) {
    case "GET": return "text-blue-500 bg-blue-50";
    case "POST": return "text-green-500 bg-green-50";
    case "PATCH": return "text-yellow-500 bg-yellow-50";
    case "DELETE": return "text-red-500 bg-red-50";
    default: return "text-gray-500 bg-gray-50";
  }
};

const MethodBadge = ({ method }: { method: string }) => (
  <span className={`px-2 py-1 rounded-full font-mono text-xs font-semibold ${getMethodColor(method)}`}>
    {method}
  </span>
);

// Code snippet component with copy functionality
const CodeBlock = ({ title, code }: { title: string; code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-gray-800 text-white rounded-lg overflow-hidden my-4">
      <div className="flex justify-between items-center p-3 border-b border-gray-700">
        <span className="text-sm font-semibold">{title}</span>
        <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors duration-200">
          <Copy className="inline-block mr-1" /> {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
};


export default function DocumentationPage() {
  const [apiGroups, setApiGroups] = useState<ApiGroup[]>([]);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [activeEndpoint, setActiveEndpoint] = useState<ApiEndpoint | null>(null);

  useEffect(() => {
    setApiGroups(apiDocumentation);
    if (apiDocumentation.length > 0) {
      setActiveGroup(apiDocumentation[0].title);
      setActiveEndpoint(apiDocumentation[0].endpoints[0]);
    }
  }, []);

  const renderEndpointDetails = () => {
    if (!activeEndpoint) return null;

    const requestBodyString = activeEndpoint.requestBody
      ? JSON.stringify(activeEndpoint.requestBody, null, 2)
      : '{}';

    const responseExampleString = activeEndpoint.responseExample
      ? JSON.stringify(activeEndpoint.responseExample, null, 2)
      : '{}';

    return (
      <div className="flex-1 bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-4 mb-4">
          <MethodBadge method={activeEndpoint.method} />
          <h3 className="text-3xl font-bold text-gray-800">{activeEndpoint.path}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed mb-6">{activeEndpoint.description}</p>
        
        <h4 className="text-xl font-semibold text-gray-700 mb-2">Request Body</h4>
        <p className="text-gray-500 mb-4">The API expects a JSON payload with the following fields.</p>
        <CodeBlock title="JSON" code={requestBodyString} />

        <h4 className="text-xl font-semibold text-gray-700 mb-2">Example Response</h4>
        <p className="text-gray-500 mb-4">A successful response will return a JSON object like this:</p>
        <CodeBlock title="JSON" code={responseExampleString} />
      </div>
    );
  };

  return (
  <div className="bg-gray-100 min-h-screen">
  <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
    {/* Sidebar Navigation */}
    <aside className="w-full lg:w-64 bg-white rounded-lg shadow-md p-6 sticky top-24 self-start">
      <h3 className="text-lg font-bold mb-4 text-gray-800">API Groups</h3>
      <nav>
        {apiGroups.map((group) => (
          <div key={group.title} className="mb-4">
            <h4 className="text-gray-500 font-semibold uppercase tracking-wide text-xs mb-2">
              {group.title}
            </h4>
            <ul>
              {group.endpoints.map((endpoint) => (
                <li key={endpoint.path}>
                  <button
                    onClick={() => setActiveEndpoint(endpoint)}
                    className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-md transition-colors duration-200 ease-in-out
                      ${
                        activeEndpoint?.path === endpoint.path
                          ? 'bg-blue-100 text-blue-800 font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <ChevronRight className="text-blue-500" />
                    <span className="font-mono text-sm">{endpoint.path}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>

    {/* Main Content Area */}
    <div className="flex-1">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
        API Reference
        <span className="text-xl font-medium text-blue-500 ml-2">v1.0</span>
      </h1>
      {renderEndpointDetails()}
    </div>
  </main>
</div>
  );
}