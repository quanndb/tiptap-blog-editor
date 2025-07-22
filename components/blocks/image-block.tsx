"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, GripVertical, Upload, X } from "lucide-react"
import type { Block } from "../blog-editor"
import Image from "next/image"

interface ImageBlockProps {
  block: Block
  onUpdate: (blockId: string, content: any) => void
  onDelete: (blockId: string) => void
  onDragStart: () => void
}

export function ImageBlock({ block, onUpdate, onDelete, onDragStart }: ImageBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempSrc, setTempSrc] = useState(block.content.src)
  const [tempAlt, setTempAlt] = useState(block.content.alt)
  const [tempCaption, setTempCaption] = useState(block.content.caption)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    setIsUploading(true)

    try {
      // Create a local URL for the uploaded file
      const imageUrl = URL.createObjectURL(file)
      setTempSrc(imageUrl)

      // In a real application, you would upload to your server/cloud storage here
      // For demo purposes, we'll use the local object URL

      // Example of what you might do in production:
      // const formData = new FormData()
      // formData.append('image', file)
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData
      // })
      // const { url } = await response.json()
      // setTempSrc(url)
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleSave = () => {
    onUpdate(block.id, {
      src: tempSrc,
      alt: tempAlt,
      caption: tempCaption,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempSrc(block.content.src)
    setTempAlt(block.content.alt)
    setTempCaption(block.content.caption)
    setIsEditing(false)
  }

  const clearImage = () => {
    setTempSrc("")
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border group">
      <div className="flex items-center justify-between p-2 border-b bg-gray-50 rounded-t-lg">
        <span className="text-sm font-medium text-gray-700">Image Block</span>
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
            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-1">
                  {isUploading ? "Uploading..." : "Drop an image here or click to browse"}
                </p>
                <p className="text-xs text-gray-500">Supports JPG, PNG, GIF, WebP</p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Or enter image URL</label>
              <div className="flex gap-2">
                <Input
                  value={tempSrc}
                  onChange={(e) => setTempSrc(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                {tempSrc && (
                  <Button onClick={clearImage} size="sm" variant="outline" className="px-2 bg-transparent">
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Preview */}
            {tempSrc && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Preview</label>
                <div className="relative max-w-sm">
                  <Image
                    src={tempSrc || "/placeholder.svg"}
                    alt="Preview"
                    width={300}
                    height={200}
                    className="w-full h-auto rounded-md border"
                    onError={() => {
                      console.error("Failed to load image")
                      setTempSrc("")
                    }}
                  />
                </div>
              </div>
            )}

            {/* Alt Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
              <Input
                value={tempAlt}
                onChange={(e) => setTempAlt(e.target.value)}
                placeholder="Describe the image for accessibility"
              />
              <p className="text-xs text-gray-500 mt-1">Alt text helps screen readers and improves SEO</p>
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
              <Input
                value={tempCaption}
                onChange={(e) => setTempCaption(e.target.value)}
                placeholder="Image caption (optional)"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} size="sm" disabled={!tempSrc || isUploading}>
                Save
              </Button>
              <Button onClick={handleCancel} size="sm" variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {block.content.src ? (
              <div className="space-y-2">
                <div className="relative">
                  <Image
                    src={block.content.src || "/placeholder.svg"}
                    alt={block.content.alt || "Blog image"}
                    width={400}
                    height={300}
                    className="w-full h-auto rounded-md"
                    onError={(e) => {
                      console.error("Failed to load image:", block.content.src)
                    }}
                  />
                </div>
                {block.content.caption && (
                  <p className="text-sm text-gray-600 italic text-center">{block.content.caption}</p>
                )}
                {block.content.alt && <p className="text-xs text-gray-500">Alt: {block.content.alt}</p>}
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => setIsEditing(true)}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 mb-1">No image selected</p>
                <p className="text-xs text-gray-400">Click Edit to upload or add an image</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
