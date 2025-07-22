"use client";

import Image from "next/image";
import type { SectionData } from "./blog-editor";

interface BlogPreviewProps {
  sections: SectionData[];
}

export function BlogPreview({ sections }: BlogPreviewProps) {
  const renderBlock = (block: any) => {
    switch (block.type) {
      case "text":
        return (
          <div
            key={block.id}
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: block.content.html }}
          />
        );
      case "image":
        return (
          <div key={block.id} className="my-8">
            {block.content.src && (
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-lg shadow-md">
                  <Image
                    src={block.content.src || "/placeholder.svg"}
                    alt={block.content.alt || "Blog image"}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </div>
                {block.content.caption && (
                  <p className="text-center text-gray-600 italic text-sm">
                    {block.content.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      case "embed":
        return (
          <div key={block.id} className="my-8">
            {block.content.url && (
              <div className="space-y-3">
                {block.content.title && (
                  <h4 className="text-lg font-semibold text-gray-900 text-center">
                    {block.content.title}
                  </h4>
                )}
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-md bg-gray-100">
                  <iframe
                    src={getEmbedUrl(block.content.url)}
                    title={block.content.title || "Embedded content"}
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const getEmbedUrl = (url: string) => {
    // Convert YouTube watch URLs to embed URLs
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const getColumnClass = (columnCount: number) => {
    if (columnCount === 1) return "grid-cols-1";
    if (columnCount === 2) return "grid-cols-1 lg:grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Blog Header */}
      <div className="text-center mb-12 pb-8 border-b">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4">
          Preview Mode
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Your Blog Post Title
        </h1>
        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          This is how your blog post will appear to readers. The actual title
          and metadata will be set when you publish.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <span>Published on {new Date().toLocaleDateString()}</span>
          <span>•</span>
          <span>{calculateReadingTime()} min read</span>
        </div>
      </div>

      {/* Blog Content */}
      <article>
        {sections.map((section, sectionIndex) => (
          <section key={section.id} className="relative">
            {/* Section divider for multiple sections */}
            {/* {sectionIndex > 0 && (
              <div className="flex items-center justify-center mb-12">
                <div className="w-16 h-px bg-gray-300"></div>
                <div className="mx-4 text-gray-400 text-sm">•</div>
                <div className="w-16 h-px bg-gray-300"></div>
              </div>
            )} */}

            <div
              className={`grid gap-8 ${getColumnClass(section.columns.length)}`}
            >
              {section.columns.map((column) => (
                <div key={column.id} className="space-y-6">
                  {column.blocks.map(renderBlock)}
                </div>
              ))}
            </div>
          </section>
        ))}
      </article>

      {/* Blog Footer */}
      <div className="mt-16 pt-8 border-t">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>{sections.length} sections</span>
            <span>•</span>
            <span>{calculateWordCount()} words</span>
            <span>•</span>
            <span>{calculateReadingTime()} min read</span>
          </div>
          <p className="text-gray-600 italic">
            End of preview. Use the Editor tab to continue editing your blog
            post.
          </p>
        </div>
      </div>
    </div>
  );

  function calculateWordCount() {
    let wordCount = 0;
    sections.forEach((section) => {
      section.columns.forEach((column) => {
        column.blocks.forEach((block) => {
          if (block.type === "text" && block.content.html) {
            const text = block.content.html.replace(/<[^>]*>/g, "");
            wordCount += text
              .split(/\s+/)
              .filter((word) => word.length > 0).length;
          }
        });
      });
    });
    return wordCount;
  }

  function calculateReadingTime() {
    const wordsPerMinute = 200;
    const wordCount = calculateWordCount();
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }
}
