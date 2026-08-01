'use client'

import * as React from 'react'
import type { Edge, Node, NodeProps } from 'reactflow'
import { Handle, Position } from 'reactflow'

import { ReactFlowCanvas } from '@/components/shared/react-flow-wrapper'
import type { BinaryTree, BinaryTreeNode } from '../types'

/**
 * Binary tree visualization built on React Flow.
 * Lays out the root + descendants in a layered binary arrangement and links
 * parents to their left/right children with coloured edges.
 */

interface NodeData {
  username: string
  level: number
  isRoot: boolean
  position: 'left' | 'right' | null
}

function BinaryNodeCard({ data }: NodeProps<NodeData>) {
  return (
    <div
      className={`w-36 rounded-lg border px-3 py-2 text-center shadow-sm ${
        data.isRoot
          ? 'border-gold/50 bg-gold/10'
          : 'border-border bg-card'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
      <p className="truncate text-sm font-semibold">{data.username}</p>
      <p className="text-xs text-muted-foreground">
        Level {data.level}
        {data.position ? ` · ${data.position}` : ''}
      </p>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
    </div>
  )
}

const nodeTypes = { binary: BinaryNodeCard }

interface BinaryTreeViewProps {
  tree: BinaryTree
  className?: string
}

/** Horizontal spacing per sibling slot, shrinking as depth grows. */
function layoutTree(tree: BinaryTree): { nodes: Node<NodeData>[]; edges: Edge[] } {
  const nodes: Node<NodeData>[] = []
  const edges: Edge[] = []

  // Index children by parent for layout. We only know each child's position
  // relative to its parent via `position`, so we reconstruct parentage by
  // walking levels: children whose level == parent.level + 1 and whose
  // position matches an open slot under that parent.
  const byLevel = new Map<number, BinaryTreeNode[]>()
  const all = [tree.root, ...tree.children]
  for (const n of all) {
    const list = byLevel.get(n.level) ?? []
    list.push(n)
    byLevel.set(n.level, list)
  }

  const H_GAP = 200
  const V_GAP = 130

  // Position the root at (0,0).
  nodes.push({
    id: tree.root.userId,
    type: 'binary',
    position: { x: 0, y: 0 },
    data: {
      username: tree.root.username,
      level: tree.root.level,
      isRoot: true,
      position: tree.root.position,
    },
  })

  // Recursively position children under their parent.
  function placeChildren(parent: BinaryTreeNode, x: number, y: number, depth: number) {
    const nextLevel = parent.level + 1
    const candidates = (byLevel.get(nextLevel) ?? []).filter(
      (c) => !nodes.some((n) => n.id === c.userId)
    )
    // A parent has at most a left and a right child.
    const left = candidates.find((c) => c.position === 'left')
    const right = candidates.find((c) => c.position === 'right')
    const spread = H_GAP / Math.pow(2, depth)

    if (left) {
      const cx = x - spread
      const cy = y + V_GAP
      nodes.push({
        id: left.userId,
        type: 'binary',
        position: { x: cx, y: cy },
        data: { username: left.username, level: left.level, isRoot: false, position: 'left' },
      })
      edges.push({
        id: `${parent.userId}-${left.userId}`,
        source: parent.userId,
        target: left.userId,
        animated: false,
        style: { stroke: 'hsl(var(--gold))', strokeWidth: 2 },
      })
      placeChildren(left, cx, cy, depth + 1)
    }
    if (right) {
      const cx = x + spread
      const cy = y + V_GAP
      nodes.push({
        id: right.userId,
        type: 'binary',
        position: { x: cx, y: cy },
        data: { username: right.username, level: right.level, isRoot: false, position: 'right' },
      })
      edges.push({
        id: `${parent.userId}-${right.userId}`,
        source: parent.userId,
        target: right.userId,
        animated: false,
        style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2 },
      })
      placeChildren(right, cx, cy, depth + 1)
    }
  }

  placeChildren(tree.root, 0, 0, 1)
  return { nodes, edges }
}

export function BinaryTreeView({ tree, className }: BinaryTreeViewProps) {
  const { nodes, edges } = React.useMemo(() => layoutTree(tree), [tree])

  if (tree.children.length === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-lg border border-dashed border-border">
        <div className="text-center">
          <p className="text-sm font-medium">No downline yet</p>
          <p className="text-sm text-muted-foreground">
            Your network will appear here once members join under you.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={className} style={{ height: 480 }}>
      <ReactFlowCanvas
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="rounded-lg border border-border bg-background"
      />
    </div>
  )
}
