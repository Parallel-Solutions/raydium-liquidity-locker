import * as anchor from '@coral-xyz/anchor';
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import { program, DEPLOYER } from '../constants';
import { RaydiumPosition } from '../position';
import { sendTx } from '../multisign';

//NFTs
// BEP2EPMSRd3NDuA98bVGYjcZhUrUTz6H9mz5ZUJ8ah17
// 831cbmr4q2skxC8qmT4ERV3mYutgjZMqeZ3wTddz1Gfs
// 57YrHj1o5fzcD6AryFY8eagWXVQPT7p4z228SitWXrpj

async function lockPosition() {
  const duration = 10 * 60;
  const allowFeeClaim = true;
  const user = DEPLOYER.publicKey;
  const { positionNftMint } = await new RaydiumPosition(
    'BEP2EPMSRd3NDuA98bVGYjcZhUrUTz6H9mz5ZUJ8ah17'
  ).getAccounts();

  const [locker] = anchor.web3.PublicKey.findProgramAddressSync(
    [user.toBuffer(), positionNftMint.toBuffer(), Buffer.from('locker')],
    program.programId
  );

  const nftVault = getAssociatedTokenAddressSync(positionNftMint, locker, true);
  const nftTokenAccount = getAssociatedTokenAddressSync(positionNftMint, user, false);

  const ix = await program.methods
    .lockPosition(duration, allowFeeClaim)
    .accounts({
      user,
      nftMint: positionNftMint,
      locker,
      nftVault,
      nftTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .instruction();

  const txId = await sendTx(DEPLOYER, [ix]);

  console.log('-----Position Locked Successfully-------');
  console.log('txId => ', txId);
}

lockPosition();
