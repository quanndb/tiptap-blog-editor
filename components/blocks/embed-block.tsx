"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, GripVertical, Video, Code, ExternalLink } from "lucide-react"
import type { Block } from "../blog-editor"

interface EmbedBlockProps {
  block: Block
  onUpdate: (blockId: string, content: any) => void
  onDelete: (blockId: string) => void
  onDragStart: () => void
}

export function EmbedBlock({ block, onUpdate, onDelete, onDragStart }: EmbedBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempUrl, setTempUrl] = useState(block.content.url || "")
  const [tempIframe, setTempIframe] = useState(block.content.iframe || "")
  const [tempTitle, setTempTitle] = useState(block.content.title || "")
  const [embedType, setEmbedType] = useState<"url" | "iframe">(block.content.iframe ? "iframe" : "url")

  const handleSave = () => {
    const content: any = {
      title: tempTitle,
    }

    if (embedType === "iframe" && tempIframe.trim()) {
      content.iframe = tempIframe.trim()
      content.url = extractUrlFromIframe(tempIframe) || ""
    } else if (embedType === "url" && tempUrl.trim()) {
      content.url = tempUrl.trim()
      content.iframe = ""
    }

    onUpdate(block.id, content)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempUrl(block.content.url || "")
    setTempIframe(block.content.iframe || "")
    setTempTitle(block.content.title || "")
    setEmbedType(block.content.iframe ? "iframe" : "url")
    setIsEditing(false)
  }

  const extractUrlFromIframe = (iframeCode: string): string | null => {
    const srcMatch = iframeCode.match(/src=["']([^"']+)["']/i)
    return srcMatch ? srcMatch[1] : null
  }

  const getEmbedUrl = (url: string) => {
    if (!url) return ""

    // YouTube URLs
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }

    // Vimeo URLs
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0]
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url
    }

    // CodePen URLs
    if (url.includes("codepen.io/") && url.includes("/pen/")) {
      return url.replace("/pen/", "/embed/")
    }

    // For other URLs, assume they're already embed-ready
    return url
  }

  const renderEmbed = () => {
    if (block.content.iframe) {
      // Extract and modify iframe for responsive design
      const modifiedIframe = block.content.iframe
        .replace(/width=["'][^"']*["']/gi, 'width="100%"')
        .replace(/height=["'][^"']*["']/gi, 'height="100%"')
        .replace(/style=["'][^"']*["']/gi, 'style="width: 100%; height: 100%; border: 0;"')
        .replace(/<iframe/gi, '<iframe style="width: 100%; height: 100%; border: 0;"')

      return <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: modifiedIframe }} />
    } else if (block.content.url) {
      // Render URL-based embed
      const embedUrl = getEmbedUrl(block.content.url)
      return (
        <iframe
          src={embedUrl}
          title={block.content.title || "Embedded content"}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          style={{ width: "100%", height: "100%", border: 0 }}
        />
      )
    }
    return null
  }

  const getAspectRatio = () => {
    // Check if it's a map embed
    if (
      block.content.iframe?.includes("maps.google") ||
      block.content.iframe?.includes("openstreetmap") ||
      block.content.url?.includes("maps.google") ||
      block.content.url?.includes("openstreetmap")
    ) {
      return "16 / 10" // Better ratio for maps
    }

    // Check if it's a social media embed
    if (
      block.content.iframe?.includes("twitter.com") ||
      block.content.iframe?.includes("instagram.com") ||
      block.content.iframe?.includes("facebook.com")
    ) {
      return "auto" // Let social embeds use their natural height
    }

    // Default video aspect ratio
    return "16 / 9"
  }

  const getEmbedPreview = () => {
    if (embedType === "iframe" && tempIframe.trim()) {
      return (
        <div className="border rounded-lg p-2 bg-gray-50">
          <div className="text-xs text-gray-600 mb-2">Preview:</div>
          <div className="w-full rounded overflow-hidden" style={{ aspectRatio: "16 / 9", maxHeight: "200px" }}>
            <div className="w-full h-full scale-50 origin-top-left" style={{ width: "200%", height: "200%" }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: tempIframe
                    .replace(/width=["'][^"']*["']/gi, 'width="100%"')
                    .replace(/height=["'][^"']*["']/gi, 'height="100%"'),
                }}
              />
            </div>
          </div>
        </div>
      )
    } else if (embedType === "url" && tempUrl.trim()) {
      const embedUrl = getEmbedUrl(tempUrl)
      return (
        <div className="border rounded-lg p-2 bg-gray-50">
          <div className="text-xs text-gray-600 mb-2">Preview URL:</div>
          <div className="text-sm font-mono text-blue-600 break-all">{embedUrl}</div>
        </div>
      )
    }
    return null
  }

  const detectEmbedType = (input: string) => {
    if (input.trim().startsWith("<iframe") || input.includes("<iframe")) {
      setEmbedType("iframe")
      setTempIframe(input)
      setTempUrl("")
    } else if (input.includes("http")) {
      setEmbedType("url")
      setTempUrl(input)
      setTempIframe("")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border group">
      <div className="flex items-center justify-between p-2 border-b bg-gray-50 rounded-t-lg">
        <span className="text-sm font-medium text-gray-700">Embed Block</span>
        <div className="flex items-center gap-1">
          <Button onClick={() => setIsEditing(!isEditing)} size="sm" variant="ghost" className="h-8 px-2 text-xs">
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
            draggable
            onDragStart={onDragStart}
          >
            <GripVertical className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onDelete(block.id)}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            {/* Embed Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Embed Type</label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setEmbedType("url")}
                  size="sm"
                  variant={embedType === "url" ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  URL
                </Button>
                <Button
                  onClick={() => setEmbedType("iframe")}
                  size="sm"
                  variant={embedType === "iframe" ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  Custom Iframe
                </Button>
              </div>
            </div>

            {embedType === "url" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Embed URL</label>
                <Input
                  value={tempUrl}
                  onChange={(e) => {
                    setTempUrl(e.target.value)
                    detectEmbedType(e.target.value)
                  }}
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports YouTube, Vimeo, CodePen, and other embeddable URLs
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Iframe Code</label>
                <Textarea
                  value={tempIframe}
                  onChange={(e) => {
                    setTempIframe(e.target.value)
                    detectEmbedType(e.target.value)
                  }}
                  placeholder='<iframe src="https://example.com" width="560" height="315" frameborder="0" allowfullscreen></iframe>'
                  rows={4}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste the complete iframe code from the source (YouTube, Twitter, CodePen, etc.)
                </p>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                placeholder="Embed title or description"
              />
            </div>

            {/* Preview */}
            {getEmbedPreview()}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} size="sm" disabled={!tempUrl.trim() && !tempIframe.trim()}>
                Save
              </Button>
              <Button onClick={handleCancel} size="sm" variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {block.content.url || block.content.iframe ? (
              <div>
                {block.content.title && <h4 className="font-medium text-gray-900 mb-3">{block.content.title}</h4>}
                <div
                  className="relative w-full rounded-lg overflow-hidden bg-gray-100 shadow-md"
                  style={{ aspectRatio: getAspectRatio() }}
                >
                  {renderEmbed()}
                </div>
                {/* Source info */}
                <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                  {block.content.iframe ? (
                    <>
                      <Code className="w-3 h-3" />
                      Custom iframe embed
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3 h-3" />
                      {new URL(getEmbedUrl(block.content.url)).hostname}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => setIsEditing(true)}
              >
                <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 mb-1">No embed content</p>
                <p className="text-xs text-gray-400">Click Edit to add a URL or paste iframe code</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
