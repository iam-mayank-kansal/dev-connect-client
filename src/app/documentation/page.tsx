'use client';
import React, { useState } from 'react';
import { ChevronRight, Copy, ChevronDown, Info, Lock, Eye } from 'lucide-react';
import { Endpoint } from '@/lib/types/documentation';
import { apiDocumentation } from '@/lib/data/documentationData';

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET':
      return 'bg-green-500 text-white';
    case 'POST':
      return 'bg-blue-500 text-white';
    case 'PATCH':
      return 'bg-purple-500 text-white';
    case 'DELETE':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const MethodBadge = ({ method }: { method: string }) => (
  <span
    className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${getMethodColor(method)}`}
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
    <div className="bg-gray-900 text-white rounded-lg overflow-hidden my-4 border border-gray-700">
      <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <span className="text-sm font-bold tracking-wide">{title}</span>
        <button
          onClick={handleCopy}
          className="text-gray-300 cursor-pointer hover:text-white hover:bg-gray-700 transition-all px-2 py-1 rounded text-xs flex items-center gap-1"
        >
          <Copy size={14} />
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed max-h-96 overflow-y-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const CollapsibleSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-50 hover:bg-gray-100 transition px-4 py-3 flex items-center justify-between font-semibold text-gray-800"
      >
        <span className="flex items-center gap-2">
          <Info size={18} className="text-blue-600" />
          {title}
        </span>
        <ChevronDown
          size={20}
          className={`transform transition ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
};

export default function DocumentationPage() {
  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint | null>(
    apiDocumentation[0]?.endpoints[0] || null
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set([apiDocumentation[0]?.title])
  );
  const [searchTerm, setSearchTerm] = useState('');

  const toggleGroup = (groupTitle: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupTitle)) {
      newExpanded.delete(groupTitle);
    } else {
      newExpanded.add(groupTitle);
    }
    setExpandedGroups(newExpanded);
  };

  const filteredDocumentation = apiDocumentation.map((group) => ({
    ...group,
    endpoints: group.endpoints.filter(
      (endpoint) =>
        endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  const renderEndpointDetails = () => {
    if (!activeEndpoint) return null;

    const requestExampleString =
      activeEndpoint.requestExample !== null
        ? JSON.stringify(activeEndpoint.requestExample, null, 2)
        : '// No request body required';

    const responseExampleString = JSON.stringify(
      activeEndpoint.responseExample,
      null,
      2
    );

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <MethodBadge method={activeEndpoint.method} />
            <code className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded text-sm">
              {activeEndpoint.path}
            </code>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed">
            {activeEndpoint.description}
          </p>
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border-l-4 border-blue-600 rounded-lg p-4 shadow">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={18} className="text-blue-600" />
              <span className="font-semibold text-gray-700">
                Authentication
              </span>
            </div>
            <code className="text-sm bg-gray-100 p-2 rounded block">
              {activeEndpoint.authentication}
            </code>
          </div>
          {activeEndpoint.contentType && (
            <div className="bg-white border-l-4 border-purple-600 rounded-lg p-4 shadow">
              <div className="flex items-center gap-2 mb-2">
                <Eye size={18} className="text-purple-600" />
                <span className="font-semibold text-gray-700">
                  Content Type
                </span>
              </div>
              <code className="text-sm bg-gray-100 p-2 rounded block">
                {activeEndpoint.contentType}
              </code>
            </div>
          )}
        </div>

        {/* Fields */}
        {activeEndpoint.requiredFields &&
          activeEndpoint.requiredFields.length > 0 && (
            <CollapsibleSection title="📋 Required Fields" defaultOpen={true}>
              <div className="space-y-2">
                {activeEndpoint.requiredFields.map((field) => (
                  <div
                    key={field}
                    className="flex items-center gap-3 p-2 bg-red-50 border border-red-200 rounded"
                  >
                    <span className="text-red-600 font-bold">●</span>
                    <code className="text-sm font-mono text-red-700 font-semibold">
                      {field}
                    </code>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

        {activeEndpoint.optionalFields &&
          Object.keys(activeEndpoint.optionalFields).length > 0 && (
            <CollapsibleSection title="⚙️ Optional Fields" defaultOpen={true}>
              <div className="space-y-2">
                {Object.entries(activeEndpoint.optionalFields).map(
                  ([field, desc]) => (
                    <div
                      key={field}
                      className="p-3 bg-yellow-50 border border-yellow-200 rounded"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-600 font-bold">◇</span>
                        <code className="text-sm font-mono text-yellow-700 font-semibold">
                          {field}
                        </code>
                      </div>
                      <p className="text-xs text-gray-600 ml-6">{desc}</p>
                    </div>
                  )
                )}
              </div>
            </CollapsibleSection>
          )}

        {/* Request/Response */}
        <CollapsibleSection title="📤 Request Body Example" defaultOpen={true}>
          <CodeBlock title="JSON" code={requestExampleString} />
        </CollapsibleSection>

        <CollapsibleSection title="📥 Response Example" defaultOpen={true}>
          <CodeBlock title="JSON" code={responseExampleString} />
        </CollapsibleSection>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <main className="max-w-full mx-auto py-6 px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            🚀 DevConnect API Documentation
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
            Complete REST API reference for developer networking, profiles,
            connections, blogs, and real-time messaging.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search endpoints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <h3 className="font-bold text-sm">📚 API Groups</h3>
              </div>
              <nav className="max-h-[70vh] overflow-y-auto">
                {filteredDocumentation.map((group) => (
                  <div
                    key={group.title}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <button
                      onClick={() => toggleGroup(group.title)}
                      className="w-full text-left flex items-center justify-between p-3 hover:bg-gray-50 transition font-semibold text-gray-700 text-sm"
                    >
                      <span>{group.title}</span>
                      <ChevronDown
                        size={16}
                        className={`transform transition ${
                          expandedGroups.has(group.title) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedGroups.has(group.title) && (
                      <ul className="bg-gray-50 border-t border-gray-100">
                        {group.endpoints.map((endpoint) => (
                          <li key={endpoint.path}>
                            <button
                              onClick={() => setActiveEndpoint(endpoint)}
                              className={`w-full text-left flex items-start gap-2 py-2 px-4 text-xs transition-all ${
                                activeEndpoint?.path === endpoint.path
                                  ? 'bg-blue-100 text-blue-800 border-l-3 border-blue-600 font-bold'
                                  : 'text-gray-600 hover:bg-gray-100 border-l-3 border-transparent'
                              }`}
                            >
                              <ChevronRight
                                size={14}
                                className={`mt-0.5 flex-shrink-0 ${
                                  activeEndpoint?.path === endpoint.path
                                    ? 'text-blue-600'
                                    : ''
                                }`}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="font-mono text-xs break-words">
                                  {endpoint.path}
                                </div>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeEndpoint ? (
              <div className="space-y-4">{renderEndpointDetails()}</div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <h2 className="text-2xl font-bold text-gray-600 mb-2">
                  👈 Select an Endpoint
                </h2>
                <p className="text-gray-500">
                  Choose an API endpoint from the list to view its
                  documentation.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
