import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import base58 from 'bs58';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

import { IDL, AmmV3 } from './raydiumIDL';
import { LiquidityLocker } from '../target/types/liquidity_locker';
import keys from '../keys.json';

const provider = AnchorProvider.env();
anchor.setProvider(provider);

export const CONNECTION = new Connection(clusterApiUrl('mainnet-beta'));

export const DEPLOYER = anchor.web3.Keypair.fromSecretKey(base58.decode(keys.deployer));

export const program = anchor.workspace.LiquidityLocker as Program<LiquidityLocker>;

export const raydiumProgramId = new anchor.web3.PublicKey(
  'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK'
);

export const raydiumProgram = new anchor.Program(IDL, raydiumProgramId) as Program<AmmV3>;

export const MULTISIGN_KEY = new PublicKey('2YF1MKK32LPucNLtNpRfzX2xUTpwZw9upnVxVw5Pnsz5');
