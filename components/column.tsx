"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Type, ImageIcon, Video } from "lucide-react";
import type { Column as ColumnType, Block } from "./blog-editor";
import { TextBlock } from "./blocks/text-block";
import { ImageBlock } from "./blocks/image-block";
import { EmbedBlock } from "./blocks/embed-block";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnProps {
  column: ColumnType;
  onUpdate: (columnId: string, column: ColumnType) => void;
  onRemove: (columnId: string) => void;
  canRemove: boolean;
  onDragStart: (block: Block, sourceColumnId: string) => void;
  onDrop: (targetColumnId: string, targetIndex?: number) => void;
}

export function Column({
  column,
  onUpdate,
  onRemove,
  canRemove,
  onDragStart,
  onDrop,
}: ColumnProps) {
  const [dragOver, setDragOver] = useState(false);

  const addBlock = (type: "text" | "image" | "embed") => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
    };

    onUpdate(column.id, {
      ...column,
      blocks: [...column.blocks, newBlock],
    });
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case "text":
        return { html: "<p>Start writing...</p>" };
      case "image":
        return {
          src: "/placeholder.svg?height=200&width=300&text=Add+Image",
          alt: "",
          caption: "",
        };
      case "embed":
        return { url: "", title: "Embed Content" };
      default:
        return {};
    }
  };

  const updateBlock = (blockId: string, content: any) => {
    onUpdate(column.id, {
      ...column,
      blocks: column.blocks.map((block) =>
        block.id === blockId ? { ...block, content } : block
      ),
    });
  };

  const deleteBlock = (blockId: string) => {
    onUpdate(column.id, {
      ...column,
      blocks: column.blocks.filter((block) => block.id !== blockId),
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    onDrop(column.id);
  };

  const renderBlock = (block: Block) => {
    const commonProps = {
      block,
      onUpdate: updateBlock,
      onDelete: deleteBlock,
      onDragStart: () => onDragStart(block, column.id),
    };

    switch (block.type) {
      case "text":
        return <TextBlock key={block.id} {...commonProps} />;
      case "image":
        return <ImageBlock key={block.id} {...commonProps} />;
      case "embed":
        return <EmbedBlock key={block.id} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-3 min-h-[200px] transition-colors ${
        dragOver ? "border-blue-400 bg-blue-50" : "border-gray-200"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500">Column</span>
        {canRemove && (
          <Button
            onClick={() => onRemove(column.id)}
            size="sm"
            variant="ghost"
            className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {column.blocks.map(renderBlock)}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full border-2 border-dashed border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 py-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Block
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => addBlock("text")}>
              <Type className="w-4 h-4 mr-2" />
              Text Block
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock("image")}>
              <ImageIcon className="w-4 h-4 mr-2" />
              Image Block
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock("embed")}>
              <Video className="w-4 h-4 mr-2" />
              Embed Block
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
