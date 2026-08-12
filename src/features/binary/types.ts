/**
 * Binary feature API types — mirror the backend Binary module contract.
 */

export type BinaryPosition = 'left' | 'right'

export interface BinaryTreeNode {
  userId: string
  /** Parent node's userId (null for the root of the returned subtree). */
  parentId: string | null
  username: string
  position: BinaryPosition | null
  level: number
  leftTeamCount: number
  rightTeamCount: number
  leftTeamVolume: number
  rightTeamVolume: number
}

export interface BinaryTree {
  root: BinaryTreeNode
  children: BinaryTreeNode[]
}

export interface ChainLevelReward {
  level: number
  threshold: number
  reached: boolean
  paid: boolean
  payoutUsd: number
}

export interface BinaryStatistics {
  currentLevel: number
  leftTeamCount: number
  rightTeamCount: number
  leftTeamVolume: number
  rightTeamVolume: number
  totalEarnings: number
  nextLevelRequirement: number
  progress: number
  weakerLeg: 'left' | 'right'
  totalReferrals: number
  currentChainLevel: number
  nextChainLevelThreshold: number
  nextChainLevelProgress: number
  chainLevels: ChainLevelReward[]
}

/** Standard API envelope returned by the backend on success. */
export interface ApiSuccess<T> {
  success: true
  message: string
  data: T
}
