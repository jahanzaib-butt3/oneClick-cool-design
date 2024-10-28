import React from 'react';
import { Bot, Video } from 'lucide-react';

interface SidebarProps {
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
}

const tools = [
  { id: 'llm', name: 'AI Chat', icon: Bot },
  { id: 'video', name: 'Text to Video', icon: Video },
];

const Sidebar: React.FC<SidebarProps> = ({ selectedTool, setSelectedTool }) => {
  return (
    <div className="bg-gray-800 border-r border-gray-700 text-gray-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav className="space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`w-full px-4 py-3 rounded-lg transition duration-200 flex items-center ${
              selectedTool === tool.id 
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setSelectedTool(tool.id)}
          >
            <tool.icon className="mr-3 h-5 w-5" />
            {tool.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;