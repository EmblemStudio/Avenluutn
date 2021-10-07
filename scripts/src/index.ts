/**
 * Inputs:
 * - start time: 1633535222 (number, unix timestamp)
 * - time length: number
 * - copy number: number
 * - providerUrl: string
 */

/**
 * Process:
 * - if current block timestamp is before start time, fail
 * - find block hash of next block after start time
 * - 
 */

import Prando from 'prando'
import { ethers } from 'ethers'

export const prng = new Prando(123456789)

export async function tellNarrative(startTime: number, length: number, copyNumber: number) {
  
}