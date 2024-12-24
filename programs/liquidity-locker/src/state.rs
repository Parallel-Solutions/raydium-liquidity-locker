use anchor_lang::prelude::*;

pub const LOCKER_SEED: &[u8] = b"locker";

/// Represents the state of the locker.
///
/// This account is a PDA derived from `[user, nft_mint, LOCKER_SEED]`.
#[account]
pub struct Locker {
    /// The owner of the NFT.
    pub user: Pubkey,
    /// The mint address of the tokenized position.
    pub nft_mint: Pubkey,
    /// The time at which the NFT will be unlocked from the locker.
    pub unlock_time: u64,
    /// A boolean indicating whether fee claim is allowed on the locked position.
    pub allow_fee_claim: bool,
}

impl Locker {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 1;

    pub fn init(user: Pubkey, nft_mint: Pubkey, unlock_time: u64, allow_fee_claim: bool) -> Self {
        Self {
            user,
            nft_mint,
            unlock_time,
            allow_fee_claim,
        }
    }
}
