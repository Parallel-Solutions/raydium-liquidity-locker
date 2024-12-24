use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;

use crate::instructions::*;
declare_id!("LockgYZzP9P4AqsXU9jhLvnt88kefqJFeao7QKQRkCf");

#[program]
pub mod liquidity_locker {
    use super::*;

    /// Claims the fees generated from the locked position.
    ///
    /// # Arguments
    ///
    /// * `ctx` - The accounts required by the instruction.
    pub fn claim_fees(ctx: Context<ClaimFees>) -> Result<()> {
        claim_fees_handler(ctx)
    }

    /// Locks a raydium-clmm position for a specified duration.
    ///
    /// # Arguments
    ///
    /// * `ctx` - The accounts required by the instruction.
    /// * `duration` - The time in seconds until the position will be locked.
    /// * `allow_fee_claim` - A boolean value indicating whether fee claim is allowed on the locked position.
    pub fn lock_position(
        ctx: Context<LockPosition>,
        duration: u32,
        allow_fee_claim: bool
    ) -> Result<()> {
        lock_position_handler(ctx, duration, allow_fee_claim)
    }

    /// Unlocks the previously locked raydium-clmm position once the duration has passed.
    ///
    /// # Arguments
    ///
    /// * `ctx` - The accounts required by the instruction.
    pub fn unlock_position(ctx: Context<UnlockPosition>) -> Result<()> {
        unlock_position_handler(ctx)
    }
}
