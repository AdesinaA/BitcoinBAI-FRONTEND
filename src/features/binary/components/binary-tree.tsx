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
 *
 * Supports two rendering modes:
 * - default: compact cards (username, level, position)
 * - detailed: richer cards that also expose left/right team counts & volumes
 *
 * When the backend provides `parentId` on each node the layout is exact;
 * otherwise a level/position heuristic keeps older payloads working.
 */

interface NodeData {
  username: string
  level: number
  isRoot: boolean
  position: 'left' | 'right' | null
  leftTeamCount: number
  rightTeamCount: number
  leftTeamVolume: number
  rightTeamVolume: number
  detailed: boolean
  onClick?: (node: BinaryTreeNode) => void
  node: BinaryTreeNode
}

function formatVolume(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })
}

function BinaryNodeCard({ data }: NodeProps<NodeData>) {
  const clickable = Boolean(data.onClick)

  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={() => data.onClick?.(data.node)}
      onKeyDown={(event) => {
        if (!clickable) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          data.onClick?.(data.node)
        }
      }}
      className={`rounded-lg border px-3 py-2 text-center shadow-sm transition-colors ${
        data.isRoot
          ? 'border-gold/60 bg-gold/10'
          : data.position === 'left'
            ? 'border-gold/30 bg-card'
            : 'border-border bg-card'
      } ${clickable ? 'cursor-pointer hover:border-gold/70 hover:bg-gold/5' : ''} ${
        data.detailed ? 'w-48' : 'w-36'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
      <p className="truncate text-sm font-semibold">{data.username}</p>
      <p className="text-xs text-muted-foreground">
        Level {data.level}
        {data.position ? ` · ${data.position}` : ''}
      </p>
      {data.detailed && (
        <div className="mt-1.5 grid grid-cols-2 gap-1 border-t border-border/60 pt-1.5 text-[10px] leading-tight">
          <div className="rounded bg-gold/10 px-1 py-0.5">
            <span className="block font-semibold text-gold">
              {data.leftTeamCount}
            </span>
            <span className="text-muted-foreground">
              {formatVolume(data.leftTeamVolume)} BTC
            </span>
          </div>
          <div className="rounded bg-muted/60 px-1 py-0.5">
            <span className="block font-semibold">
              {data.rightTeamCount}
            </span>
            <span className="text-muted-foreground">
              {formatVolume(data.rightTeamVolume)} BTC
            </span>
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
    </div>
  )
}

const nodeTypes = { binary: BinaryNodeCard }

interface BinaryTreeViewProps {
  tree: BinaryTree
  className?: string
  /** Show team counts and volumes on each node. */
  detailed?: boolean
  /** Called when a node card is clicked (e.g. to drill into a subtree). */
  onNodeClick?: (node: BinaryTreeNode) => void
  /** Custom empty state rendered when the root has no downline yet. */
  emptyState?: React.ReactNode
  /** Canvas height in pixels. */
  height?: number
}

const H_GAP = 190
const V_GAP = 140

/**
 * Build an exact parent→children map when `parentId` metadata is available,
 * otherwise fall back to a level/position heuristic for older payloads.
 */
function buildChildrenMap(all: BinaryTreeNode[]): Map<string, BinaryTreeNode[]> {
  const childrenOf = new Map<string, BinaryTreeNode[]>()
  const hasParentIds = all.some((n) => n.parentId)

  if (hasParentIds) {
    const ids = new Set(all.map((n) => n.userId))
    for (const node of all) {
      if (node.parentId && ids.has(node.parentId)) {
        const list = childrenOf.get(node.parentId) ?? []
        list.push(node)
        childrenOf.set(node.parentId, list)
      }
    }
    return childrenOf
  }

  // Heuristic fallback: walk parents breadth-first and attach unassigned
  // nodes from the next level, preferring matching positions.
  const byLevel = new Map<number, BinaryTreeNode[]>()
  for (const node of all) {
    const list = byLevel.get(node.level) ?? []
    list.push(node)
    byLevel.set(node.level, list)
  }

  const assigned = new Set<string>([all[0]?.userId].filter(Boolean) as string[])
  const queue: BinaryTreeNode[] = all.slice(0, 1)

  while (queue.length > 0) {
    const parent = queue.shift() as BinaryTreeNode
    const candidates = (byLevel.get(parent.level + 1) ?? []).filter(
      (c) => !assigned.has(c.userId)
    )
    const left = candidates.find((c) => c.position === 'left')
    const right = candidates.find((c) => c.position === 'right')
    for (const child of [left, right]) {
      if (!child) continue
      assigned.add(child.userId)
      const list = childrenOf.get(parent.userId) ?? []
      list.push(child)
      childrenOf.set(parent.userId, list)
      queue.push(child)
    }
  }

  return childrenOf
}

/**
 * Tidy layered layout: leaves are placed left-to-right in order and every
 * parent is centred above its children, which guarantees no overlaps.
 */
function layoutTree(
  tree: BinaryTree,
  detailed: boolean,
  onNodeClick?: (node: BinaryTreeNode) => void
): { nodes: Node<NodeData>[]; edges: Edge[] } {
  const nodes: Node<NodeData>[] = []
  const edges: Edge[] = []

  const all = [tree.root, ...tree.children]
  const childrenOf = buildChildrenMap(all)

  const hGap = detailed ? H_GAP + 50 : H_GAP
  let leafCursor = 0

  function place(node: BinaryTreeNode, depth: number): number {
    const kids = (childrenOf.get(node.userId) ?? []).slice().sort((a, b) => {
      const rank = (n: BinaryTreeNode) => (n.position === 'left' ? 0 : 1)
      return rank(a) - rank(b)
    })

    let x: number
    if (kids.length === 0) {
      x = leafCursor * hGap
      leafCursor += 1
    } else {
      const childXs = kids.map((kid) => place(kid, depth + 1))
      x = (Math.min(...childXs) + Math.max(...childXs)) / 2
    }

    nodes.push({
      id: node.userId,
      type: 'binary',
      position: { x, y: depth * V_GAP },
      data: {
        username: node.username,
        level: node.level,
        isRoot: node.userId === tree.root.userId,
        position: node.position,
        leftTeamCount: node.leftTeamCount,
        rightTeamCount: node.rightTeamCount,
        leftTeamVolume: node.leftTeamVolume,
        rightTeamVolume: node.rightTeamVolume,
        detailed,
        onClick: node.userId === tree.root.userId ? undefined : onNodeClick,
        node,
      },
    })

    for (const kid of kids) {
      edges.push({
        id: `${node.userId}-${kid.userId}`,
        source: node.userId,
        target: kid.userId,
        animated: false,
        style: {
          stroke:
            kid.position === 'left'
              ? 'hsl(var(--gold))'
              : 'hsl(var(--muted-foreground))',
          strokeWidth: 2,
        },
      })
    }

    return x
  }

  place(tree.root, 0)
  return { nodes, edges }
}

export function BinaryTreeView({
  tree,
  className,
  detailed = false,
  onNodeClick,
  emptyState,
  height = 480,
}: BinaryTreeViewProps) {
  const { nodes, edges } = React.useMemo(
    () => layoutTree(tree, detailed, onNodeClick),
    [tree, detailed, onNodeClick]
  )

  if (tree.children.length === 0) {
    if (emptyState) return <>{emptyState}</>
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
    <div className={className} style={{ height }}>
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