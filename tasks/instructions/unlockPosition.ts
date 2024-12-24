import * as anchor from '@coral-xyz/anchor';
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import { program, DEPLOYER } from '../constants';
import { RaydiumPosition } from '../position';
import { sendTx } from '../multisign';

async function unlockPosition() {
  const user = DEPLOYER.publicKey;
  const { positionNftMint } = await new RaydiumPosition(
    '58HNqcQGiGsS2kwNvFR8EsAD34PmqjaUzdAh7sf9vHm7'
  ).getAccounts();

  const [locker] = anchor.web3.PublicKey.findProgramAddressSync(
    [user.toBuffer(), positionNftMint.toBuffer(), Buffer.from('locker')],
    program.programId
  );

  const nftVault = getAssociatedTokenAddressSync(positionNftMint, locker, true);
  const nftTokenAccount = getAssociatedTokenAddressSync(positionNftMint, user, true);

  const ix = await program.methods
    .unlockPosition()
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

  console.log('-----Position Unlocked Successfully-------');
  console.log('txId => ', txId);
}

unlockPosition();
