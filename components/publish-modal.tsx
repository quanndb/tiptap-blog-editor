"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Eye, Send, Globe } from "lucide-react"
import type { SectionData, LanguageVersion } from "./blog-editor"

interface PublishModalProps {
  isOpen: boolean
  onClose: () => void
  onPublish: (metadata: any) => Promise<void>
  sections: SectionData[]
  languages?: LanguageVersion[]
}

export function PublishModal({ isOpen, onClose, onPublish, sections, languages = [] }: PublishModalProps) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [category, setCategory] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [status, setStatus] = useState<"draft" | "published">("published")
  const [isPublishing, setIsPublishing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  if (!isOpen) return null

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handlePublish = async () => {
    if (!title.trim()) {
      alert("Please enter a title")
      return
    }

    setIsPublishing(true)

    try {
      await onPublish({
        title: title.trim(),
        slug: slug.trim() || generateSlug(title),
        excerpt: excerpt.trim(),
        tags,
        category: category.trim(),
        featuredImage: featuredImage.trim(),
        status,
      })
    } catch (error) {
      console.error("Publish failed:", error)
    } finally {
      setIsPublishing(false)
    }
  }

  const getPreviewData = () => {
    const wordCount = sections.reduce((count, section) => {
      return (
        count +
        section.columns.reduce((colCount, column) => {
          return (
            colCount +
            column.blocks.reduce((blockCount, block) => {
              if (block.type === "text" && block.content.html) {
                const text = block.content.html.replace(/<[^>]*>/g, "")
                return blockCount + text.split(/\s+/).filter((word) => word.length > 0).length
              }
              return blockCount
            }, 0)
          )
        }, 0)
      )
    }, 0)

    const imageCount = sections.reduce((count, section) => {
      return (
        count +
        section.columns.reduce((colCount, column) => {
          return colCount + column.blocks.filter((block) => block.type === "image").length
        }, 0)
      )
    }, 0)

    const embedCount = sections.reduce((count, section) => {
      return (
        count +
        section.columns.reduce((colCount, column) => {
          return colCount + column.blocks.filter((block) => block.type === "embed").length
        }, 0)
      )
    }, 0)

    return { wordCount, imageCount, embedCount }
  }

  const { wordCount, imageCount, embedCount } = getPreviewData()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{showPreview ? "Blog Preview" : "Publish Blog Post"}</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Edit" : "Preview"}
            </Button>
            <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {showPreview ? (
            <div className="space-y-6">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">Blog Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Sections:</span>
                    <div className="font-medium">{sections.length}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Words:</span>
                    <div className="font-medium">{wordCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Images:</span>
                    <div className="font-medium">{imageCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Embeds:</span>
                    <div className="font-medium">{embedCount}</div>
                  </div>
                </div>
              </div>

              {/* Language Versions */}
              {languages.length > 1 && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Language Versions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {languages.map((lang) => (
                      <div key={lang.code} className="flex items-center gap-2 p-2 bg-white rounded border">
                        <span className="text-lg">{lang.flag}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{lang.name}</div>
                          <div className="text-xs text-gray-500">
                            {lang.sections.length} sections •{" "}
                            {lang.sections.reduce((count, section) => {
                              return (
                                count +
                                section.columns.reduce((colCount, column) => {
                                  return (
                                    colCount +
                                    column.blocks.reduce((blockCount, block) => {
                                      if (block.type === "text" && block.content.html) {
                                        const text = block.content.html.replace(/<[^>]*>/g, "")
                                        return blockCount + text.split(/\s+/).filter((word) => word.length > 0).length
                                      }
                                      return blockCount
                                    }, 0)
                                  )
                                }, 0)
                              )
                            }, 0)}{" "}
                            words
                          </div>
                        </div>
                        {lang.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Title</h3>
                  <p className="text-gray-700">{title || "Untitled Blog Post"}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">URL Slug</h3>
                  <p className="text-gray-600 font-mono text-sm">/{slug || "untitled-blog-post"}</p>
                </div>

                {excerpt && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Excerpt</h3>
                    <p className="text-gray-700">{excerpt}</p>
                  </div>
                )}

                {category && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                    <Badge variant="secondary">{category}</Badge>
                  </div>
                )}

                {tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                  <Badge variant={status === "published" ? "default" : "secondary"}>{status}</Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter blog post title"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-friendly-slug"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of your blog post..."
                  rows={3}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Technology, Lifestyle"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <Input
                  id="featuredImage"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://example.com/featured-image.jpg"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag"
                    className="flex-1"
                  />
                  <Button onClick={addTag} size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {sections.length} sections • {wordCount} words
            {languages.length > 1 && <span className="ml-2">• {languages.length} languages</span>}
          </div>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            {!showPreview && (
              <Button
                onClick={handlePublish}
                disabled={isPublishing || !title.trim()}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isPublishing ? "Publishing..." : `Publish as ${status}`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
