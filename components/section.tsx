"use client";

import { Button } from "@/components/ui/button";
import { Columns2, Columns3, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Block, Column as ColumnType, SectionData } from "./blog-editor";
import { Column } from "./column";

interface SectionProps {
  section: SectionData;
  onUpdate: (sectionId: string, section: SectionData) => void;
  onDelete: (sectionId: string) => void;
}

export function Section({ section, onUpdate, onDelete }: SectionProps) {
  const [draggedBlock, setDraggedBlock] = useState<{
    block: Block;
    sourceColumnId: string;
  } | null>(null);

  const addColumn = () => {
    if (section.columns.length >= 3) return;

    const newColumn: ColumnType = {
      id: `col-${Date.now()}`,
      blocks: [],
    };

    onUpdate(section.id, {
      ...section,
      columns: [...section.columns, newColumn],
    });
  };

  const removeColumn = (columnId: string) => {
    if (section.columns.length <= 1) return;

    onUpdate(section.id, {
      ...section,
      columns: section.columns.filter((col) => col.id !== columnId),
    });
  };

  const updateColumn = (columnId: string, updatedColumn: ColumnType) => {
    onUpdate(section.id, {
      ...section,
      columns: section.columns.map((col) =>
        col.id === columnId ? updatedColumn : col
      ),
    });
  };

  const handleDragStart = (block: Block, sourceColumnId: string) => {
    setDraggedBlock({ block, sourceColumnId });
  };

  const handleDrop = (targetColumnId: string, targetIndex?: number) => {
    if (!draggedBlock) return;

    if (targetColumnId === draggedBlock.sourceColumnId) return;

    const { block, sourceColumnId } = draggedBlock;

    // Remove from source column
    const sourceColumn = section.columns.find(
      (col) => col.id === sourceColumnId
    );
    if (!sourceColumn) return;

    const updatedSourceColumn = {
      ...sourceColumn,
      blocks: sourceColumn.blocks.filter((b) => b.id !== block.id),
    };

    // Add to target column
    const targetColumn = section.columns.find(
      (col) => col.id === targetColumnId
    );
    if (!targetColumn) return;

    const insertIndex =
      targetIndex !== undefined ? targetIndex : targetColumn.blocks.length;
    const updatedTargetColumn = {
      ...targetColumn,
      blocks: [
        ...targetColumn.blocks.slice(0, insertIndex),
        block,
        ...targetColumn.blocks.slice(insertIndex),
      ],
    };

    // Update section
    onUpdate(section.id, {
      ...section,
      columns: section.columns.map((col) => {
        if (col.id === sourceColumnId) return updatedSourceColumn;
        if (col.id === targetColumnId) return updatedTargetColumn;
        return col;
      }),
    });

    setDraggedBlock(null);
  };

  const getColumnClass = () => {
    const count = section.columns.length;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Section</span>
          <div className="flex items-center gap-1">
            {section.columns.length < 3 && (
              <Button
                onClick={addColumn}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            )}
            {section.columns.length === 2 && (
              <Columns2 className="w-3 h-3 text-gray-400" />
            )}
            {section.columns.length === 3 && (
              <Columns3 className="w-3 h-3 text-gray-400" />
            )}
          </div>
        </div>
        <Button
          onClick={() => onDelete(section.id)}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      <div className={`grid gap-4 ${getColumnClass()}`}>
        {section.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onUpdate={updateColumn}
            onRemove={removeColumn}
            canRemove={section.columns.length > 1}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}
