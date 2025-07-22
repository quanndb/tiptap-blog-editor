"use client"

import { BlogEditor } from "@/components/blog-editor"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Editor</h1>
          <p className="text-gray-600">Create and customize your blog posts with our flexible editor</p>
        </div>
        <BlogEditor />
      </div>
    </div>
  )
}
