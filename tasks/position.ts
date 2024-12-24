import * as anchor from '@coral-xyz/anchor';
import { TickUtils } from '@raydium-io/raydium-sdk';

import { raydiumProgram } from './constants';

function i32ToBytes(num: number) {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setInt32(0, num, false);
  return new Uint8Array(arr);
}

export class RaydiumPosition {
  positionNftMint: anchor.web3.PublicKey;
  personalPosition: anchor.web3.PublicKey;

  constructor(nftMint: string) {
    this.positionNftMint = new anchor.web3.PublicKey(nftMint);
    this.personalPosition = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('position'), this.positionNftMint.toBuffer()],
      raydiumProgram.programId
    )[0];
  }

  private protocolPosition(
    poolState: anchor.web3.PublicKey,
    tickLowerIndex: number,
    tickUpperIndex: number
  ) {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('position'),
        poolState.toBuffer(),
        i32ToBytes(tickLowerIndex),
        i32ToBytes(tickUpperIndex),
      ],
      raydiumProgram.programId
    );
  }

  private tickArray(poolState: anchor.web3.PublicKey, tickArray: number) {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('tick_array'), poolState.toBuffer(), i32ToBytes(tickArray)],
      raydiumProgram.programId
    );
  }

  async getAccounts() {
    const {
      poolId: poolState,
      tickLowerIndex,
      tickUpperIndex,
    } = await raydiumProgram.account.personalPositionState.fetch(this.personalPosition);

    const { ammConfig, tokenMint0, tokenMint1, tokenVault0, tokenVault1, tickSpacing } =
      await raydiumProgram.account.poolState.fetch(poolState);

    const tickArrayLowerStartIndex = TickUtils.getTickArrayStartIndexByTick(
      tickLowerIndex,
      tickSpacing
    );
    const tickArrayUpperStartIndex = TickUtils.getTickArrayStartIndexByTick(
      tickUpperIndex,
      tickSpacing
    );

    const [protocolPosition] = this.protocolPosition(poolState, tickLowerIndex, tickUpperIndex);

    return {
      ammConfig,
      personalPosition: this.personalPosition,
      positionNftMint: this.positionNftMint,
      poolState,
      protocolPosition,
      tokenMint0,
      tokenMint1,
      tokenVault0,
      tokenVault1,
      tickArrayLower: this.tickArray(poolState, tickArrayLowerStartIndex)[0],
      tickArrayUpper: this.tickArray(poolState, tickArrayUpperStartIndex)[0],
    };
  }
}
