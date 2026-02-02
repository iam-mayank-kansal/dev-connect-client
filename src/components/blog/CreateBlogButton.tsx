'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import CreateBlog from './create-blog';

export default function CreateBlogButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-all"
      >
        <Plus size={20} />
        Create Blog
      </button>

      <CreateBlog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
