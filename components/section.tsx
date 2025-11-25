"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type {
  Block,
  Column as ColumnType,
  Row as RowType,
  SectionData,
} from "./blog-editor";
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
    sourceRowId: string;
  } | null>(null);

  const generateId = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const createColumn = (): ColumnType => ({
    id: generateId("col"),
    blocks: [],
  });

  const createRow = (): RowType => ({
    id: generateId("row"),
    columns: [createColumn()],
  });

  const addRow = () => {
    onUpdate(section.id, {
      ...section,
      rows: [...section.rows, createRow()],
    });
  };

  const removeRow = (rowId: string) => {
    if (section.rows.length <= 1) return;
    onUpdate(section.id, {
      ...section,
      rows: section.rows.filter((row) => row.id !== rowId),
    });
  };

  const addColumn = (rowId: string) => {
    onUpdate(section.id, {
      ...section,
      rows: section.rows.map((row) =>
        row.id === rowId
          ? { ...row, columns: [...row.columns, createColumn()] }
          : row
      ),
    });
  };

  const removeColumn = (rowId: string, columnId: string) => {
    const targetRow = section.rows.find((row) => row.id === rowId);
    if (!targetRow || targetRow.columns.length <= 1) return;

    onUpdate(section.id, {
      ...section,
      rows: section.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              columns: row.columns.filter((col) => col.id !== columnId),
            }
          : row
      ),
    });
  };

  const updateColumn = (
    rowId: string,
    columnId: string,
    updatedColumn: ColumnType
  ) => {
    onUpdate(section.id, {
      ...section,
      rows: section.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              columns: row.columns.map((col) =>
                col.id === columnId ? updatedColumn : col
              ),
            }
          : row
      ),
    });
  };

  const handleDragStart = (
    block: Block,
    sourceRowId: string,
    sourceColumnId: string
  ) => {
    setDraggedBlock({ block, sourceColumnId, sourceRowId });
  };

  const handleDrop = (
    targetRowId: string,
    targetColumnId: string,
    targetIndex?: number
  ) => {
    if (!draggedBlock) return;

    if (
      targetColumnId === draggedBlock.sourceColumnId &&
      targetRowId === draggedBlock.sourceRowId
    ) {
      return;
    }

    const { block, sourceColumnId, sourceRowId } = draggedBlock;

    const rowsWithoutBlock = section.rows.map((row) => {
      if (row.id !== sourceRowId) return row;
      return {
        ...row,
        columns: row.columns.map((column) =>
          column.id === sourceColumnId
            ? {
                ...column,
                blocks: column.blocks.filter((b) => b.id !== block.id),
              }
            : column
        ),
      };
    });

    const targetRowIndex = rowsWithoutBlock.findIndex(
      (row) => row.id === targetRowId
    );
    if (targetRowIndex === -1) return;

    const targetRow = rowsWithoutBlock[targetRowIndex];
    const targetColumnIndex = targetRow.columns.findIndex(
      (column) => column.id === targetColumnId
    );
    if (targetColumnIndex === -1) return;

    const targetColumn = targetRow.columns[targetColumnIndex];
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

    const finalRows = rowsWithoutBlock.map((row) => {
      if (row.id !== targetRowId) return row;
      return {
        ...row,
        columns: row.columns.map((column) =>
          column.id === targetColumnId ? updatedTargetColumn : column
        ),
      };
    });

    onUpdate(section.id, {
      ...section,
      rows: finalRows,
    });

    setDraggedBlock(null);
  };

  const rowCountLabel = `Section • ${section.rows.length} row${
    section.rows.length === 1 ? "" : "s"
  }`;

  return (
    <div className="border rounded-lg p-4 bg-gray-50/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {rowCountLabel}
          </span>
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

      <div className="space-y-4">
        {section.rows.map((row, rowIndex) => (
          <div key={row.id} className="rounded-lg border bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-medium text-gray-600">
                Row {rowIndex + 1} • {row.columns.length} column
                {row.columns.length === 1 ? "" : "s"}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => addColumn(row.id)}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add column
                </Button>
                {section.rows.length > 1 && (
                  <Button
                    onClick={() => removeRow(row.id)}
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>

            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${Math.max(
                  row.columns.length,
                  1
                )}, minmax(0, 1fr))`,
              }}
            >
              {row.columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  onUpdate={(columnId, updatedColumn) =>
                    updateColumn(row.id, columnId, updatedColumn)
                  }
                  onRemove={(columnId) => removeColumn(row.id, columnId)}
                  canRemove={row.columns.length > 1}
                  onDragStart={(block, sourceColumnId) =>
                    handleDragStart(block, row.id, sourceColumnId)
                  }
                  onDrop={(targetColumnId, targetIndex) =>
                    handleDrop(row.id, targetColumnId, targetIndex)
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          onClick={addRow}
          variant="outline"
          className="flex items-center gap-2 border-dashed"
        >
          <Plus className="w-4 h-4" />
          Add row
        </Button>
      </div>
    </div>
  );
}
