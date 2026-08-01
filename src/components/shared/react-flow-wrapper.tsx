'use client'

import { ReactNode } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type ReactFlowProps,
} from 'reactflow'
import 'reactflow/dist/style.css'

/**
 * Pre-configured React Flow canvas for the binary tree visualization.
 * The stylesheet is imported once here so feature code never has to.
 */

interface ReactFlowCanvasProps {
  children?: ReactNode
  nodes: ReactFlowProps['nodes']
  edges: ReactFlowProps['edges']
  onNodesChange?: ReactFlowProps['onNodesChange']
  onEdgesChange?: ReactFlowProps['onEdgesChange']
  onConnect?: ReactFlowProps['onConnect']
  nodeTypes?: ReactFlowProps['nodeTypes']
  fitView?: boolean
  className?: string
}

export function ReactFlowCanvas({
  children,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodeTypes,
  fitView = true,
  className,
}: ReactFlowCanvasProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView={fitView}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} size={1} />
        <Controls />
        <MiniMap pannable zoomable />
        {children}
      </ReactFlow>
    </div>
  )
}
