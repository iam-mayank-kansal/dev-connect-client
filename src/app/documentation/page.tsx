'use client';
import React, { useState, useEffect } from 'react';
import { ChevronRight, Copy } from 'lucide-react';
import { Endpoint } from '@/lib/types';
import { apiDocumentation } from '@/lib/documentationData';

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET':
      return 'bg-green-500';
    case 'POST':
      return 'bg-yellow-500';
    case 'PATCH':
      return 'bg-purple-500';
    case 'DELETE':
      return 'bg-red-500';
    default:
      return 'text-gray-500';
  }
};

const MethodBadge = ({ method }: { method: string }) => (
  <span
    className={`px-4 py-2 rounded-full font-mono text-xs font-semibold ${getMethodColor(method)}`}
  >
    {method}
  </span>
);

const CodeBlock = ({ title, code }: { title: string; code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-gray-800  text-white rounded-lg overflow-hidden my-4">
      <div className="flex justify-between items-center p-3 border-b border-gray-700">
        <span className="text-sm font-semibold">{title}</span>
        <button
          onClick={handleCopy}
          className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-200"
        >
          <Copy className="inline-block mr-1" size={16} /> {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default function DocumentationPage() {
  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint | null>(
    apiDocumentation[0]?.endpoints[0] || null
  );

  useEffect(() => {
    // This effect is not strictly needed anymore but can be used for initial setup or URL-based routing.
    // For this simple example, we initialize state directly.
  }, []);

  const renderEndpointDetails = () => {
    if (!activeEndpoint) return null;

    const requestExampleString =
      activeEndpoint.requestExample !== null
        ? JSON.stringify(activeEndpoint.requestExample, null, 2)
        : '// No request body required';

    const responseExampleString = JSON.stringify(activeEndpoint.responseExample, null, 2);

    return (
      <div className="flex-1 bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-4 mb-4">
          <MethodBadge method={activeEndpoint.method} />
          <h3 className="text-3xl font-bold text-gray-800">{activeEndpoint.path}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed mb-6">{activeEndpoint.description}</p>
        <div className="mb-6 space-y-2">
          <p>
            <span className="font-semibold text-gray-700">Authentication:</span>{' '}
            <span className="font-semibold text-blue-700">{activeEndpoint.authentication}</span>
            
          </p>
          {activeEndpoint.contentType && (
            <p>
              <span className="font-semibold text-gray-700">Content Type:</span>{' '}
              <span className="font-semibold text-blue-700">{activeEndpoint.contentType}</span>
            </p>
          )}
        </div>
        {activeEndpoint.requiredFields && (
          <>
            <h4 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Required Fields</h4>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              {activeEndpoint.requiredFields.map((field) => (
                <li key={field}>
                  <span className="font-mono bg-gray-100 p-1 rounded text-sm">{field}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        {activeEndpoint.optionalFields && (
          <>
            <h4 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Optional Fields</h4>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              {Object.entries(activeEndpoint.optionalFields).map(([field, desc]) => (
                <li key={field}>
                  <span className="font-mono bg-gray-100 p-1 rounded text-sm">{field}</span>: {desc}
                </li>
              ))}
            </ul>
          </>
        )}
        <h4 className="text-xl font-semibold text-gray-700 mb-2">Request Body Example</h4>
        <CodeBlock title="JSON" code={requestExampleString} />

        <h4 className="text-xl font-semibold text-gray-700 mb-2">Response Example</h4>
        <CodeBlock title="JSON" code={responseExampleString} />
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 bg-white rounded-lg shadow-md p-6 sticky top-24 self-start">
          <h3 className="text-lg font-bold mb-4 text-gray-800">API Groups</h3>
          <nav>
            {apiDocumentation.map((group) => (
              <div key={group.title} className="mb-4">
                <h4 className="text-gray-500 font-semibold uppercase tracking-wide text-xs mb-2">
                  {group.title}
                </h4>
                <ul>
                  {group.endpoints.map((endpoint) => (
                    <li key={endpoint.path}>
                      <button
                        onClick={() => setActiveEndpoint(endpoint)}
                        className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-md transition-colors duration-200 ease-in-out ${
                          activeEndpoint?.path === endpoint.path
                            ? 'bg-blue-100 text-blue-800 font-bold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronRight className="text-blue-500" size={16} />
                        <span className="font-mono text-sm">{endpoint.path}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">DevConnect API Reference</h1>
          <p className="text-gray-500 mb-8 text-xl font-medium">
            Comprehensive REST API for developer networking and profile management.
          </p>
          {renderEndpointDetails()}
        </div>
      </main>
    </div>
  );
}